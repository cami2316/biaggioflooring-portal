import { google } from 'googleapis';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const FOLDER_ID = process.env.DRIVE_FOLDER_ID || '1oOy9ZtH9vadC_L9i0kBHNE2PspJ_QLp2';
const CRED_PATH = path.join(__dirname, 'google-service-account.json');
const OUTPUT_JSON = path.join(__dirname, 'invoices_data_full.json');
const OUTPUT_REPORT = path.join(__dirname, 'extract_report.txt');

mkdirSync(__dirname, { recursive: true });

if (!existsSync(CRED_PATH)) {
  console.error(`Missing Google service account file at ${CRED_PATH}`);
  console.error('Save the JSON key as migration/google-service-account.json and rerun npm run extract.');
  process.exit(1);
}

const credentials = JSON.parse(readFileSync(CRED_PATH, 'utf-8'));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
  ]
});
const drive = google.drive({ version: 'v3', auth });
const sheets = google.sheets({ version: 'v4', auth });

async function listAllSheets() {
  console.log(`Listing spreadsheets in folder ${FOLDER_ID}...`);
  const files = [];
  let pageToken;
  do {
    const { data } = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and (mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
      pageSize: 200,
      pageToken
    });
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || undefined;
  } while (pageToken);
  console.log(`Found ${files.length} spreadsheets.`);
  return files;
}

async function readSheetValues(spreadsheetId) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const firstSheet = meta.data.sheets?.[0]?.properties?.title;
    if (!firstSheet) {
      return null;
    }

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${firstSheet}'`,
      valueRenderOption: 'UNFORMATTED_VALUE'
    });

    return data.values || [];
  } catch {
    return null;
  }
}

