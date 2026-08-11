// 浏览器内生成「实支单」格式的 Excel（.xlsx），不依赖任何外部库。
// xlsx 本质是个 zip，这里自己写了 store 模式的 zip 打包 + 工作表 XML（含边框/合并/列宽/公式）。
// 版式对齐公司「实支单」模板；公司名/项目行/列头来自 site-config.js。

// ---------- CRC32 + 最小 zip 打包（store，不压缩） ----------
const CRC_TABLE = (function () {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function zipStore(files) {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const u16 = (n) => [n & 0xff, (n >> 8) & 0xff];
  const u32 = (n) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff];
  files.forEach((f) => {
    const nameBytes = enc.encode(f.name);
    const data = enc.encode(f.data);
    const crc = crc32(data);
    const local = [].concat(
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0)
    );
    chunks.push(new Uint8Array(local), nameBytes, data);
    central.push({ crc: crc, size: data.length, nameBytes: nameBytes, offset: offset });
    offset += local.length + nameBytes.length + data.length;
  });
  const cdStart = offset;
  central.forEach((c) => {
    const head = [].concat(
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
      u32(c.crc), u32(c.size), u32(c.size), u16(c.nameBytes.length),
      u16(0), u16(0), u16(0), u16(0), u32(0), u32(c.offset)
    );
    chunks.push(new Uint8Array(head), c.nameBytes);
    offset += head.length + c.nameBytes.length;
  });
  const end = [].concat(
    u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length),
    u32(offset - cdStart), u32(cdStart), u16(0)
  );
  chunks.push(new Uint8Array(end));
  return new Blob(chunks, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

// ---------- 工具 ----------
const xmlEsc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
// Excel 日期序列号（1899-12-30 起）
function excelDate(str) {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(str || "").trim());
  if (!m) return null;
  const d = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  return Math.round((d - Date.UTC(1899, 11, 30)) / 86400000);
}
// 人民币中文大写（用「分」做整数运算，避免浮点误差）
function cnUpper(amount) {
  const digits = "零壹贰叁肆伍陆柒捌玖";
  const units = ["", "拾", "佰", "仟"];
  const groups = ["", "万", "亿", "万亿"];
  const cents = Math.round(Number(amount || 0) * 100);
  if (cents === 0) return "零元整";
  const yuan = Math.floor(cents / 100), jiao = Math.floor(cents / 10) % 10, fen = cents % 10;
  const seg4 = (seg) => {
    let s = "", zero = false;
    for (let i = 3; i >= 0; i--) {
      const d = Math.floor(seg / Math.pow(10, i)) % 10;
      if (d) { if (zero) { s += "零"; zero = false; } s += digits[d] + units[i]; }
      else if (s) zero = true;
    }
    return s;
  };
  const segs = [];
  let y = yuan;
  while (y > 0) { segs.unshift(y % 10000); y = Math.floor(y / 10000); }
  let res = "";
  segs.forEach((seg, idx) => {
    if (seg === 0) return;
    const g = segs.length - 1 - idx;
    res += (idx > 0 && seg < 1000 ? "零" : "") + seg4(seg) + groups[g];
  });
  let out = yuan ? res + "元" : "";
  if (jiao === 0 && fen === 0) out += "整";
  else {
    if (jiao) out += digits[jiao] + "角";
    else if (yuan) out += "零";
    out += fen ? digits[fen] + "分" : "整";
  }
  return out;
}

// ---------- 样式表 ----------
// cellXfs 索引：0默认 1标题18粗 2小标题12粗 3常规左 4框居中 5框左自动换行
// 6框金额 7框日期 8框金额粗 9右对齐 10粗左 11框表头粗 12金额无框 13粗左大写
const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="2"><numFmt numFmtId="165" formatCode="yyyy/m/d"/><numFmt numFmtId="166" formatCode="#,##0.00"/></numFmts>
<fonts count="4">
<font><sz val="11"/><name val="宋体"/></font>
<font><sz val="18"/><b/><name val="宋体"/></font>
<font><sz val="12"/><b/><name val="宋体"/></font>
<font><sz val="11"/><b/><name val="宋体"/></font>
</fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="14">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="166" fontId="3" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

