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
  const s = String(v).replace(/[,，¥￥元\s]/g, '');
  // 必须整个是数字才算金额，避免把"2026-06-22"这种日期误读成 2026
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return parseFloat(s);
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

// 根据"费用摘要 + 发票内容"里的关键词，自动把一笔费用归到公司模板的类目里。
// 规则从上到下依次尝试，先命中先得；都没命中就归"其他"。
const CATEGORY_RULES = [
  { category: '业务招待费', keywords: ['招待', '宴请'] },
  { category: '差旅-交通', keywords: ['机票', '航班', '航空', '高铁', '火车', '动车', '船票'] },
  { category: '交通费', keywords: ['打车', '出租', '网约车', '滴滴', '地铁', '公交', '客运', '车票', '接送'] },
  { category: '住宿费', keywords: ['住宿', '酒店', '宾馆', '民宿', '房费', '客房'] },
  { category: '汽车费用', keywords: ['停车', '油费', '油票', '加油', '过路', '过桥', '高速', '洗车', 'ETC', '租车'] },
  { category: '快递费', keywords: ['快递', '邮寄', '顺丰', '运费', '寄件'] },
  { category: '办公用品', keywords: ['办公', '文具', '耗材', '打印', '墨盒', '硒鼓', '纸张'] },
  { category: '餐费', keywords: ['餐', '午饭', '晚饭', '早饭', '外卖', '咖啡', '茶歇', '酒水', '饮'] },
];

function guessCategory(text) {
  const s = (text || '').toString();
  if (!s.trim()) return null;
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => s.includes(kw))) return rule.category;
  }
  return null;
}

// 解析一个 sheet：找到"发票内容/发票金额"表头行，表头下一行是费用类目列名，
// 之后每一行是一笔费用，把结果累加进 ctx.items / ctx.tickets。
function parseSheet(rows, ctx) {
  let headerRowIdx = -1;
  let invoiceContentCol = -1;
  for (let r = 0; r < Math.min(rows.length, 12); r++) {
    const col = findCellCol(rows[r], '发票内容');
    // 模板的表头行同时有"费用明细"和"发票内容"，只认"发票内容"会把简单表格误当成模板
    if (col !== -1 && findCellCol(rows[r], '明细') !== -1) {
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

    // Excel 里没按类目分列填的行，根据摘要 + 发票内容的关键词自动归类
    let categoryGuessed = false;
    if (!category) {
      const guessed = guessCategory(summaryVal + ' ' + invoiceContentRaw);
      if (guessed) {
        category = guessed;
        categoryGuessed = true;
      }
    }

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
      _categoryGuessed: categoryGuessed || !category,
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

// 备用解析：处理没有按类目分列的简单表格（表头只要有"金额"，加上"摘要/说明/内容/项目"
// 任意一个即可，"日期""发票内容""发票金额"可选）。每一笔的类目全部靠关键词自动划分。
function parseSimpleSheet(rows, ctx) {
  let headerRowIdx = -1;
  let amountCol = -1;
  let descCol = -1;
  for (let r = 0; r < Math.min(rows.length, 12); r++) {
    const row = rows[r] || [];
    let a = -1;
    let d = -1;
    for (let c = 0; c < row.length; c++) {
      const v = typeof row[c] === 'string' ? row[c].replace(/\s/g, '') : '';
      if (!v) continue;
      if (a === -1 && v.includes('金额') && !v.includes('发票金额')) a = c;
      if (d === -1 && ['摘要', '说明', '内容', '项目', '描述'].some((k) => v.includes(k)) && !v.includes('发票')) d = c;
    }
    if (a !== -1 && d !== -1) {
      headerRowIdx = r;
      amountCol = a;
      descCol = d;
      break;
    }
  }
  if (headerRowIdx === -1) return 0;

  const headerRow = rows[headerRowIdx] || [];
  const dateCol = findCellCol(headerRow, '日期');
  const invoiceContentCol = findCellCol(headerRow, '发票内容');
  let invoiceAmountCol = findCellCol(headerRow, '发票金额');
  if (invoiceAmountCol === -1 && invoiceContentCol !== -1) invoiceAmountCol = invoiceContentCol + 1;

  let addedCount = 0;
  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const rowText = row.map((v) => (v == null ? '' : String(v))).join('');
    if (!rowText.trim()) continue;
    if (rowText.includes('合计')) continue;

    const summaryVal = row[descCol] != null ? String(row[descCol]).trim() : '';
    const amount = parseAmount(row[amountCol]);
    if (!summaryVal && amount === null) continue;

    const dateVal = dateCol !== -1 ? normalizeDate(row[dateCol]) : '';
    const invoiceContentRaw =
      invoiceContentCol !== -1 && row[invoiceContentCol] != null ? String(row[invoiceContentCol]).trim() : '';
    const invoiceAmount = invoiceAmountCol !== -1 ? parseAmount(row[invoiceAmountCol]) : null;

    const guessed = guessCategory(summaryVal + ' ' + invoiceContentRaw);

    const item = {
      id: ctx.nextItemId++,
      category: guessed || '其他',
      description: summaryVal,
      date: dateVal,
      amount: amount != null ? amount : invoiceAmount != null ? invoiceAmount : 0,
      voucherType: 'none',
      invoiceFile: '',
      invoiceCategory: '',
      tpiaoIds: [],
      remark: '',
      _matchAmount: null,
      _categoryGuessed: true,
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
      <td class="category-cell"></td>
      <td>${item.description || '-'}</td>
      <td>${item.date || '-'}</td>
      <td class="amount-cell">${fmt(item.amount)}</td>
      <td>${badge(item.voucherType)}</td>
      <td>${invoiceTypeLabel}</td>
      <td class="match-cell"></td>
    `;

    // 类目列做成下拉框：自动划分的会标出来（琥珀色边框），不对可以随手改
    const categoryCell = tr.querySelector('.category-cell');
    const catSelect = document.createElement('select');
    const opts = typeof categoryOptions !== 'undefined' ? categoryOptions.slice() : [];
    if (!opts.includes(item.category)) opts.push(item.category);
    opts.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      catSelect.appendChild(opt);
    });
    catSelect.value = item.category;
    categoryCell.classList.toggle('guessed-category', !!item._categoryGuessed);
    catSelect.addEventListener('change', () => {
      item.category = catSelect.value;
      item._categoryGuessed = false;
      categoryCell.classList.remove('guessed-category');
      document.getElementById('output-textarea').value = generateOutputText();
    });
    categoryCell.appendChild(catSelect);

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

      let added = parseSheet(rows, ctx);
      if (added === 0) added = parseSimpleSheet(rows, ctx); // 不是公司模板结构就试简单表格
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
