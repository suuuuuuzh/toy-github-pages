// 根据 data.js 中的 reportInfo / categoryOptions / expenseItems / tpiaoList 渲染整个页面。
// 明细表由本文件动态生成，支持：筛选视图（全部 / 有发票 / 无发票 / 抵票）、
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

// ---- 字段编辑（说明/类目/日期/金额）本地存储 ----
const EDIT_KEY = "expense-edits:" + (typeof reportInfo !== "undefined" ? reportInfo.reportTitle : "default");
function loadEdits() {
  try {
    return JSON.parse(localStorage.getItem(EDIT_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function setField(id, field, value) {
  const item = expenseItems.find((i) => i.id === id);
  if (item) item[field] = value;
  const map = loadEdits();
  map[id] = map[id] || {};
  map[id][field] = value;
  localStorage.setItem(EDIT_KEY, JSON.stringify(map));
}
(function applyEdits() {
  const map = loadEdits();
  expenseItems.forEach((it) => {
    const e = map[it.id];
    if (e) Object.keys(e).forEach((k) => (it[k] = e[k]));
  });
})();

// ---- 人工挂发票：把发票文件路径挂到某一笔上，存本地，可挂多张 ----
const ATTACH_KEY = "expense-attach:" + (typeof reportInfo !== "undefined" ? reportInfo.reportTitle : "default");
function loadAttach() {
  try {
    return JSON.parse(localStorage.getItem(ATTACH_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function saveAttach(map) {
  localStorage.setItem(ATTACH_KEY, JSON.stringify(map));
}
// 某一笔当前挂着的所有发票文件（data.js 里自带的 + 本地人工挂的，去重）
function itemInvoices(item) {
  const files = [];
  if (item.invoiceFile) files.push(item.invoiceFile);
  (item.invoiceFiles || []).forEach((f) => {
    if (f && !files.includes(f)) files.push(f);
  });
  const map = loadAttach();
  (map[item.id] || []).forEach((f) => {
    if (!files.includes(f)) files.push(f);
  });
  return files;
}
function attachInvoice(itemId, file) {
  const map = loadAttach();
  map[itemId] = map[itemId] || [];
  if (!map[itemId].includes(file)) map[itemId].push(file);
  saveAttach(map);
}
function detachInvoice(itemId, file) {
  const map = loadAttach();
  if (map[itemId]) {
    map[itemId] = map[itemId].filter((f) => f !== file);
    if (!map[itemId].length) delete map[itemId];
  }
  saveAttach(map);
}
// ---- 本地上传的发票：存成 data URL 放本地（只在本浏览器，导出后我可永久托管）----
const UPLOAD_KEY = "expense-uploads:" + (typeof reportInfo !== "undefined" ? reportInfo.reportTitle : "default");
function loadUploads() {
  try {
    return JSON.parse(localStorage.getItem(UPLOAD_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function saveUploads(map) {
  localStorage.setItem(UPLOAD_KEY, JSON.stringify(map));
}
// 存一个上传文件，返回它的引用 key（upload:xxx）
// kind: "invoice"（发票/行程单）| "dipiao"（抵票）| "screenshot"（付款截图）
function addUpload(name, dataUrl, kind) {
  const map = loadUploads();
  const id = "u" + Date.now() + Math.floor(Math.random() * 1000);
  map[id] = { name: name, data: dataUrl, kind: kind || "invoice" };
  saveUploads(map);
  return "upload:" + id;
}
function uploadMeta(ref) {
  const id = ref.slice("upload:".length);
  const map = loadUploads();
  return map[id] || null;
}
function isUpload(f) {
  return f && f.indexOf("upload:") === 0;
}
// 一个文件的类别：invoice（含库里发票和上传发票/行程单）| dipiao | screenshot
function fileKind(f) {
  if (isUpload(f)) {
    const u = uploadMeta(f);
    return (u && u.kind) || "invoice";
  }
  // 发票库里标了「抵票/替票」的文件，按抵票算
  if (typeof invoiceList !== "undefined") {
    const m = invoiceList.find((v) => v.file === f);
    if (m && (m.kind === "抵票" || m.kind === "替票")) return "dipiao";
  }
  return "invoice";
}

// 发票清单里查一条的显示信息（含本地上传）
function invoiceMeta(file) {
  if (isUpload(file)) {
    const u = uploadMeta(file);
    const kindLabel = u && u.kind === "dipiao" ? "抵票" : u && u.kind === "screenshot" ? "付款截图" : "本地上传";
    return u ? { file: file, merchant: u.name, amount: null, kind: kindLabel, date: "" } : null;
  }
  if (typeof invoiceList === "undefined") return null;
  return invoiceList.find((v) => v.file === file) || null;
}
// 解析下载链接（本地上传用 data URL）
function invoiceHref(file) {
  if (isUpload(file)) {
    const u = uploadMeta(file);
    return u ? u.data : "#";
  }
  return file;
}
// 分类某一笔挂着的文件
function classifyFiles(item) {
  const out = { invoice: [], dipiao: [], screenshot: [] };
  itemInvoices(item).forEach((f) => out[fileKind(f)].push(f));
  return out;
}
// 抵票标记（on/off，不一定要上传文件，点一下就标成抵票）
const DIPIAO_KEY = "expense-dipiaoflag:" + (typeof reportInfo !== "undefined" ? reportInfo.reportTitle : "default");
function loadDipiaoFlags() {
  try {
    return JSON.parse(localStorage.getItem(DIPIAO_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
function isDipiaoFlagged(item) {
  return loadDipiaoFlags().indexOf(item.id) !== -1;
}
function toggleDipiaoFlag(id) {
  const arr = loadDipiaoFlags();
  const i = arr.indexOf(id);
  if (i === -1) arr.push(id);
  else arr.splice(i, 1);
  localStorage.setItem(DIPIAO_KEY, JSON.stringify(arr));
}

function hasInvoice(item) {
  return classifyFiles(item).invoice.length > 0;
}
function hasDipiao(item) {
  return classifyFiles(item).dipiao.length > 0 || isDipiaoFlagged(item);
}
function hasScreenshot(item) {
  return classifyFiles(item).screenshot.length > 0;
}

let currentFilter = "all"; // all | invoice | dipiao | none

function matchFilter(item) {
  if (currentFilter === "all") return true;
  if (currentFilter === "invoice") return hasInvoice(item);
  if (currentFilter === "dipiao") return hasDipiao(item) && !hasInvoice(item);
  if (currentFilter === "none") return !hasInvoice(item) && !hasDipiao(item);
  return true;
}

function findTpiao(id) {
  const list = typeof tpiaoList !== "undefined" ? tpiaoList : [];
  return list.find((t) => t.id === id);
}

function voucherBadge(type) {
  if (type === "invoice") return '<span class="badge badge-invoice">发票</span>';
  if (type === "tpiao") return '<span class="badge badge-tpiao">抵票</span>';
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
    if (!ids.length) return '<span class="muted">未关联抵票</span>';
    return ids.map((id) => `<a class="btn" href="#tpiao-${esc(id)}">查看${esc(id)}</a>`).join(" ");
  }
  return '<span class="muted">-</span>';
}

function renderFilterBar() {
  const counts = {
    all: expenseItems.length,
    invoice: expenseItems.filter((i) => hasInvoice(i)).length,
    dipiao: expenseItems.filter((i) => hasDipiao(i) && !hasInvoice(i)).length,
    none: expenseItems.filter((i) => !hasInvoice(i) && !hasDipiao(i)).length,
  };
  const defs = [
    { key: "all", label: "全部" },
    { key: "invoice", label: "有发票" },
    { key: "none", label: "无发票" },
  ];
  if (counts.dipiao > 0) defs.push({ key: "dipiao", label: "抵票" });

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
        <th>日期</th>
        <th>金额（元 · 可编辑）</th>
        <th>凭证</th>
        <th>发票</th>
        <th>发票内容</th>
        <th>发票金额</th>
        <th>备注</th>
      </tr>
    </thead>`;

  // 按类目分组显示：交通费、住宿费在前，其余按 categoryOptions 顺序；组内按日期
  const opts = typeof categoryOptions !== "undefined" ? categoryOptions.slice() : [];
  const prio = (c) => {
    if (c === "交通费") return 0;
    if (c === "住宿费") return 1;
    const i = opts.indexOf(c);
    return 10 + (i === -1 ? 99 : i);
  };
  const cats = Array.from(new Set(rows.map((r) => r.category))).sort((a, b) => prio(a) - prio(b));
  let body = "<tbody>";
  cats.forEach((cat) => {
    const group = rows.filter((r) => r.category === cat).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const sub = group.reduce((s, i) => s + Number(i.amount || 0), 0);
    body += `<tr class="cat-row"><td colspan="10"><span class="cat-row-name">${esc(cat)}</span><span class="cat-row-meta">${group.length} 笔 · ¥${fmt(sub)}</span></td></tr>`;
    body += group.map(rowHtml).join("");
  });
  body += "</tbody>";

  const shownTotal = rows.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const foot = `
    <tfoot>
      <tr>
        <td colspan="4">${currentFilter === "all" ? "合计" : "当前视图合计"}（${rows.length} 笔）</td>
        <td class="amount-cell">${fmt(shownTotal)} 元</td>
        <td colspan="5"></td>
      </tr>
    </tfoot>`;

  table.innerHTML = head + body + foot;
  wireRowInputs(table);
}

// 一行的 HTML（主表和类目展开表共用）
function catSelect(item) {
  const opts = typeof categoryOptions !== "undefined" ? categoryOptions.slice() : [];
  const list = opts.includes(item.category) ? opts : opts.concat([item.category]);
  return (
    `<select class="cat-input" data-id="${item.id}">` +
    list.map((c) => `<option value="${esc(c)}"${c === item.category ? " selected" : ""}>${esc(c)}</option>`).join("") +
    `</select>`
  );
}
function rowHtml(item) {
  return `
      <tr class="${hasInvoice(item) ? "" : item.voucherType === "none" ? "row-none" : ""}">
        <td>${item.id}</td>
        <td>${catSelect(item)}</td>
        <td class="desc-cell"><input class="desc-input" data-id="${item.id}" value="${esc(item.description || "")}" placeholder="这笔花在哪…" /></td>
        <td><input class="date-input" data-id="${item.id}" value="${esc(item.date || "")}" placeholder="YYYY-MM-DD" /></td>
        <td class="amount-cell"><input class="amt-input" data-id="${item.id}" value="${item.amount}" inputmode="decimal" /></td>
        <td>${effectiveBadge(item)}</td>
        <td class="invoice-cell">${invoiceCell(item)}</td>
        <td><input class="invcat-input" data-id="${item.id}" value="${esc(item.invoiceCategory || "")}" placeholder="如 住宿费" /></td>
        <td class="amount-cell"><input class="invamt-input" data-id="${item.id}" value="${item.invoiceAmount === "" || item.invoiceAmount == null ? "" : item.invoiceAmount}" inputmode="decimal" placeholder="发票额" /></td>
        <td class="remark-cell"><input class="remark-input" data-id="${item.id}" value="${esc(item.remark || "")}" placeholder="备注…" /></td>
      </tr>`;
}
// 给一段容器里的可编辑输入绑定事件
function wireRowInputs(root) {
  const rerenderAll = () => {
    renderFilterBar();
    renderExpenseTable();
    renderSummaryCards();
    renderCategoryTable();
  };
  root.querySelectorAll(".remark-input").forEach((inp) =>
    inp.addEventListener("change", () => {
      const id = Number(inp.getAttribute("data-id"));
      const item = expenseItems.find((i) => i.id === id);
      if (item) item.remark = inp.value.trim();
      saveRemarkOverride(id, inp.value.trim());
    })
  );
  // 说明 / 类目 / 日期 / 金额 / 发票内容 / 发票金额 可编辑
  root.querySelectorAll(".desc-input").forEach((inp) =>
    inp.addEventListener("change", () => setField(Number(inp.getAttribute("data-id")), "description", inp.value.trim()))
  );
  root.querySelectorAll(".cat-input").forEach((sel) =>
    sel.addEventListener("change", () => {
      setField(Number(sel.getAttribute("data-id")), "category", sel.value);
      rerenderAll();
    })
  );
  root.querySelectorAll(".date-input").forEach((inp) =>
    inp.addEventListener("change", () => setField(Number(inp.getAttribute("data-id")), "date", inp.value.trim()))
  );
  root.querySelectorAll(".invcat-input").forEach((inp) =>
    inp.addEventListener("change", () => setField(Number(inp.getAttribute("data-id")), "invoiceCategory", inp.value.trim()))
  );
  root.querySelectorAll(".invamt-input").forEach((inp) =>
    inp.addEventListener("change", () => {
      const raw = String(inp.value).replace(/[,，¥￥\s]/g, "");
      setField(Number(inp.getAttribute("data-id")), "invoiceAmount", raw === "" ? "" : parseFloat(raw) || 0);
    })
  );
  root.querySelectorAll(".amt-input").forEach((inp) =>
    inp.addEventListener("change", () => {
      const v = parseFloat(String(inp.value).replace(/[,，¥￥\s]/g, ""));
      setField(Number(inp.getAttribute("data-id")), "amount", isNaN(v) ? 0 : v);
      rerenderAll();
    })
  );
  // 挂发票 / 移除发票 按钮
  root.querySelectorAll(".attach-btn").forEach((btn) => {
    btn.addEventListener("click", () => openInvoicePicker(Number(btn.getAttribute("data-id"))));
  });
  root.querySelectorAll(".detach-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      detachInvoice(Number(btn.getAttribute("data-id")), btn.getAttribute("data-file"));
      renderFilterBar();
      renderExpenseTable();
      renderSummaryCards();
      renderCategoryTable();
    });
  });
  root.querySelectorAll(".dipiao-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleDipiaoFlag(Number(btn.getAttribute("data-id")));
      renderFilterBar();
      renderExpenseTable();
      renderSummaryCards();
    });
  });
}

// 凭证类型徽章
function effectiveBadge(item) {
  if (hasInvoice(item)) return '<span class="badge badge-invoice">发票</span>';
  if (hasDipiao(item)) return '<span class="badge badge-tpiao">抵票</span>';
  if (hasScreenshot(item)) return '<span class="badge badge-shot">付款截图</span>';
  return '<span class="badge badge-none">无凭证</span>';
}

// 下载文件名：细项说明_发票内容_金额.扩展名（抵票加「抵票」前缀）
function downloadName(item, file) {
  let extSrc = file;
  if (isUpload(file)) {
    const u = uploadMeta(file);
    extSrc = u ? u.name : "file.pdf";
  }
  const ext = (extSrc.split(".").pop() || "").split("?")[0].toLowerCase();
  const meta = invoiceMeta(file);
  const kind = fileKind(file);
  const parts = [];
  if (kind === "dipiao") parts.push("抵票");
  else if (kind === "screenshot") parts.push("付款截图");
  if (item && item.description) parts.push(item.description);
  const content = (item && item.invoiceCategory) || (meta && meta.merchant) || "";
  if (content && kind === "invoice") parts.push(content);
  const amt = meta && meta.amount != null ? meta.amount : item && item.invoiceAmount ? item.invoiceAmount : "";
  if (amt !== "" && kind === "invoice") parts.push(fmt(amt).replace(/,/g, ""));
  let name = parts.join("_").replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 80);
  if (!name) name = file.split("/").pop().replace(/\.[^.]+$/, "");
  return name + (ext ? "." + ext : "");
}

// 发票单元格：已挂的凭证（发票/抵票/截图，可下载/移除）+「挂发票」按钮
function invoiceCell(item) {
  const files = itemInvoices(item);
  const chips = files
    .map((f) => {
      const meta = invoiceMeta(f);
      const kind = fileKind(f);
      const tag = kind === "dipiao" ? '<span class="chip-tag tag-dipiao">抵票</span>' : kind === "screenshot" ? '<span class="chip-tag tag-shot">截图</span>' : "";
      const label = meta ? (meta.merchant || "发票") + (meta.amount != null ? " ¥" + fmt(meta.amount) : "") : f.split("/").pop();
      return `<span class="inv-chip ${kind === "dipiao" ? "chip-dipiao" : kind === "screenshot" ? "chip-shot" : ""}">${tag}<a href="${esc(invoiceHref(f))}" download="${esc(downloadName(item, f))}" target="_blank" rel="noopener">${esc(label)}</a><button class="detach-btn" data-id="${item.id}" data-file="${esc(f)}" title="移除">×</button></span>`;
    })
    .join("");
  const btn = `<button class="btn-outline attach-btn" data-id="${item.id}">＋挂发票</button>`;
  const flagged = isDipiaoFlagged(item);
  const dipiaoToggle = `<button class="dipiao-toggle${flagged ? " on" : ""}" data-id="${item.id}" title="点一下标记/取消这笔是抵票">${flagged ? "✓抵票" : "抵票"}</button>`;
  return `<div class="inv-wrap">${chips}${btn}${dipiaoToggle}</div>`;
}

const expandedCats = new Set();
function renderCategoryTable() {
  const box = document.getElementById("category-accordion");
  if (!box) return;
  const options = typeof categoryOptions !== "undefined" ? categoryOptions : [];
  const seen = new Set();
  const ordered = [];
  options.forEach((c) => {
    if (!seen.has(c)) {
      seen.add(c);
      ordered.push(c);
    }
  });
  expenseItems.forEach((i) => {
    if (!seen.has(i.category)) {
      seen.add(i.category);
      ordered.push(i.category);
    }
  });

  const groups = ordered
    .map((cat) => ({ cat, items: expenseItems.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length > 0);
  const grand = groups.reduce((s, g) => s + g.items.reduce((a, i) => a + Number(i.amount || 0), 0), 0);

  const colgroup = `<thead><tr><th>序号</th><th>类目</th><th>说明</th><th>日期</th><th>金额（元）</th><th>凭证</th><th>发票</th><th>发票内容</th><th>发票金额</th><th>备注</th></tr></thead>`;

  box.innerHTML =
    groups
      .map((g) => {
        const sum = g.items.reduce((a, i) => a + Number(i.amount || 0), 0);
        const open = expandedCats.has(g.cat);
        const panel = open
          ? `<div class="cat-panel"><div style="overflow-x:auto"><table>${colgroup}<tbody>${g.items.map(rowHtml).join("")}</tbody></table></div></div>`
          : "";
        return `<div class="cat-group">
          <button class="cat-head${open ? " open" : ""}" data-cat="${esc(g.cat)}">
            <span class="cat-caret">${open ? "▾" : "▸"}</span>
            <span class="cat-name">${esc(g.cat)}</span>
            <span class="cat-meta">${g.items.length} 笔 · ¥${fmt(sum)}</span>
          </button>${panel}</div>`;
      })
      .join("") +
    `<div class="cat-grand">合计：¥${fmt(grand)}（${expenseItems.length} 笔）</div>`;

  box.querySelectorAll(".cat-head").forEach((btn) =>
    btn.addEventListener("click", () => {
      const c = btn.getAttribute("data-cat");
      if (expandedCats.has(c)) expandedCats.delete(c);
      else expandedCats.add(c);
      renderCategoryTable();
    })
  );
  box.querySelectorAll(".cat-panel table").forEach((t) => wireRowInputs(t));
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
  const invoiceItems = expenseItems.filter((i) => hasInvoice(i));
  const dipiaoItems = expenseItems.filter((i) => hasDipiao(i) && !hasInvoice(i));
  const noneItems = expenseItems.filter((i) => !hasInvoice(i) && !hasDipiao(i));

  const sum = (arr) => arr.reduce((s, i) => s + Number(i.amount || 0), 0);
  const total = sum(expenseItems);
  // 发票金额总计：各笔「发票金额」之和（有填的才算）
  const invoiceAmtTotal = expenseItems.reduce(
    (s, i) => s + (i.invoiceAmount === "" || i.invoiceAmount == null ? 0 : Number(i.invoiceAmount)),
    0
  );

  const cards = [
    { cls: "total", label: "实际付出总计", value: fmt(total) + " 元", sub: `共 ${expenseItems.length} 笔（流水实付）` },
    { cls: "invoice", label: "发票金额总计", value: fmt(invoiceAmtTotal) + " 元", sub: `已开票金额之和` },
    { cls: "none", label: "无发票金额", value: fmt(sum(noneItems)) + " 元", sub: `共 ${noneItems.length} 笔` },
  ];
  if (dipiaoItems.length > 0) {
    cards.push({
      cls: "tpiao",
      label: "抵票金额",
      value: fmt(sum(dipiaoItems)) + " 元",
      sub: `共 ${dipiaoItems.length} 笔`,
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

  // 一键下载所有发票（打包 zip）
  const zipBox = document.getElementById("download-all");
  if (zipBox && typeof invoiceZip !== "undefined") {
    const count = typeof invoiceList !== "undefined" ? invoiceList.length : "";
    zipBox.innerHTML = `<a class="btn" href="${esc(invoiceZip)}" download>⬇ 一键下载所有发票${count ? "（" + count + " 张，zip）" : "（zip）"}</a>`;
  }
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
        `    invoiceFiles: ${JSON.stringify(it.invoiceFiles || [])},`,
        `    invoiceCategory: ${J(it.invoiceCategory)},`,
        `    invoiceAmount: ${it.invoiceAmount === "" || it.invoiceAmount == null ? '""' : Number(it.invoiceAmount)},`,
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

// 挂发票弹窗：从已托管发票库里选，或本地上传，挂到这一笔
function openInvoicePicker(itemId) {
  const item = expenseItems.find((i) => i.id === itemId);
  const library = typeof invoiceList !== "undefined" ? invoiceList : [];
  const already = new Set(itemInvoices(item));

  let overlay = document.getElementById("inv-picker");
  if (overlay) overlay.remove();
  overlay = document.createElement("div");
  overlay.id = "inv-picker";
  overlay.className = "picker-overlay";
  overlay.innerHTML = `
    <div class="picker-box">
      <div class="picker-head">
        <div>给 <b>#${item.id} ${esc(item.description || "")}</b>（¥${fmt(item.amount)}）挂发票</div>
        <button class="picker-close">×</button>
      </div>
      <div class="picker-tools">
        <input class="picker-search" placeholder="搜商户 / 日期 / 金额…" />
        <label class="btn-outline upload-lbl">上传发票/行程单<input type="file" class="upload-input" data-kind="invoice" accept=".pdf,.png,.jpg,.jpeg,.ofd,image/*" multiple hidden /></label>
        <label class="btn-outline upload-lbl">上传抵票<input type="file" class="upload-input" data-kind="dipiao" accept=".pdf,.png,.jpg,.jpeg,.ofd,image/*" multiple hidden /></label>
        <label class="btn-outline upload-lbl">上传付款截图<input type="file" class="upload-input" data-kind="screenshot" accept=".pdf,.png,.jpg,.jpeg,image/*" multiple hidden /></label>
      </div>
      <div class="picker-hint muted">打车/机票可把发票和行程单一起选（可多选）。抵票和付款截图会分别标注，抵票下载时文件名带「抵票」前缀。</div>
      <div class="picker-list"></div>
    </div>`;
  document.body.appendChild(overlay);

  const listBox = overlay.querySelector(".picker-list");
  const search = overlay.querySelector(".picker-search");
  const hint = overlay.querySelector(".picker-hint");
  if (!library.length) hint.textContent = "这份报销单还没有托管发票库，可用上面的「上传…」按钮直接挂本地文件（可多选）。";

  // 本地上传（三种类型）
  overlay.querySelectorAll(".upload-input").forEach((input) =>
    input.addEventListener("change", (e) => {
      const kind = input.getAttribute("data-kind");
      const kindLabel = kind === "dipiao" ? "抵票" : kind === "screenshot" ? "付款截图" : "发票/行程单";
      const filesSel = Array.from(e.target.files || []);
      let done = 0;
      filesSel.forEach((file) => {
        if (file.size > 4 * 1024 * 1024) {
          hint.textContent = `「${file.name}」超过 4MB，太大存不进浏览器，建议打包发我托管。`;
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const ref = addUpload(file.name, reader.result, kind);
            attachInvoice(itemId, ref);
            already.add(ref);
            done++;
            hint.textContent = `已上传并挂上 ${done} 个${kindLabel}。仅存本浏览器；点「导出发票挂载」发我可永久托管。`;
            draw();
            renderFilterBar();
            renderExpenseTable();
            renderSummaryCards();
          } catch (err) {
            hint.textContent = "浏览器本地存储已满，无法再存；请把文件打包发我托管。";
          }
        };
        reader.readAsDataURL(file);
      });
    })
  );

  function draw() {
    const q = search.value.trim().toLowerCase();
    const rows = library
      .slice()
      // 金额吻合的排最前，其次按日期
      .sort((a, b) => {
        const am = Math.abs((a.amount || 0) - item.amount) < 0.01 ? 0 : 1;
        const bm = Math.abs((b.amount || 0) - item.amount) < 0.01 ? 0 : 1;
        if (am !== bm) return am - bm;
        return (a.date || "").localeCompare(b.date || "");
      })
      .filter((v) => {
        if (!q) return true;
        return ((v.merchant || "") + " " + (v.date || "") + " " + (v.amount != null ? v.amount : "") + " " + (v.kind || "")).toLowerCase().includes(q);
      });
    listBox.innerHTML = rows
      .map((v) => {
        const on = already.has(v.file);
        const near = Math.abs((v.amount || 0) - item.amount) < 0.01 ? ' <span class="pick-near">金额吻合</span>' : "";
        return `<div class="pick-row">
          <div class="pick-info"><b>${esc(v.merchant || "发票")}</b>${near}<br><span class="muted">${esc(v.date || "")} · ${esc(v.kind || "")} · ${v.amount != null ? "¥" + fmt(v.amount) : "金额见文件"}</span></div>
          <a class="btn" href="${esc(invoiceHref(v.file))}" download target="_blank" rel="noopener">看</a>
          <button class="btn pick-add" data-file="${esc(v.file)}" ${on ? "disabled" : ""}>${on ? "已挂" : "选"}</button>
        </div>`;
      })
      .join("");
    listBox.querySelectorAll(".pick-add").forEach((b) => {
      b.addEventListener("click", () => {
        attachInvoice(itemId, b.getAttribute("data-file"));
        already.add(b.getAttribute("data-file"));
        draw();
        renderFilterBar();
        renderExpenseTable();
        renderSummaryCards();
      });
    });
  }
  // 金额吻合的发票会自动排在最前并标「金额吻合」
  draw();
  search.addEventListener("input", draw);
  overlay.querySelector(".picker-close").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// 导出人工挂载映射（发我可永久写进 data 文件）
function setupAttachExport() {
  const btn = document.getElementById("attach-export-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const map = loadAttach();
    // 把被挂上的本地上传文件（data URL）也一起导出，这样我能永久托管
    const uploads = loadUploads();
    const usedUploads = {};
    Object.values(map).forEach((files) => {
      files.forEach((f) => {
        if (f.indexOf("upload:") === 0) {
          const id = f.slice("upload:".length);
          if (uploads[id]) usedUploads[id] = uploads[id];
        }
      });
    });
    const out = { report: reportInfo.reportTitle, attachments: map, uploads: usedUploads };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "invoice-attach.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

// 发票清单：把托管在 invoices/ 里的所有发票列出来，方便人工对应/下载
function renderInvoiceList() {
  const box = document.getElementById("invoice-list-section");
  if (!box || typeof invoiceList === "undefined") return;
  const rows = invoiceList
    .slice()
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .map(
      (v) => `
      <tr>
        <td>${esc(v.date || "-")}</td>
        <td>${esc(v.merchant || "-")}</td>
        <td>${esc(v.kind || "-")}</td>
        <td class="amount-cell">${v.amount != null ? fmt(v.amount) : "-"}</td>
        <td><a class="btn inv-list-link" href="${esc(v.file)}" download target="_blank" rel="noopener">下载</a></td>
      </tr>`
    )
    .join("");
  box.innerHTML = `
    <h2>发票清单（已托管 ${invoiceList.length} 张）</h2>
    <p class="muted" style="margin-top:-6px;font-size:13px;">这些发票已上传到网页、可直接下载。上表未自动挂上的（酒店分晚、美团餐费等），可对照日期/商户/金额人工匹配。</p>
    <div style="overflow-x:auto"><table>
      <thead><tr><th>日期</th><th>商户</th><th>类型</th><th>金额（元）</th><th>操作</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

// 鼠标悬停发票 chip 时预览（图片直接显示，PDF 用 iframe 渲染）
function setupPreview() {
  if (document.getElementById("inv-preview")) return;
  const box = document.createElement("div");
  box.id = "inv-preview";
  box.style.display = "none";
  document.body.appendChild(box);

  function extOf(a) {
    const dn = a.getAttribute("download") || "";
    const href = a.getAttribute("href") || "";
    let ext = (dn.split(".").pop() || "").toLowerCase();
    if (!ext || ext.length > 5) ext = (href.split("?")[0].split(".").pop() || "").toLowerCase();
    if (href.indexOf("data:image") === 0) ext = "png";
    if (href.indexOf("data:application/pdf") === 0) ext = "pdf";
    return ext;
  }
  document.addEventListener("mouseover", (e) => {
    const a = e.target.closest && e.target.closest(".inv-chip a, .pick-row a, .inv-list-link");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const ext = extOf(a);
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      box.innerHTML = `<img src="${href}" alt="预览" />`;
    } else if (ext === "pdf") {
      box.innerHTML = `<iframe src="${href}#toolbar=0&navpanes=0" title="预览"></iframe>`;
    } else {
      box.innerHTML = `<div class="prev-none">此类型（${esc(ext || "?")}）无法预览，点开可下载查看</div>`;
    }
    box.style.display = "block";
    positionPreview(e);
  });
  document.addEventListener("mousemove", (e) => {
    if (box.style.display === "block") positionPreview(e);
  });
  document.addEventListener("mouseout", (e) => {
    const a = e.target.closest && e.target.closest(".inv-chip a, .pick-row a, .inv-list-link");
    if (a) box.style.display = "none";
  });
  function positionPreview(e) {
    const w = 300,
      h = 320;
    let x = e.clientX + 18,
      y = e.clientY + 18;
    if (x + w > window.innerWidth) x = e.clientX - w - 18;
    if (y + h > window.innerHeight) y = window.innerHeight - h - 10;
    if (y < 10) y = 10;
    box.style.left = x + "px";
    box.style.top = y + "px";
  }
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

  // 表头补充：公司 / 报销人 / 项目 / 借款金额（借款可编辑）
  const box = document.getElementById("report-meta");
  if (box) {
    box.innerHTML =
      `<span>公司：<b>${esc(reportInfo.company || "-")}</b></span>` +
      `<span>报销人：<b>${esc(reportInfo.submitter || "-")}</b></span>` +
      `<span>项目名称：<b>${esc(reportInfo.project || "-")}</b></span>` +
      `<span>报销周期：<b>${esc(reportInfo.period || "-")}</b></span>` +
      `<span>借款金额：¥<input id="loan-input" class="loan-input" value="${reportInfo.loan != null ? reportInfo.loan : 0}" inputmode="decimal" /></span>`;
    const loanInp = document.getElementById("loan-input");
    if (loanInp) {
      loanInp.addEventListener("change", () => {
        const v = parseFloat(String(loanInp.value).replace(/[,，¥￥\s]/g, ""));
        reportInfo.loan = isNaN(v) ? 0 : v;
        setMeta("loan", reportInfo.loan);
        renderSummaryCards();
      });
    }
  }
}
// 表头字段（借款）本地存储
const META_KEY = "expense-meta:" + (typeof reportInfo !== "undefined" ? reportInfo.reportTitle : "default");
function setMeta(field, value) {
  let map = {};
  try {
    map = JSON.parse(localStorage.getItem(META_KEY) || "{}");
  } catch (e) {}
  map[field] = value;
  localStorage.setItem(META_KEY, JSON.stringify(map));
}
(function applyMeta() {
  try {
    const map = JSON.parse(localStorage.getItem(META_KEY) || "{}");
    if (map.loan != null) reportInfo.loan = map.loan;
  } catch (e) {}
})();

renderHeader();
renderSummaryCards();
renderFilterBar();
renderExpenseTable();
renderCategoryTable();
renderTpiaoTable();
renderInvoiceList();
setupExport();
setupAttachExport();
setupPreview();