// ---------- 工作表构造 ----------
function Sheet(name) {
  this.name = name;
  this.cells = {};   // "A1" -> {v, t, s, f}
  this.merges = [];
  this.heights = {};
}
Sheet.prototype.set = function (ref, value, style, opts) {
  opts = opts || {};
  const c = { s: style == null ? 0 : style };
  if (opts.formula) c.f = opts.formula;
  else if (typeof value === "number") c.v = value;
  else if (opts.date) { const d = excelDate(value); if (d != null) c.v = d; else { c.v = String(value); c.t = "s"; } }
  else if (value !== "" && value != null) { c.v = String(value); c.t = "s"; }
  else return;
  this.cells[ref] = c;
};
Sheet.prototype.merge = function (ref) { this.merges.push(ref); };
Sheet.prototype.xml = function (widths) {
  const rows = {};
  Object.keys(this.cells).forEach((ref) => {
    const m = /^([A-Z]+)(\d+)$/.exec(ref);
    (rows[+m[2]] = rows[+m[2]] || []).push({ ref: ref, col: m[1], c: this.cells[ref] });
  });
  const colIdx = (s) => { let n = 0; for (let i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64); return n; };
  const body = Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b)
    .map((r) => {
      const cells = rows[r]
        .sort((a, b) => colIdx(a.col) - colIdx(b.col))
        .map((x) => {
          const c = x.c;
          if (c.f) return `<c r="${x.ref}" s="${c.s}"><f>${xmlEsc(c.f)}</f></c>`;
          if (c.t === "s") return `<c r="${x.ref}" s="${c.s}" t="inlineStr"><is><t xml:space="preserve">${xmlEsc(c.v)}</t></is></c>`;
          return `<c r="${x.ref}" s="${c.s}"><v>${c.v}</v></c>`;
        })
        .join("");
      const h = this.heights[r] ? ` ht="${this.heights[r]}" customHeight="1"` : "";
      return `<row r="${r}"${h}>${cells}</row>`;
    })
    .join("");
  const cols = widths
    ? `<cols>${Object.keys(widths).map((col) => `<col min="${colIdx(col)}" max="${colIdx(col)}" width="${widths[col]}" customWidth="1"/>`).join("")}</cols>`
    : "";
  const merges = this.merges.length
    ? `<mergeCells count="${this.merges.length}">${this.merges.map((m) => `<mergeCell ref="${m}"/>`).join("")}</mergeCells>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr/><dimension ref="A1"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/>${cols}<sheetData>${body}</sheetData>${merges}<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>`;
};

