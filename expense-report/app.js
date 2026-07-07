// 根据 data.js 中的 reportInfo / categoryOptions / expenseItems / tpiaoList 渲染整个页面。
// 明细表由本文件动态生成，支持：筛选视图（全部 / 有发票 / 无发票 / 替票）、
// 每笔可编辑备注（存在浏览器本地），以及把带备注的数据导出成新的 data.js。

const fmt = (n) =>
  Number(n || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---- 备注本地存储：按报销单标题分开存，改了会记住，刷新不丢 ----
const REMARK_KEY = "expense-remarks:" + (typeof reportInfo !== "undefined" ? reportInfo.reportTitle : "default");

function loadRemarkOverrides() {
  try {
    return JSON.parse(localStorage.getItem(REMARK_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function saveRemarkOverride(id, text) {
  const map = loadRemarkOverrides();
  if (text) map[id] = text;
  else delete map[id];
  localStorage.setItem(REMARK_KEY, JSON.stringify(map));
}
// 把本地备注覆盖到 data.js 的初始值上
(function applyRemarkOverrides() {
  const map = loadRemarkOverrides();
  expenseItems.forEach((it) => {
    if (Object.prototype.hasOwnProperty.call(map, it.id)) it.remark = map[it.id];
  });
})();

let currentFilter = "all"; // all | invoice | none | tpiao

function matchFilter(item) {
  if (currentFilter === "all") return true;
  if (currentFilter === "invoice") return item.voucherType === "invoice";
  if (currentFilter === "none") return item.voucherType === "none";
  if (currentFilter === "tpiao") return item.voucherType === "tpiao";
  return true;
}

function findTpiao(id) {
  const list = typeof tpiaoList !== "undefined" ? tpiaoList : [];
  return list.find((t) => t.id === id);
}

function voucherBadge(type) {
  if (type === "invoice") return '<span class="badge badge-invoice">发票</span>';
  if (type === "tpiao") return '<span class="badge badge-tpiao">替票</span>';
  return '<span class="badge badge-none">无凭证</span>';
}

function voucherCategoryLabel(item) {
  if (item.voucherType === "invoice") return esc(item.invoiceCategory || "-");
  if (item.voucherType === "tpiao") {
    const ids = item.tpiaoIds || [];
    const labels = ids.map((id) => {
      const t = findTpiao(id);
      return t && t.invoiceCategory ? "抵票-" + t.invoiceCategory : "抵票-" + id;
    });
    return labels.length ? esc(labels.join("、")) : "-";
  }
  return "-";
}

function voucherRefDetail(item) {
  if (item.voucherType === "invoice") return item.invoiceFile ? esc(item.invoiceFile.split("/").pop()) : "-";
  if (item.voucherType === "tpiao") {
    const ids = item.tpiaoIds || [];
    return ids.length ? esc(ids.join("、")) : "-";
  }
  return "-";
}

function voucherAction(item) {
  if (item.voucherType === "invoice") {
    if (item.invoiceFile) {
      return `<a class="btn" href="${esc(item.invoiceFile)}" download target="_blank" rel="noopener">下载发票</a>`;
    }
    return '<a class="btn disabled">发票未上传</a>';
  }
  if (item.voucherType === "tpiao") {
    const ids = item.tpiaoIds || [];
    if (!ids.length) return '<span class="muted">未关联替票</span>';
    return ids.map((id) => `<a class="btn" href="#tpiao-${esc(id)}">查看${esc(id)}</a>`).join(" ");
  }
  return '<span class="muted">-</span>';
}

function renderFilterBar() {
  const counts = {
    all: expenseItems.length,
    invoice: expenseItems.filter((i) => i.voucherType === "invoice").length,
    none: expenseItems.filter((i) => i.voucherType === "none").length,
    tpiao: expenseItems.filter((i) => i.voucherType === "tpiao").length,
  };
  const defs = [
    { key: "all", label: "全部" },
    { key: "invoice", label: "有发票" },
    { key: "none", label: "无发票" },
  ];
  if (counts.tpiao > 0) defs.push({ key: "tpiao", label: "替票" });

  const bar = document.getElementById("filter-bar");
  if (!bar) return;
  bar.innerHTML = defs
    .map(
      (d) =>
        `<button class="filter-btn${currentFilter === d.key ? " active" : ""}" data-filter="${d.key}">${d.label} <span class="cnt">${counts[d.key]}</span></button>`
    )
    .join("");
  bar.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.getAttribute("data-filter");
      renderFilterBar();
      renderExpenseTable();
    });
  });
}

function renderExpenseTable() {
  const table = document.getElementById("expense-table");
  const rows = expenseItems.filter(matchFilter);

  const head = `
    <thead>
      <tr>
        <th>序号</th>
        <th>类目</th>
        <th>说明</th>
        <th>备注（谁的票 / 早中晚饭 / 用途）</th>
        <th>日期</th>
        <th>金额（元）</th>
        <th>凭证类型</th>
        <th>发票类型</th>
        <th>凭证详情</th>
        <th>操作</th>
      </tr>
    </thead>`;

  const body =
    "<tbody>" +
    rows
      .map(
        (item) => `
      <tr class="${item.voucherType === "none" ? "row-none" : ""}">
        <td>${item.id}</td>
        <td>${esc(item.category)}</td>
        <td>${esc(item.description || "-")}</td>
        <td class="remark-cell"><input class="remark-input" data-id="${item.id}" value="${esc(item.remark || "")}" placeholder="加备注…" /></td>
        <td>${esc(item.date || "-")}</td>
        <td class="amount-cell">${fmt(item.amount)}</td>
        <td>${voucherBadge(item.voucherType)}</td>
        <td>${voucherCategoryLabel(item)}</td>
        <td>${voucherRefDetail(item)}</td>
        <td>${voucherAction(item)}</td>
      </tr>`
      )
      .join("") +
    "</tbody>";

  const shownTotal = rows.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const foot = `
    <tfoot>
      <tr>
        <td colspan="5">${currentFilter === "all" ? "合计" : "当前视图合计"}（${rows.length} 笔）</td>
        <td class="amount-cell">${fmt(shownTotal)} 元</td>
        <td colspan="4"></td>
      </tr>
    </tfoot>`;

  table.innerHTML = head + body + foot;

  table.querySelectorAll(".remark-input").forEach((inp) => {
    inp.addEventListener("change", () => {
      const id = Number(inp.getAttribute("data-id"));
      const item = expenseItems.find((i) => i.id === id);
      if (item) item.remark = inp.value.trim();
      saveRemarkOverride(id, inp.value.trim());
    });
  });
}

function renderCategoryTable() {
  const options = typeof categoryOptions !== "undefined" ? categoryOptions : [];
  const seen = new Set();
  const orderedCategories = [];
  options.forEach((c) => {
    if (!seen.has(c)) {
      seen.add(c);
      orderedCategories.push(c);
    }
  });
  expenseItems.forEach((i) => {
    if (!seen.has(i.category)) {
      seen.add(i.category);
      orderedCategories.push(i.category);
    }
  });

  const rows = orderedCategories
    .map((cat) => {
      const items = expenseItems.filter((i) => i.category === cat);
      if (items.length === 0) return null;
      const sum = items.reduce((s, i) => s + Number(i.amount || 0), 0);
      return { cat, count: items.length, sum };
    })
    .filter(Boolean);

  document.getElementById("category-tbody").innerHTML = rows
    .map(
      (r) => `
      <tr>
        <td>${esc(r.cat)}</td>
        <td>${r.count}</td>
        <td class="amount-cell">${fmt(r.sum)}</td>
      </tr>`
    )
    .join("");

  const total = rows.reduce((s, r) => s + r.sum, 0);
  document.getElementById("category-total-cell").textContent = fmt(total) + " 元";
}

function renderTpiaoTable() {
  const list = typeof tpiaoList !== "undefined" ? tpiaoList : [];
  const tbody = document.getElementById("tpiao-tbody");
  const emptyHint = document.getElementById("tpiao-empty");
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = "";
    if (emptyHint) emptyHint.style.display = "block";
    return;
  }
  if (emptyHint) emptyHint.style.display = "none";

  tbody.innerHTML = list
    .map((ticket) => {
      const usedBy = expenseItems.filter(
        (i) => i.voucherType === "tpiao" && (i.tpiaoIds || []).includes(ticket.id)
      );
      const relatedIds = usedBy.map((i) => "#" + i.id).join("、") || "-";
      const relatedDesc =
        usedBy.map((i) => i.category + (i.description ? "（" + i.description + "）" : "")).join("；") || "-";
      const invoiceLabel = ticket.invoiceCategory ? "抵票-" + ticket.invoiceCategory : "-";
      const action = ticket.file
        ? `<a class="btn" href="${esc(ticket.file)}" download target="_blank" rel="noopener">下载凭证</a>`
        : '<span class="muted">无扫描件</span>';
      return `
      <tr id="tpiao-${esc(ticket.id)}">
        <td>${esc(ticket.id)}</td>
        <td>${esc(invoiceLabel)}</td>
        <td>${relatedIds}</td>
        <td>${esc(relatedDesc)}</td>
        <td class="amount-cell">${fmt(ticket.amount)}</td>
        <td>${action}</td>
      </tr>`;
    })
    .join("");

  const faceTotal = list.reduce((s, t) => s + Number(t.amount || 0), 0);
  const foot = document.getElementById("tpiao-total-cell");
  if (foot) foot.textContent = fmt(faceTotal) + " 元";
}

