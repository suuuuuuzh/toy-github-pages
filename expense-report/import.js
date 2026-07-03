// 从公司报销 Excel 模板解析出 data.js 需要的数据，并按金额把上传的发票文件名
// 和每一笔费用/替票自动配对。全部在浏览器本地运行，不会把任何内容发送出去。

const state = {
  items: [],
  tickets: [],
  invoiceFiles: [],
  reportInfo: { submitter: '', department: '', period: '', reportDate: '' },
};

function parseAmount(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/[,，¥￥\s]/g, '');
  if (s === '') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function normalizeDate(v) {
  if (!v) return '';
  const s = String(v).trim();
  const m = s.match(/(\d{4})[年/\-.](\d{1,2})[月/\-.](\d{1,2})/);
  if (m) {
    const pad = (x) => String(x).padStart(2, '0');
    return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  }
  return s;
}

function findCellCol(row, text) {
  if (!row) return -1;
  for (let c = 0; c < row.length; c++) {
    const v = row[c];
    if (typeof v === 'string' && v.replace(/\s/g, '').includes(text)) return c;
  }
  return -1;
}

function findLabelValue(row, labelText) {
  if (!row) return '';
  const idx = row.findIndex((v) => typeof v === 'string' && v.replace(/[:：\s]/g, '') === labelText);
  if (idx === -1) return '';
  for (let c = idx + 1; c < row.length; c++) {
    if (row[c] != null && String(row[c]).trim() !== '') return String(row[c]).trim();
  }
  return '';
}

function parseReportInfoFromRows(rows) {
  const info = { submitter: '', department: '', period: '', reportDate: '' };
  for (let r = 0; r < Math.min(rows.length, 8); r++) {
    const row = rows[r] || [];
    info.submitter = info.submitter || findLabelValue(row, '报销人');
    info.department = info.department || findLabelValue(row, '部门');
    info.reportDate = info.reportDate || normalizeDate(findLabelValue(row, '报销日期'));
    const project = findLabelValue(row, '项目名称');
    if (project && !info.period) info.period = project;
  }
  return info;
}