function buildWorkbook(sheets, widths) {
  const n = sheets.length;
  const files = [
    { name: "[Content_Types].xml", data:
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>` },
    { name: "_rels/.rels", data:
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", data:
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data:
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { name: "xl/styles.xml", data: STYLES_XML },
  ];
  sheets.forEach((s, i) => files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: s.xml(widths) }));
  return zipStore(files);
}

// ---------- 实支单版式 ----------
const SZD_COMPANY = typeof siteConfig !== "undefined" ? siteConfig.company : "";
const SZD_PROJECT = typeof siteConfig !== "undefined" ? siteConfig.projectLine : "";
const SZD_WIDTHS = { A: 5.8, B: 12.3, C: 12.7, D: 9.5, E: 38, F: 9.2, G: 12.5, H: 11.3 };

// rows: [{date, cat, desc, amount, ndocs}]
function shizhidanSheet(sheetName, title, rows, loan, total, note, submitter, reportDate) {
  const ws = new Sheet(sheetName);
  ws.merge("A1:E2");
  ws.set("A1", SZD_COMPANY, 1);
  ws.set("A4", SZD_PROJECT, 2);
  ws.set("F4", "实支单编号：", 3);
  ws.set("A5", "实支单", 2);
  ws.set("F5", "报销日期：", 3);
  ws.set("G5", reportDate, 3, { date: true });
  ws.set("A7", "部门：", 3);
  ws.set("D7", "姓名：" + (submitter || ""), 3);
  ws.set("F7", "职务：", 3);
  ws.merge("G7:H7");
  ws.set("A8", title, 2);

  const head = 9;
  ws.merge(`D${head}:E${head}`);
  ws.set(`A${head}`, "序号", 11);
  ws.set(`B${head}`, "支付日期", 11);
  ws.set(`C${head}`, (typeof siteConfig !== "undefined" && siteConfig.szdColumnC) || "景名/人物", 11);
  ws.set(`D${head}`, "支出项目用途（请填写清楚）", 11);
  ws.set(`E${head}`, "", 11);
  ws.set(`F${head}`, "单据数量", 11);
  ws.set(`G${head}`, "金额", 11);
  ws.set(`H${head}`, (typeof siteConfig !== "undefined" && siteConfig.szdColumnH) || "预算编号", 11);

  let r = head + 1;
  rows.forEach((row, idx) => {
    ws.merge(`D${r}:E${r}`);
    ws.set(`A${r}`, idx + 1, 4);
    ws.set(`B${r}`, row.date, 7, { date: true });
    ws.set(`C${r}`, row.cat, 4);
    ws.set(`D${r}`, row.desc, 5);
    ws.set(`E${r}`, "", 5);
    ws.set(`F${r}`, row.ndocs, 4);
    ws.set(`G${r}`, Number(row.amount || 0), 6);
    ws.set(`H${r}`, "", 4);
    ws.heights[r] = 20;
    r++;
  });

  const last = r - 1;
  const totalRow = r + 1;
  ws.set(`A${totalRow}`, "付款总额：(A) 人民币大写：", 3);
  ws.set(`D${totalRow}`, cnUpper(total), 13);
  ws.set(`F${totalRow}`, "￥：", 9);
  ws.set(`G${totalRow}`, null, 8, { formula: `SUM(G${head + 1}:G${last})` });

  r = totalRow + 1;
  const loanRow = r;
  ws.set(`A${r}`, "付款方式：", 3);
  ws.set(`D${r}`, "借款金额（如有借款）：（B)", 3);
  ws.merge(`G${r}:H${r}`);
  ws.set(`G${r}`, Number(loan || 0), 12);

  r++;
  ws.set(`B${r}`, "1、现金", 3);
  ws.set(`D${r}`, "净付金额：(A)-(B)", 3);
  ws.merge(`G${r}:H${r}`);
  ws.set(`G${r}`, null, 12, { formula: `IF(G${totalRow}-G${loanRow}>0,G${totalRow}-G${loanRow},0)` });

  r++;
  ws.set(`B${r}`, "2、支票", 3);
  ws.set(`D${r}`, "退还借款金额：(B)-(A)", 3);
  ws.merge(`G${r}:H${r}`);
  ws.set(`G${r}`, null, 12, { formula: `IF(G${loanRow}-G${totalRow}>0,G${loanRow}-G${totalRow},0)` });

  r++;
  ws.set(`B${r}`, "3、汇款", 3);
  ws.set(`D${r}`, "备注：" + (note || ""), 3);
  ws.merge(`G${r}:H${r}`);

  r += 2;
  ws.set(`A${r}`, "净付大写：", 3);
  ws.merge(`B${r}:F${r}`);
  ws.set(`B${r}`, cnUpper(Math.max(total - Number(loan || 0), 0)), 13);
  return ws;
}

function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// 当前报销单 → 实支单 Excel
function exportShizhidan() {
  const rows = expenseItems.map((it) => ({
    date: it.date,
    cat: it.category,
    desc: it.description || "",
    amount: Number(it.amount || 0),
    ndocs: (typeof itemInvoices === "function" ? itemInvoices(it).length : 0) || "",
  }));
  const total = rows.reduce((s, x) => s + x.amount, 0);
  const title = (reportInfo.reportTitle || "报销单").replace(/^报销单\s*·\s*/, "") + (reportInfo.period ? "　" + reportInfo.period : "");
  const today = new Date().toISOString().slice(0, 10);
  const ws = shizhidanSheet(
    "实支单", title, rows, reportInfo.loan || 0, total, "",
    reportInfo.submitter || "水素", reportInfo.reportDate || today
  );
  const slug = (location.search.match(/[?&]r=([\w-]+)/) || [])[1] ||
    (location.pathname.split("/").pop() || "report").replace(/\.html$/, "");
  downloadBlob(buildWorkbook([ws], SZD_WIDTHS), "实支单-" + slug + "-" + today + ".xlsx");
}

function setupXlsxExport() {
  const btn = document.getElementById("xlsx-export-btn");
  if (btn) btn.addEventListener("click", exportShizhidan);
}
setupXlsxExport();