function renderSummaryCards() {
  const invoiceItems = expenseItems.filter((i) => i.voucherType === "invoice");
  const tpiaoItems = expenseItems.filter((i) => i.voucherType === "tpiao");
  const noneItems = expenseItems.filter((i) => i.voucherType === "none");
  const list = typeof tpiaoList !== "undefined" ? tpiaoList : [];

  const total = expenseItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const invoiceTotal = invoiceItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const tpiaoBusinessTotal = tpiaoItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const tpiaoFaceTotal = list.reduce((s, t) => s + Number(t.amount || 0), 0);
  const noneTotal = noneItems.reduce((s, i) => s + Number(i.amount || 0), 0);

  const cards = [
    { cls: "total", label: "报销总金额", value: fmt(total) + " 元", sub: `共 ${expenseItems.length} 笔` },
    { cls: "invoice", label: "有发票金额", value: fmt(invoiceTotal) + " 元", sub: `共 ${invoiceItems.length} 笔` },
    { cls: "none", label: "无发票金额", value: fmt(noneTotal) + " 元", sub: `共 ${noneItems.length} 笔` },
  ];
  if (tpiaoItems.length > 0 || list.length > 0) {
    cards.push({
      cls: "tpiao",
      label: "替票覆盖金额",
      value: fmt(tpiaoBusinessTotal) + " 元",
      sub: `共 ${list.length} 张替票 / ${tpiaoItems.length} 笔业务`,
    });
  }

  document.getElementById("summary-cards").innerHTML = cards
    .map(
      (c) => `
      <div class="card ${c.cls}">
        <div class="label">${c.label}</div>
        <div class="value">${c.value}</div>
        <div class="sub">${c.sub}</div>
      </div>`
    )
    .join("");
}

