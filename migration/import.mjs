import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    if (arg === '--dry-run') {
      return ['dryRun', true];
    }

    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? true];
  })
);

const DRY = Boolean(args.dryRun);
const IMPORT_PAYMENTS = Boolean(args.importPayments);
const defaultSourceFile = existsSync(path.join(__dirname, 'invoices_data_full.json'))
  ? path.join(__dirname, 'invoices_data_full.json')
  : path.join(__dirname, 'invoices_data.json');
const FILE = args.file ? path.resolve(process.cwd(), String(args.file)) : defaultSourceFile;

console.log(`Source file: ${FILE}`);
if (DRY) {
  console.log('DRY RUN - no writes will happen\n');
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DRY && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in migration/.env (use --dry-run to skip writes)');
  process.exit(1);
}

const supabase = DRY
  ? null
  : createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const raw = JSON.parse(readFileSync(FILE, 'utf-8'));
const invoices = raw.invoices || [];

console.log(`Loaded ${invoices.length} invoices from JSON\n`);

function cleanName(value) {
  return (value || '').toString().trim().replace(/\s+/g, ' ');
}

function normalizeCustomerName(name) {
  if (!name) {
    return null;
  }

  const normalized = cleanName(name).toUpperCase();
  if (normalized.includes('BIG BOB')) {
    return 'BIG BOBS FLORIDA LLC';
  }
  if (normalized.includes('WEST ORANGE') || normalized.includes('WOKB')) {
    return 'West Orange Kitchen and Bathroom';
  }

  return cleanName(name);
}

function getSections(invoice) {
  if (invoice.sections?.length) {
    return invoice.sections;
  }
  if (invoice.items?.length) {
    return [{ title: null, items: invoice.items }];
  }
  return [];
}

let companyId = null;
const customerIdByName = {};
const projectIdByCode = {};

async function getCompanyId() {
  if (DRY) {
    return 'dry-company';
  }

  const { data, error } = await supabase
    .from('companies')
    .select('id')
    .eq('name', 'Biaggio Flooring LLC')
    .limit(1);

  if (error) {
    throw error;
  }
  if (!data.length) {
    throw new Error('Run migration/01_schema.sql first - Biaggio Flooring LLC is missing');
  }

  return data[0].id;
}

async function upsertCustomer(name) {
  if (!name) {
    return null;
  }
  if (customerIdByName[name]) {
    return customerIdByName[name];
  }
  if (DRY) {
    customerIdByName[name] = `dry-cust-${name}`;
    return customerIdByName[name];
  }

  const { data: existing, error: lookupError } = await supabase
    .from('customers')
    .select('id')
    .ilike('customer_name', name)
    .limit(1);

  if (lookupError) {
    throw lookupError;
  }
  if (existing?.length) {
    customerIdByName[name] = existing[0].id;
    return existing[0].id;
  }

  const { data: inserted, error } = await supabase
    .from('customers')
    .insert({ customer_name: name })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  customerIdByName[name] = inserted.id;
  console.log(`   + customer: ${name}`);
  return inserted.id;
}

