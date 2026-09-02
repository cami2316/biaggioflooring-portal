// ============================================================
// Biaggio Flooring — Local file extraction (no Google Cloud needed)
// Reads .xlsx / .xls / .csv files from migration/migration biaggio/
// and outputs invoices_data_full.json + extract_report.txt
//
// Run:
//   npm run extract:local
//   npm run extract:local -- --folder="migration/other-folder"
// ============================================================

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const folderArg = process.argv.slice(2).find(a => a.startsWith('--folder='));
const SOURCE_FOLDER = folderArg
  ? path.resolve(process.cwd(), folderArg.split('=').slice(1).join('='))
  : path.join(__dirname, 'migration biaggio');

const OUTPUT_JSON = path.join(__dirname, 'invoices_data_full.json');
const OUTPUT_REPORT = path.join(__dirname, 'extract_report.txt');

if (!existsSync(SOURCE_FOLDER)) {
  console.error(`Source folder not found: ${SOURCE_FOLDER}`);
  console.error('Place the invoice spreadsheets inside migration/migration biaggio/ and rerun.');
  process.exit(1);
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function parseMoney(value) {
  const parsed = parseFloat(String(value ?? '').replace(/[$,\s]/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseInvoiceRows(rows, fileName) {
  const flat = rows.map(row => (row || []).map(cell => (cell == null ? '' : String(cell).trim())));

  const findCellWith = (substr) => {
    const lower = substr.toLowerCase();
    for (let r = 0; r < flat.length; r++) {
      for (let c = 0; c < flat[r].length; c++) {
        if (flat[r][c].toLowerCase().includes(lower)) return { r, c };
      }
    }
    return null;
  };

  const valueRightOf = (substr) => {
    const hit = findCellWith(substr);
    if (!hit) return null;
    const row = flat[hit.r] || [];
    for (let c = hit.c + 1; c < row.length; c++) {
      if (row[c]) return row[c];
    }
    return null;
  };

  const invoiceNumber  = valueRightOf('invoice #') || valueRightOf('estimate #') || null;
  const projectId      = valueRightOf('project id') || null;
  const representative = valueRightOf('representative') || null;
  const issueDate      = valueRightOf('date:') || valueRightOf('date') || null;
  const terms          = valueRightOf('terms') || null;
  const customerName   = valueRightOf('name:') || valueRightOf('customer') || null;
  const customerAddress = valueRightOf('address:') || null;
  const cityField      = valueRightOf('city, st') || valueRightOf('city,') || null;
  const customerPhone  = valueRightOf('phone:') || null;
  const customerCell   = valueRightOf('cell:') || null;
  const customerEmail  = valueRightOf('email:') || null;

  // Find item header row
  let itemHeaderRow = -1, descCol = -1, qtyCol = -1, priceCol = -1, amountCol = -1;
  for (let r = 0; r < flat.length; r++) {
    const cells = flat[r].map(v => v.toLowerCase());
    const fd = cells.findIndex(v => v.includes('description'));
    const fq = cells.findIndex(v => v === 'qty' || v === 'quantity' || v.includes('qty'));
    const fp = cells.findIndex(v => v === 'price' || v.includes('price'));
    const fa = cells.findIndex(v => v === 'amount' || v.includes('amount'));
    if (fd !== -1 && fq !== -1 && fp !== -1 && fa !== -1) {
      itemHeaderRow = r; descCol = fd; qtyCol = fq; priceCol = fp; amountCol = fa;
      break;
    }
  }

  const items = [];
  const stopReasons = [];
  if (itemHeaderRow !== -1) {
    for (let r = itemHeaderRow + 1; r < flat.length; r++) {
      const row = flat[r] || [];
      const desc      = row[descCol] || '';
      const qtyRaw    = row[qtyCol] || '';
      const priceRaw  = row[priceCol] || '';
      const amountRaw = row[amountCol] || '';

      if (desc.toLowerCase().includes('subtotal'))                              { stopReasons.push('subtotal'); break; }
      if (desc.toLowerCase().includes('total') && !qtyRaw && !priceRaw)        { stopReasons.push('total'); break; }
      if (!desc && !qtyRaw && !priceRaw && !amountRaw)                         continue;

      const qty    = parseMoney(qtyRaw);
      const price  = parseMoney(priceRaw);
      const amount = parseMoney(amountRaw);

      if (desc && qty === 0 && price === 0 && amount === 0) continue;

      items.push({
        description:      desc,
        quantity:         qty,
        unit_price:       price,
        unit:             desc.toLowerCase().includes('sq') ? 'sqft' : 'unit',
        computed_amount:  Math.round(qty * price * 100) / 100,
        sheet_amount:     amount,
      });
    }
  }

  // Subtotal
  let subtotal = null;
  const subHit = findCellWith('subtotal');
  if (subHit) {
    const row = flat[subHit.r] || [];
    for (let c = row.length - 1; c > subHit.c; c--) {
      const v = parseMoney(row[c]);
      if (v > 0) { subtotal = v; break; }
    }
  }

  const baseName  = path.basename(fileName, path.extname(fileName)).trim();
  const codeMatch = baseName.match(/(WOKB\d+|BOB\d+|ben\s*\d+|wokb\d+|cedeno|cedanos)/i);
  const projectCode = projectId || (codeMatch ? codeMatch[0].toUpperCase().replace(/\s+/g, '') : baseName);

  return {
    source_sheet_id:    null,          // no Drive ID for local files
    source_sheet_name:  baseName,
    modified_time:      null,
    invoice_number:     invoiceNumber,
    project_code:       projectCode,
    project_name:       baseName,
    customer_name:      customerName,
    customer_address:   customerAddress,
    customer_city_state: cityField,
    customer_phone:     customerPhone,
    customer_cell:      customerCell,
    customer_email:     customerEmail,
    issue_date:         issueDate,
    representative,
    terms,
    items,
    subtotal_extracted: subtotal,
    subtotal_computed:  Math.round(items.reduce((s, i) => s + i.computed_amount, 0) * 100) / 100,
    parser_warnings: [
      ...(itemHeaderRow === -1         ? ['no item header found']      : []),
      ...(items.length === 0           ? ['no line items extracted']   : []),
      ...(!customerName                ? ['no customer name found']    : []),
      ...stopReasons.map(r => `stopped at: ${r}`),
    ],
  };
}

// ---------------------------------------------------------------
// Format parsers
// ---------------------------------------------------------------
async function parseXlsx(filePath) {
  let xlsx;
  try {
    xlsx = (await import('xlsx')).default;
  } catch {
    throw new Error('xlsx package missing — run: npm install xlsx');
  }
  const workbook = xlsx.readFile(filePath, { cellText: false, cellDates: true });
  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) throw new Error('workbook has no sheets');
  return xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1, defval: '' });
}

async function parseCsv(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  // Handle both quoted and unquoted CSV
  return content.split(/\r?\n/).map(line => {
    const cells = [];
    let cur = '', inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { cells.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cells.push(cur.trim());
    return cells;
  });
}

// ---------------------------------------------------------------
// Main
// ---------------------------------------------------------------
async function main() {
  console.log(`Reading files from: ${SOURCE_FOLDER}\n`);

  const allFiles = readdirSync(SOURCE_FOLDER);
  const files    = allFiles.filter(f => /\.(xlsx|xls|csv)$/i.test(f));
  const skipped  = allFiles.filter(f => !files.includes(f) && !f.startsWith('.'));

  if (files.length === 0) {
    console.error('No .xlsx, .xls or .csv files found in the source folder.');
    console.error(`Folder: ${SOURCE_FOLDER}`);
    process.exit(1);
  }

  if (skipped.length) {
    console.log(`Skipped (unsupported format): ${skipped.join(', ')}\n`);
  }
  console.log(`Found ${files.length} supported files.\n`);

  const out = { generated_at: new Date().toISOString(), invoices: [] };
  const warnings = [];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(SOURCE_FOLDER, fileName);
    process.stdout.write(`[${i + 1}/${files.length}] ${fileName.slice(0, 50).padEnd(50)} ... `);
    try {
      const ext  = path.extname(fileName).toLowerCase();
      const rows = ext === '.csv' ? await parseCsv(filePath) : await parseXlsx(filePath);
      const parsed = parseInvoiceRows(rows, fileName);
      out.invoices.push(parsed);
      const w = parsed.parser_warnings.length ? ` warnings: ${parsed.parser_warnings.join('; ')}` : '';
      console.log(`${parsed.items.length} items, $${parsed.subtotal_computed.toFixed(2)}${w}`);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      warnings.push(`${fileName}: ${err.message}`);
    }
  }

  writeFileSync(OUTPUT_JSON, JSON.stringify(out, null, 2));

  const reportLines = [
    'Biaggio Flooring - local extraction report',
    `Generated: ${out.generated_at}`,
    `Source folder: ${SOURCE_FOLDER}`,
    `Files found: ${files.length}`,
    `Successfully parsed: ${out.invoices.length}`,
    '',
    '=== Per-invoice summary ===',
    ...out.invoices.map(inv =>
      `${(inv.source_sheet_name || '').padEnd(40)} | items=${String(inv.items.length).padStart(2)} | $${inv.subtotal_computed.toFixed(2).padStart(10)} | customer="${inv.customer_name || '???'}" | ${inv.parser_warnings.join('; ')}`
    ),
    '',
    '=== Warnings ===',
    ...warnings,
  ];
  writeFileSync(OUTPUT_REPORT, reportLines.join('\n'));

  console.log(`\nDone. Wrote invoices_data_full.json (${out.invoices.length} invoices) and extract_report.txt`);
  if (out.invoices.length > 0) {
    console.log('Next: review extract_report.txt, then run:');
    console.log('  npm run import -- --dry-run');
    console.log('  npm run import');
  }
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