// ---- 导出：把当前数据（含备注、分类改动）生成新的 data.js 文本 ----
function generateDataJs() {
  const info = reportInfo;
  const opts = typeof categoryOptions !== "undefined" ? categoryOptions : [];
  const tickets = typeof tpiaoList !== "undefined" ? tpiaoList : [];
  const J = (v) => JSON.stringify(v == null ? "" : v);

  let out = "// 报销单数据文件 —— 含页面上编辑的备注\n\n";
  out += "const reportInfo = {\n";
  out += `  reportTitle: ${J(info.reportTitle)},\n`;
  out += `  submitter: ${J(info.submitter)},\n`;
  out += `  department: ${J(info.department)},\n`;
  out += `  period: ${J(info.period)},\n`;
  out += `  reportDate: ${J(info.reportDate)},\n};\n\n`;
  out += "const categoryOptions = [\n" + opts.map((c) => "  " + J(c)).join(",\n") + ",\n];\n\n";
  out += "const expenseItems = [\n";
  out += expenseItems
    .map((it) =>
      [
        "  {",
        `    id: ${it.id},`,
        `    category: ${J(it.category)},`,
        `    description: ${J(it.description)},`,
        `    date: ${J(it.date)},`,
        `    amount: ${Number(it.amount || 0)},`,
        `    voucherType: ${J(it.voucherType)},`,
        `    invoiceFile: ${J(it.invoiceFile)},`,
        `    invoiceCategory: ${J(it.invoiceCategory)},`,
        `    tpiaoIds: ${JSON.stringify(it.tpiaoIds || [])},`,
        `    remark: ${J(it.remark)},`,
        "  }",
      ].join("\n")
    )
    .join(",\n");
  out += "\n];\n\n";
  out += "const tpiaoList = " + JSON.stringify(tickets, null, 2) + ";\n";
  return out;
}

function setupExport() {
  const btn = document.getElementById("export-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const text = generateDataJs();
    const blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

function renderHeader() {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  set("report-title", reportInfo.reportTitle || "报销单");
  set("submitter", reportInfo.submitter || "-");
  set("department", reportInfo.department || "-");
  set("period", reportInfo.period || "-");
  set("report-date", reportInfo.reportDate || "-");
  document.title = (reportInfo.reportTitle || "报销单") + " - " + (reportInfo.submitter || "");
}

renderHeader();
renderSummaryCards();
renderFilterBar();
renderExpenseTable();
renderCategoryTable();
renderTpiaoTable();
setupExport();