function parseMoney(value) {
  const parsed = parseFloat(String(value ?? '').replace(/[$,]/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseInvoice(rows, file) {
  const flat = rows.map((row) => (row || []).map((cell) => (cell == null ? '' : String(cell).trim())));

  const findCellWith = (substr) => {
    const lower = substr.toLowerCase();
    for (let rowIndex = 0; rowIndex < flat.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < flat[rowIndex].length; columnIndex += 1) {
        const value = flat[rowIndex][columnIndex].toLowerCase();
        if (value.includes(lower)) {
          return { r: rowIndex, c: columnIndex, value: flat[rowIndex][columnIndex] };
        }
      }
    }
    return null;
  };

  const valueRightOf = (substr) => {
    const hit = findCellWith(substr);
    if (!hit) {
      return null;
    }

    const row = flat[hit.r] || [];
    for (let columnIndex = hit.c + 1; columnIndex < row.length; columnIndex += 1) {
      if (row[columnIndex]) {
        return row[columnIndex];
      }
    }
    return null;
  };

  const invoiceNumber = valueRightOf('invoice #') || valueRightOf('estimate #') || null;
  const projectId = valueRightOf('project id') || null;
  const representative = valueRightOf('representative') || null;
  const issueDate = valueRightOf('date:') || valueRightOf('date') || null;
  const terms = valueRightOf('terms') || null;

  const customerName = valueRightOf('name:') || valueRightOf('customer') || null;
  const customerAddress = valueRightOf('address:') || null;
  const cityField = valueRightOf('city, st') || valueRightOf('city,') || null;
  const customerPhone = valueRightOf('phone:') || null;
  const customerCell = valueRightOf('cell:') || null;
  const customerEmail = valueRightOf('email:') || null;

  let itemHeaderRow = -1;
  let descCol = -1;
  let qtyCol = -1;
  let priceCol = -1;
  let amountCol = -1;

  for (let rowIndex = 0; rowIndex < flat.length; rowIndex += 1) {
    const cells = flat[rowIndex].map((value) => value.toLowerCase());
    const foundDesc = cells.findIndex((value) => value.includes('description'));
    const foundQty = cells.findIndex((value) => value === 'qty' || value === 'quantity' || value.includes('qty'));
    const foundPrice = cells.findIndex((value) => value === 'price' || value.includes('price'));
    const foundAmount = cells.findIndex((value) => value === 'amount' || value.includes('amount'));

    if (foundDesc !== -1 && foundQty !== -1 && foundPrice !== -1 && foundAmount !== -1) {
      itemHeaderRow = rowIndex;
      descCol = foundDesc;
      qtyCol = foundQty;
      priceCol = foundPrice;
      amountCol = foundAmount;
      break;
    }
  }

  const items = [];
  const stopReasons = [];
  if (itemHeaderRow !== -1) {
    for (let rowIndex = itemHeaderRow + 1; rowIndex < flat.length; rowIndex += 1) {
      const row = flat[rowIndex] || [];
      const descRaw = row[descCol] || '';
      const qtyRaw = row[qtyCol] || '';
      const priceRaw = row[priceCol] || '';
      const amountRaw = row[amountCol] || '';

      if (descRaw.toLowerCase().includes('subtotal')) {
        stopReasons.push('subtotal');
        break;
      }
      if (descRaw.toLowerCase().includes('total') && qtyRaw === '' && priceRaw === '') {
        stopReasons.push('total');
        break;
      }
      if (descRaw === '' && qtyRaw === '' && priceRaw === '' && amountRaw === '') {
        continue;
      }

      const qty = parseMoney(qtyRaw);
      const price = parseMoney(priceRaw);
      const amount = parseMoney(amountRaw);

      if (descRaw && qty === 0 && price === 0 && amount === 0) {
        continue;
      }

      items.push({
        description: descRaw,
        quantity: qty,
        unit_price: price,
        unit: descRaw.toLowerCase().includes('sq') ? 'sqft' : 'unit',
        computed_amount: Math.round(qty * price * 100) / 100,
        sheet_amount: amount
      });
    }
  }

  let subtotal = null;
  const subtotalHit = findCellWith('subtotal');
  if (subtotalHit) {
    const row = flat[subtotalHit.r] || [];
    for (let columnIndex = row.length - 1; columnIndex > subtotalHit.c; columnIndex -= 1) {
      const value = parseMoney(row[columnIndex]);
      if (value > 0) {
        subtotal = value;
        break;
      }
    }
  }

  const cleanName = file.name.trim();
  const codeMatch = cleanName.match(/(WOKB\d+|BOB\d+|ben\s*\d+|wokb\d+|cedeno|cedanos)/i);
  const projectCode = projectId || (codeMatch ? codeMatch[0].toUpperCase().replace(/\s+/g, '') : cleanName);

  return {
    source_sheet_id: file.id,
    source_sheet_name: cleanName,
    modified_time: file.modifiedTime,
    invoice_number: invoiceNumber,
    project_code: projectCode,
    project_name: cleanName,
    customer_name: customerName,
    customer_address: customerAddress,
    customer_city_state: cityField,
    customer_phone: customerPhone,
    customer_cell: customerCell,
    customer_email: customerEmail,
    issue_date: issueDate,
    representative,
    terms,
    items,
    subtotal_extracted: subtotal,
    subtotal_computed: Math.round(items.reduce((sum, item) => sum + item.computed_amount, 0) * 100) / 100,
    parser_warnings: [
      ...(itemHeaderRow === -1 ? ['no item header found'] : []),
      ...(items.length === 0 ? ['no line items extracted'] : []),
      ...(!customerName ? ['no customer name found'] : []),
      ...stopReasons.map((reason) => `stopped at: ${reason}`)
    ]
  };
}

async function main() {
  const files = await listAllSheets();
  const nativeSheets = files.filter((file) => file.mimeType === 'application/vnd.google-apps.spreadsheet');

  console.log(`${nativeSheets.length} native Google Sheets will be processed.`);
  console.log(`${files.length - nativeSheets.length} .xlsx files were skipped.\n`);

  const out = { generated_at: new Date().toISOString(), invoices: [] };
  const warnings = [];

  for (let index = 0; index < nativeSheets.length; index += 1) {
    const file = nativeSheets[index];
    process.stdout.write(`[${index + 1}/${nativeSheets.length}] ${file.name.slice(0, 50).padEnd(50)} ... `);
    try {
      const rows = await readSheetValues(file.id);
      if (!rows) {
        console.log('SKIP (could not read)');
        warnings.push(`${file.name}: read failed`);
        continue;
      }

      const parsed = parseInvoice(rows, file);
      out.invoices.push(parsed);
      const warningText = parsed.parser_warnings.length ? ` warnings: ${parsed.parser_warnings.join('; ')}` : '';
      console.log(`${parsed.items.length} items, $${parsed.subtotal_computed.toFixed(2)}${warningText}`);
    } catch (error) {
      console.log(`FAIL: ${error.message}`);
      warnings.push(`${file.name}: ${error.message}`);
    }
  }

  writeFileSync(OUTPUT_JSON, JSON.stringify(out, null, 2));

  const reportLines = [
    'Biaggio Flooring - extraction report',
    `Generated: ${out.generated_at}`,
    `Total sheets in folder: ${files.length}`,
    `Native Google Sheets processed: ${nativeSheets.length}`,
    `Successfully parsed: ${out.invoices.length}`,
    '',
    '=== Per-invoice summary ===',
    ...out.invoices.map((invoice) => `${(invoice.source_sheet_name || '').padEnd(40)} | items=${String(invoice.items.length).padStart(2)} | $${invoice.subtotal_computed.toFixed(2).padStart(10)} | customer="${invoice.customer_name || '???'}" | ${invoice.parser_warnings.join('; ')}`),
    '',
    '=== Warnings ===',
    ...warnings
  ];

  writeFileSync(OUTPUT_REPORT, reportLines.join('\n'));

  console.log('\nDone. Wrote migration/invoices_data_full.json and migration/extract_report.txt');
  console.log(`${out.invoices.length} invoices parsed. Review the report before importing.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});