// 解析一个 sheet：找到"发票内容/发票金额"表头行，表头下一行是费用类目列名，
// 之后每一行是一笔费用，把结果累加进 ctx.items / ctx.tickets。
function parseSheet(rows, ctx) {
  let headerRowIdx = -1;
  let invoiceContentCol = -1;
  for (let r = 0; r < Math.min(rows.length, 12); r++) {
    const col = findCellCol(rows[r], '发票内容');
    if (col !== -1) {
      headerRowIdx = r;
      invoiceContentCol = col;
      break;
    }
  }
  if (headerRowIdx === -1) return 0; // 这个 sheet 结构不符合模板，跳过

  const headerRow = rows[headerRowIdx] || [];
  let invoiceAmountCol = findCellCol(headerRow, '发票金额');
  if (invoiceAmountCol === -1) invoiceAmountCol = invoiceContentCol + 1;

  let dateCol = findCellCol(headerRow, '日期');
  if (dateCol === -1) dateCol = 0;
  let summaryCol = findCellCol(headerRow, '摘要');
  if (summaryCol === -1) summaryCol = dateCol + 1;

  const categoryHeaderRow = rows[headerRowIdx + 1] || [];
  const categoryCols = [];
  for (let c = 0; c < invoiceContentCol; c++) {
    const v = categoryHeaderRow[c];
    if (typeof v === 'string' && v.trim() && v.trim() !== '序号') {
      categoryCols.push({ col: c, name: v.trim() });
    }
  }
  if (categoryCols.length === 0) return 0;

  let addedCount = 0;
  for (let r = headerRowIdx + 2; r < rows.length; r++) {
    const row = rows[r] || [];
    const rowText = row.map((v) => (v == null ? '' : String(v))).join('');
    if (!rowText.trim()) continue;
    if (rowText.includes('合计')) continue;

    const dateVal = normalizeDate(row[dateCol]);
    const summaryVal = row[summaryCol] != null ? String(row[summaryCol]).trim() : '';

    let category = '';
    let amount = null;
    for (const cc of categoryCols) {
      const amt = parseAmount(row[cc.col]);
      if (amt !== null && amt !== 0) {
        category = cc.name;
        amount = amt;
        break;
      }
    }
    const invoiceContentRaw = row[invoiceContentCol] != null ? String(row[invoiceContentCol]).trim() : '';
    const invoiceAmount = parseAmount(row[invoiceAmountCol]);
    if (category === '' && amount === null && !invoiceContentRaw && invoiceAmount === null) continue;

    const item = {
      id: ctx.nextItemId++,
      category: category || '其他',
      description: summaryVal,
      date: dateVal,
      amount: amount != null ? amount : invoiceAmount != null ? invoiceAmount : 0,
      voucherType: 'none',
      invoiceFile: '',
      invoiceCategory: '',
      tpiaoIds: [],
      remark: '',
      _matchAmount: null,
    };

    if (!invoiceContentRaw) {
      item.voucherType = 'none';
    } else if (invoiceContentRaw.startsWith('抵票')) {
      const ticketCategory = invoiceContentRaw.replace(/^抵票[-－]?/, '').trim();
      const ticketId = 'T' + String(ctx.nextTicketNum++).padStart(3, '0');
      const ticketAmount = invoiceAmount != null ? invoiceAmount : item.amount;
      ctx.tickets.push({
        id: ticketId,
        amount: ticketAmount,
        invoiceCategory: ticketCategory,
        file: '',
        note: '',
        _matchAmount: ticketAmount,
      });
      item.voucherType = 'tpiao';
      item.tpiaoIds = [ticketId];
    } else {
      item.voucherType = 'invoice';
      item.invoiceCategory = invoiceContentRaw;
      item._matchAmount = invoiceAmount != null ? invoiceAmount : item.amount;
    }

    ctx.items.push(item);
    addedCount++;
  }
  return addedCount;
}

function extractAmountFromFilename(name) {
  let m = name.match(/([0-9]+(?:\.[0-9]{1,2})?)\s*元/);
  if (m) return parseFloat(m[1]);
  m = name.match(/[¥￥]\s*([0-9]+(?:\.[0-9]{1,2})?)/);
  if (m) return parseFloat(m[1]);
  m = name.match(/\b([0-9]+\.[0-9]{2})\b/);
  if (m) return parseFloat(m[1]);
  return null;
}

function buildAmountIndex(fileNames) {
  const idx = new Map();
  fileNames.forEach((name) => {
    const amt = extractAmountFromFilename(name);
    if (amt == null) return;
    const key = amt.toFixed(2);
    if (!idx.has(key)) idx.set(key, []);
    idx.get(key).push(name);
  });
  return idx;
}

// 按金额把发票文件名和费用/替票配对：金额唯一对应上的自动选好，
// 金额重复（或没有候选）的留空，交给预览表里的下拉框手动选。
function runMatchingAndRender() {
  const idx = buildAmountIndex(state.invoiceFiles);
  const claimed = new Set();

  state.items.forEach((item) => {
    if (item.voucherType === 'invoice') item.invoiceFile = '';
  });
  state.tickets.forEach((t) => {
    t.file = '';
  });

  state.items.forEach((item) => {
    let targetAmount = null;
    let assign = null;
    if (item.voucherType === 'invoice') {
      targetAmount = item._matchAmount;
      assign = (name) => {
        item.invoiceFile = name;
      };
    } else if (item.voucherType === 'tpiao') {
      const ticket = state.tickets.find((t) => t.id === item.tpiaoIds[0]);
      if (!ticket) return;
      targetAmount = ticket._matchAmount;
      assign = (name) => {
        ticket.file = name;
      };
    } else {
      return;
    }
    if (targetAmount == null) return;
    const key = Number(targetAmount).toFixed(2);
    const candidates = (idx.get(key) || []).filter((name) => !claimed.has(name));
    if (candidates.length === 1) {
      assign(candidates[0]);
      claimed.add(candidates[0]);
    }
  });

  renderPreview();
}

