// 根据 data.js 中的 reportInfo / categoryOptions / expenseItems / tpiaoList 渲染整个页面。
// 不需要修改这个文件，只需要维护 data.js 里的数据即可。

const fmt = (n) =>
  Number(n || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function findTpiao(id) {
  const list = typeof tpiaoList !== "undefined" ? tpiaoList : [];
  return list.find((t) => t.id === id);
}

function voucherBadge(type) {
  if (type === "invoice") return '<span class="badge badge-invoice">发票</span>';
  if (type === "tpiao") return '<span class="badge badge-tpiao">T票</span>';
  return '<span class="badge badge-none">无凭证</span>';
}

// 发票类型/发票内容：正式发票直接显示 invoiceCategory；走替票的显示每张替票自己的
// 发票内容，并按惯例加上"抵票-"前缀（例如"抵票-酒"）。
function voucherCategoryLabel(item) {
  if (item.voucherType === "invoice") return item.invoiceCategory || "-";
  if (item.voucherType === "tpiao") {
    const ids = item.tpiaoIds || [];
    const labels = ids.map((id) => {
      const t = findTpiao(id);
      return t && t.invoiceCategory ? "抵票-" + t.invoiceCategory : "抵票-" + id;
    });
    return labels.length ? labels.join("、") : "-";
  }
  return "-";
}

function voucherRefDetail(item) {
  if (item.voucherType === "invoice") return item.invoiceFile ? item.invoiceFile.split("/").pop() : "-";
  if (item.voucherType === "tpiao") {
    const ids = item.tpiaoIds || [];
    return ids.length ? ids.join("、") : "-";
  }
  return "-";
}

function voucherAction(item) {
  if (item.voucherType === "invoice") {
    if (item.invoiceFile) {
      return `<a class="btn" href="${item.invoiceFile}" download target="_blank" rel="noopener">下载发票</a>`;
    }
    return '<a class="btn disabled">发票未上传</a>';
  }
  if (item.voucherType === "tpiao") {
    const ids = item.tpiaoIds || [];
    if (!ids.length) return '<span class="muted">未关联替票</span>';
    return ids.map((id) => `<a class="btn" href="#tpiao-${id}">查看${id}</a>`).join(" ");
  }
  return '<span class="muted">-</span>';
}

function renderExpenseTable() {
  const tbody = document.getElementById("expense-tbody");
  tbody.innerHTML = expenseItems
    .map(
      (item) => `
      <tr class="${item.voucherType === "none" ? "row-none" : ""}">
        <td>${item.id}</td>
        <td>${item.category}</td>
        <td>${item.description || "-"}</td>
        <td>${item.date || "-"}</td>
        <td class="amount-cell">${fmt(item.amount)}</td>
        <td>${voucherBadge(item.voucherType)}</td>
        <td>${voucherCategoryLabel(item)}</td>
        <td>${voucherRefDetail(item)}</td>
        <td>${voucherAction(item)}</td>
      </tr>`
    )
    .join("");

  const total = expenseItems.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  document.getElementById("total-amount-cell").textContent = fmt(total) + " 元";
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
        <td>${r.cat}</td>
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

  if (list.length === 0) {
    tbody.innerHTML = "";
    emptyHint.style.display = "block";
    return;
  }
  emptyHint.style.display = "none";

  tbody.innerHTML = list
    .map((ticket) => {
      const usedBy = expenseItems.filter(
        (i) => i.voucherType === "tpiao" && (i.tpiaoIds || []).includes(ticket.id)
      );
      const relatedIds = usedBy.map((i) => "#" + i.id).join("、") || "-";
      const relatedDesc =
        usedBy
          .map((i) => i.category + (i.description ? "（" + i.description + "）" : ""))
          .join("；") || "-";
      const invoiceLabel = ticket.invoiceCategory ? "抵票-" + ticket.invoiceCategory : "-";
      const action = ticket.file
        ? `<a class="btn" href="${ticket.file}" download target="_blank" rel="noopener">下载凭证</a>`
        : '<span class="muted">无扫描件</span>';
      return `
      <tr id="tpiao-${ticket.id}">
        <td>${ticket.id}</td>
        <td>${invoiceLabel}</td>
        <td>${relatedIds}</td>
        <td>${relatedDesc}</td>
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
    { cls: "invoice", label: "发票金额", value: fmt(invoiceTotal) + " 元", sub: `共 ${invoiceItems.length} 张发票` },
    {
      cls: "tpiao",
      label: "T票覆盖金额",
      value: fmt(tpiaoBusinessTotal) + " 元",
      sub: `共 ${list.length} 张替票，面值合计 ${fmt(tpiaoFaceTotal)} 元 / ${tpiaoItems.length} 笔业务`,
    },
  ];
  if (noneItems.length > 0) {
    cards.push({ cls: "none", label: "无凭证金额（待补充）", value: fmt(noneTotal) + " 元", sub: `共 ${noneItems.length} 笔` });
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

function renderHeader() {
  document.getElementById("report-title").textContent = reportInfo.reportTitle || "报销单";
  document.getElementById("submitter").textContent = reportInfo.submitter || "-";
  document.getElementById("department").textContent = reportInfo.department || "-";
  document.getElementById("period").textContent = reportInfo.period || "-";
  document.getElementById("report-date").textContent = reportInfo.reportDate || "-";
  document.title = (reportInfo.reportTitle || "报销单") + " - " + (reportInfo.submitter || "");
}

renderHeader();
renderSummaryCards();
renderExpenseTable();
renderCategoryTable();
renderTpiaoTable();
