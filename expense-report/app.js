// 根据 data.js 中的 reportInfo / expenseItems / tpiaoFiles 渲染整个页面。
// 不需要修改这个文件，只需要维护 data.js 里的数据即可。

const fmt = (n) =>
  Number(n || 0).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function voucherBadge(type) {
  if (type === "invoice") return '<span class="badge badge-invoice">发票</span>';
  if (type === "tpiao") return '<span class="badge badge-tpiao">T票</span>';
  return '<span class="badge badge-none">无凭证</span>';
}

function voucherDetail(item) {
  if (item.voucherType === "invoice") return item.invoiceFile ? item.invoiceFile.split("/").pop() : "-";
  if (item.voucherType === "tpiao") return item.tpiaoId || "-";
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
    return `<a class="btn" href="#tpiao-${item.tpiaoId}">查看T票 ${item.tpiaoId}</a>`;
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
        <td>${voucherDetail(item)}</td>
        <td>${voucherAction(item)}</td>
      </tr>`
    )
    .join("");

  const total = expenseItems.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  document.getElementById("total-amount-cell").textContent = fmt(total) + " 元";
}

function renderTpiaoTable() {
  const groups = {};
  expenseItems
    .filter((i) => i.voucherType === "tpiao" && i.tpiaoId)
    .forEach((i) => {
      if (!groups[i.tpiaoId]) groups[i.tpiaoId] = [];
      groups[i.tpiaoId].push(i);
    });

  const ids = Object.keys(groups).sort();
  const tbody = document.getElementById("tpiao-tbody");
  const emptyHint = document.getElementById("tpiao-empty");

  if (ids.length === 0) {
    tbody.innerHTML = "";
    emptyHint.style.display = "block";
    return;
  }
  emptyHint.style.display = "none";

  tbody.innerHTML = ids
    .map((tid) => {
      const items = groups[tid];
      const sum = items.reduce((s, i) => s + Number(i.amount || 0), 0);
      const file = typeof tpiaoFiles !== "undefined" ? tpiaoFiles[tid] : "";
      const action = file
        ? `<a class="btn" href="${file}" download target="_blank" rel="noopener">下载凭证</a>`
        : '<span class="muted">无扫描件</span>';
      return `
      <tr id="tpiao-${tid}">
        <td>${tid}</td>
        <td>${items.map((i) => "#" + i.id).join("、")}</td>
        <td>${items.map((i) => i.category + (i.description ? "（" + i.description + "）" : "")).join("；")}</td>
        <td class="amount-cell">${fmt(sum)}</td>
        <td>${action}</td>
      </tr>`;
    })
    .join("");
}

function renderSummaryCards() {
  const invoiceItems = expenseItems.filter((i) => i.voucherType === "invoice");
  const tpiaoItems = expenseItems.filter((i) => i.voucherType === "tpiao");
  const noneItems = expenseItems.filter((i) => i.voucherType === "none");

  const total = expenseItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const invoiceTotal = invoiceItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const tpiaoTotal = tpiaoItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const noneTotal = noneItems.reduce((s, i) => s + Number(i.amount || 0), 0);
  const tpiaoCount = new Set(tpiaoItems.map((i) => i.tpiaoId)).size;

  const cards = [
    { cls: "total", label: "报销总金额", value: fmt(total) + " 元", sub: `共 ${expenseItems.length} 笔` },
    { cls: "invoice", label: "发票金额", value: fmt(invoiceTotal) + " 元", sub: `共 ${invoiceItems.length} 张发票` },
    { cls: "tpiao", label: "T票金额", value: fmt(tpiaoTotal) + " 元", sub: `共 ${tpiaoCount} 张T票 / ${tpiaoItems.length} 笔` },
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
renderTpiaoTable();