function jsStr(s) {
  return JSON.stringify(s == null ? '' : s);
}

function generateOutputText() {
  const opts = typeof categoryOptions !== 'undefined' ? categoryOptions : [];
  const lines = [];
  lines.push('// ============================================================');
  lines.push('// 报销单数据文件 —— 由「从 Excel 导入」工具自动生成，导入后请核对一遍');
  lines.push('// 每次报销只需要修改这个文件，index.html 会自动重新计算汇总。');
  lines.push('// ============================================================');
  lines.push('');
  lines.push('const reportInfo = {');
  lines.push('  reportTitle: "报销单",');
  lines.push(`  submitter: ${jsStr(state.reportInfo.submitter)},`);
  lines.push(`  department: ${jsStr(state.reportInfo.department)},`);
  lines.push(`  period: ${jsStr(state.reportInfo.period)},`);
  lines.push(`  reportDate: ${jsStr(state.reportInfo.reportDate)},`);
  lines.push('};');
  lines.push('');
  lines.push('const categoryOptions = ' + JSON.stringify(opts) + ';');
  lines.push('');
  lines.push('const expenseItems = [');
  state.items.forEach((item) => {
    lines.push('  {');
    lines.push(`    id: ${item.id},`);
    lines.push(`    category: ${jsStr(item.category)},`);
    lines.push(`    description: ${jsStr(item.description)},`);
    lines.push(`    date: ${jsStr(item.date)},`);
    lines.push(`    amount: ${Number(item.amount) || 0},`);
    lines.push(`    voucherType: ${jsStr(item.voucherType)},`);
    lines.push(`    invoiceFile: ${jsStr(item.invoiceFile ? 'invoices/' + item.invoiceFile : '')},`);
    lines.push(`    invoiceCategory: ${jsStr(item.invoiceCategory)},`);
    lines.push(`    tpiaoIds: ${JSON.stringify(item.tpiaoIds)},`);
    lines.push(`    remark: ${jsStr(item.remark)},`);
    lines.push('  },');
  });
  lines.push('];');
  lines.push('');
  lines.push('const tpiaoList = [');
  state.tickets.forEach((t) => {
    lines.push(
      `  { id: ${jsStr(t.id)}, amount: ${Number(t.amount) || 0}, invoiceCategory: ${jsStr(t.invoiceCategory)}, file: ${jsStr(
        t.file ? 'invoices/' + t.file : ''
      )}, note: "" },`
    );
  });
  lines.push('];');
  return lines.join('\n');
}