async function upsertProject(code, name, customerId, siteAddress = null) {
  const projectCode = code || name;
  if (projectIdByCode[projectCode]) {
    return projectIdByCode[projectCode];
  }
  if (DRY) {
    projectIdByCode[projectCode] = `dry-proj-${projectCode}`;
    return projectIdByCode[projectCode];
  }

  const { data: existing, error: lookupError } = await supabase
    .from('projects')
    .select('id')
    .eq('project_code', projectCode)
    .limit(1);

  if (lookupError) {
    throw lookupError;
  }
  if (existing?.length) {
    projectIdByCode[projectCode] = existing[0].id;
    return existing[0].id;
  }

  const { data: inserted, error } = await supabase
    .from('projects')
    .insert({
      project_code: projectCode,
      project_name: cleanName(name) || projectCode,
      customer_id: customerId,
      address: siteAddress
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  projectIdByCode[projectCode] = inserted.id;
  console.log(`   + project: ${projectCode}`);
  return inserted.id;
}

async function invoiceAlreadyImported(sourceSheetId) {
  if (DRY) {
    return false;
  }

  if (sourceSheetId) {
    const { data, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('source_sheet_id', sourceSheetId)
      .limit(1);

    if (error) {
      throw error;
    }
    return Boolean(data?.length);
  }

  return false;
}

async function invoiceAlreadyImportedByName(sourceSheetName) {
  if (!sourceSheetName || DRY) {
    return false;
  }

  const { data, error } = await supabase
    .from('invoices')
    .select('id')
    .eq('source_sheet_name', sourceSheetName)
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(data?.length);
}

function parseIssueDate(value) {
  if (!value) {
    return null;
  }

  try {
    const date = new Date(value);
    if (!Number.isNaN(date.valueOf())) {
      const year = date.getUTCFullYear();
      // Reject dates outside a sane range (Excel serials gone wrong produce year 11000+)
      if (year < 1900 || year > 2100) {
        return null;
      }
      return date.toISOString().slice(0, 10);
    }
  } catch {
    // malformed date string — fall through to null
  }

  return null;
}

async function createInvoice(invoice) {
  const customerName = normalizeCustomerName(invoice.customer_name);
  if (!customerName) {
    return { ok: false, reason: 'no customer name' };
  }
  if (await invoiceAlreadyImported(invoice.source_sheet_id)) {
    return { ok: false, reason: 'already imported (source_sheet_id match)' };
  }
  if (!invoice.source_sheet_id && await invoiceAlreadyImportedByName(invoice.source_sheet_name)) {
    return { ok: false, reason: 'already imported (source_sheet_name match)' };
  }

  const customerId = await upsertCustomer(customerName);
  const projectId = await upsertProject(
    invoice.project_code,
    invoice.project_name || invoice.source_sheet_name,
    customerId,
    invoice.site_address || invoice.customer_address || null
  );

  const sections = getSections(invoice);
  let subtotal = 0;
  for (const section of sections) {
    for (const item of section.items || []) {
      subtotal += Number(item.quantity) * Number(item.unit_price);
    }
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const discount = Number(invoice.discount_amount ?? 0);
  const total = Math.round((subtotal - discount) * 100) / 100;
  const depositAmount = invoice.deposit_percentage
    ? Math.round((total * Number(invoice.deposit_percentage) / 100) * 100) / 100
    : null;
  const itemCount = sections.reduce((count, section) => count + (section.items?.length || 0), 0);

  if (DRY) {
    return {
      ok: true,
      dry: true,
      customer: customerName,
      project: invoice.project_code,
      items: itemCount,
      subtotal,
      total
    };
  }

  const { data: created, error } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoice.invoice_number || null,
      company_id: companyId,
      project_id: projectId,
      customer_id: customerId,
      representative: invoice.representative || null,
      issue_date: parseIssueDate(invoice.issue_date) || new Date().toISOString().slice(0, 10),
      terms: invoice.terms || null,
      status: 'pending',
      subtotal,
      discount,
      total,
      total_paid: 0,
      notes: invoice.notes || invoice.discount_note || null,
      source: 'imported_from_sheet',
      source_sheet_id: invoice.source_sheet_id || null,
      source_sheet_name: invoice.source_sheet_name || null
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
    const section = sections[sectionIndex];
    let sectionId = null;

    if (section.title) {
      const { data: insertedSection, error: sectionError } = await supabase
        .from('invoice_sections')
        .insert({ invoice_id: created.id, title: section.title, sort_order: sectionIndex })
        .select('id')
        .single();

      if (sectionError) {
        throw sectionError;
      }

      sectionId = insertedSection.id;
    }

    const itemRows = (section.items || []).map((item, itemIndex) => ({
      invoice_id: created.id,
      section_id: sectionId,
      description: cleanName(item.description),
      quantity: Number(item.quantity) || 0,
      unit: item.unit ?? 'unit',
      unit_price: Number(item.unit_price) || 0,
      sort_order: itemIndex
    }));

    if (itemRows.length) {
      const { error: itemError } = await supabase.from('invoice_items').insert(itemRows);
      if (itemError) {
        throw itemError;
      }
    }
  }

  if (IMPORT_PAYMENTS && invoice.payments?.length) {
    const paymentRows = invoice.payments.map((payment) => ({
      invoice_id: created.id,
      amount: Number(payment.amount) || 0,
      received_at: parseIssueDate(payment.received_at || payment.payment_date)
        ? new Date(payment.received_at || payment.payment_date).toISOString()
        : new Date().toISOString(),
      method: payment.method || 'other',
      notes: payment.notes || null
    }));

    const { error: paymentError } = await supabase.from('payments').insert(paymentRows);
    if (paymentError) {
      throw paymentError;
    }
  }

  return { ok: true, customer: customerName, project: invoice.project_code, items: itemCount, subtotal, total };
}

async function main() {
  if (!DRY) {
    companyId = await getCompanyId();
  }

  if (raw.customers) {
    for (const customer of raw.customers) {
      const normalizedName = normalizeCustomerName(customer.name);
      if (!normalizedName) {
        continue;
      }

      if (DRY) {
        customerIdByName[normalizedName] = `dry-cust-${normalizedName}`;
      } else {
        customerIdByName[normalizedName] = await upsertCustomer(normalizedName);
      }
    }
  }

  let ok = 0;
  let skip = 0;
  let fail = 0;
  const failures = [];

  for (const invoice of invoices) {
    process.stdout.write(`- ${(invoice.source_sheet_name || invoice.project_code || '?').padEnd(40)} `);
    try {
      const result = await createInvoice(invoice);
      if (result.ok) {
        console.log(`OK (${result.items} items, $${result.total})`);
        ok += 1;
      } else {
        console.log(`SKIP (${result.reason})`);
        skip += 1;
      }
    } catch (error) {
      console.log(`FAIL: ${error.message}`);
      fail += 1;
      failures.push({ name: invoice.source_sheet_name || invoice.project_code || '?', error: error.message });
    }
  }

  console.log(`\n${DRY ? 'DRY RUN' : 'DONE'}: ${ok} ok / ${skip} skipped / ${fail} failed`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((failure) => console.log(`  - ${failure.name}: ${failure.error}`));
  }
}

main().catch((error) => {
  console.error('FATAL:', error);
  process.exit(1);
});