function renderPreview() {
  const tbody = document.getElementById('preview-tbody');
  const wrap = document.getElementById('preview-wrap');
  const empty = document.getElementById('preview-empty');
  const outputSection = document.getElementById('output-section');

  if (!state.items.length) {
    wrap.style.display = 'none';
    empty.style.display = 'block';
    outputSection.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  wrap.style.display = 'block';
  outputSection.style.display = 'block';

  const fmt = (n) => Number(n || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const badge = (t) =>
    t === 'invoice'
      ? '<span class="badge badge-invoice">发票</span>'
      : t === 'tpiao'
      ? '<span class="badge badge-tpiao">替票</span>'
      : '<span class="badge badge-none">无凭证</span>';

  tbody.innerHTML = '';
  state.items.forEach((item) => {
    const tr = document.createElement('tr');
    let invoiceTypeLabel = '-';
    let matchKind = null;
    let matchObj = null;

    if (item.voucherType === 'invoice') {
      invoiceTypeLabel = item.invoiceCategory || '-';
      matchKind = 'item';
      matchObj = item;
    } else if (item.voucherType === 'tpiao') {
      const ticket = state.tickets.find((t) => t.id === item.tpiaoIds[0]);
      invoiceTypeLabel = ticket ? '抵票-' + ticket.invoiceCategory : '-';
      matchKind = 'ticket';
      matchObj = ticket;
    }

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.category}</td>
      <td>${item.description || '-'}</td>
      <td>${item.date || '-'}</td>
      <td class="amount-cell">${fmt(item.amount)}</td>
      <td>${badge(item.voucherType)}</td>
      <td>${invoiceTypeLabel}</td>
      <td class="match-cell"></td>
    `;

    const matchCell = tr.querySelector('.match-cell');
    if (matchObj) {
      const select = document.createElement('select');
      const optNone = document.createElement('option');
      optNone.value = '';
      optNone.textContent = '-- 未匹配，留空 --';
      select.appendChild(optNone);
      state.invoiceFiles.forEach((name) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
      const currentVal = matchKind === 'item' ? matchObj.invoiceFile : matchObj.file;
      select.value = currentVal || '';
      matchCell.classList.toggle('no-match', !currentVal);
      matchCell.classList.toggle('auto-match', !!currentVal);
      select.addEventListener('change', () => {
        if (matchKind === 'item') matchObj.invoiceFile = select.value;
        else matchObj.file = select.value;
        matchCell.classList.toggle('no-match', !select.value);
        matchCell.classList.toggle('auto-match', !!select.value);
        document.getElementById('output-textarea').value = generateOutputText();
      });
      matchCell.appendChild(select);
    } else {
      matchCell.textContent = '-';
    }
    tbody.appendChild(tr);
  });

  document.getElementById('output-textarea').value = generateOutputText();
}

document.getElementById('excel-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('excel-status');
  statusEl.textContent = '解析中...';
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const ctx = { nextItemId: 1, nextTicketNum: 1, items: [], tickets: [] };
    state.reportInfo = { submitter: '', department: '', period: '', reportDate: '' };
    let parsedSheetCount = 0;

    wb.SheetNames.forEach((name) => {
      const ws = wb.Sheets[name];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: null });
      const info = parseReportInfoFromRows(rows);
      state.reportInfo.submitter = state.reportInfo.submitter || info.submitter;
      state.reportInfo.department = state.reportInfo.department || info.department;
      state.reportInfo.period = state.reportInfo.period || info.period;
      state.reportInfo.reportDate = state.reportInfo.reportDate || info.reportDate;

      const added = parseSheet(rows, ctx);
      if (added > 0) parsedSheetCount++;
    });

    state.items = ctx.items;
    state.tickets = ctx.tickets;

    if (ctx.items.length === 0) {
      statusEl.textContent = `没能从任何 sheet 里识别出数据，请确认表格结构是否包含"发票内容"表头，以及下一行是不是费用类目列名。`;
    } else {
      statusEl.textContent = `已解析 ${wb.SheetNames.length} 个 sheet，其中 ${parsedSheetCount} 个识别出数据，共 ${ctx.items.length} 笔费用、${ctx.tickets.length} 张替票。`;
    }
    runMatchingAndRender();
  } catch (err) {
    statusEl.textContent = '解析失败：' + err.message;
  }
});

document.getElementById('invoice-input').addEventListener('change', (e) => {
  state.invoiceFiles = Array.from(e.target.files).map((f) => f.name);
  document.getElementById('invoice-status').textContent = `已选择 ${state.invoiceFiles.length} 个文件`;
  runMatchingAndRender();
});

document.getElementById('copy-btn').addEventListener('click', async () => {
  const text = document.getElementById('output-textarea').value;
  const statusEl = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = '已复制';
  } catch (e) {
    const textarea = document.getElementById('output-textarea');
    textarea.select();
    document.execCommand('copy');
    statusEl.textContent = '已复制';
  }
  setTimeout(() => {
    statusEl.textContent = '';
  }, 2000);
});

document.getElementById('download-btn').addEventListener('click', () => {
  const text = document.getElementById('output-textarea').value;
  const blob = new Blob([text], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});
