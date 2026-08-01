// ---- 页面直传发票库（后台队列版）----
// 选完文件立刻挂上、立刻能继续操作；真正的提交在后台排队一批批进行，
// 多次选择会自动排队，进度显示在表格上方的蓝色状态行。
// 依赖 app.js 里的全局：invoiceList / renderInvoiceList / attachInvoice / loadAttach / saveAttach 等。
const GH_REPO = "suuuuuuzh/toy-github-pages";
const GH_DIR = "expense-report/invoices/extra";
const GH_TOKEN_KEY = "gh-upload-token";

function askGhToken(forceAsk) {
  let t = (localStorage.getItem(GH_TOKEN_KEY) || "").trim();
  if (t && !forceAsk) return t;
  t = (prompt(
    "第一次用「传发票进库」需要粘贴你的 GitHub 令牌（github_pat_ 开头，只保存在这台设备的浏览器里）。\n\n" +
      "创建方法：登录 GitHub → 打开 github.com/settings/personal-access-tokens/new\n" +
      "· Repository access 选 Only select repositories → 勾 toy-github-pages\n" +
      "· Permissions → Contents → Read and write\n" +
      "· Generate 后把令牌整段复制粘到这里",
    t || ""
  ) || "").trim();
  if (t) localStorage.setItem(GH_TOKEN_KEY, t);
  return t;
}

async function ghApi(path, opts) {
  const token = (localStorage.getItem(GH_TOKEN_KEY) || "").trim();
  const r = await fetch("https://api.github.com/repos/" + GH_REPO + path, Object.assign({}, opts, {
    headers: Object.assign(
      { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
      (opts && opts.headers) || {}
    ),
  }));
  if (r.status === 401 || r.status === 403) {
    localStorage.removeItem(GH_TOKEN_KEY);
    throw new Error("令牌无效或没权限（已清掉，下次点会重新问你要）");
  }
  if (!r.ok) {
    const e = new Error("GitHub 接口返回 " + r.status);
    e.status = r.status;
    throw e;
  }
  return r.json();
}

// 从文件名猜 商户/金额/日期/类型（与 tools/gen_extra_manifest.py 的规则一致，不用 lookbehind 以兼容旧手机浏览器）
function guessInvoiceMeta(filename) {
  const stem = filename.replace(/\.[^.]+$/, "");
  let amount = null;
  let m = stem.match(/(^|[^\d])(\d{1,6}\.\d{1,2})(?!\d)/);
  if (m) amount = parseFloat(m[2]);
  else {
    m = stem.match(/(?:[¥￥]|[-_（(])(\d{1,6})(?:元)?[)）]?$/);
    if (m) amount = parseFloat(m[1]);
  }
  let date = null;
  m = stem.match(/(20\d{2})[-_.年]?(0[1-9]|1[0-2])[-_.月]?(0[1-9]|[12]\d|3[01])(?!\d)/);
  if (m) date = m[1] + "-" + m[2] + "-" + m[3];
  const kind = /替票|抵票/.test(stem) ? "抵票" : /截图/.test(stem) ? "付款截图" : "发票";
  let label = stem
    .replace(/^(?:替票|抵票|付款截图|截图)[-_\s]*/, "")
    .replace(/(20\d{2})[-_.年]?(0[1-9]|1[0-2])[-_.月]?(0[1-9]|[12]\d|3[01])日?(?!\d)/g, "")
    .replace(/(^|[^\d])\d{1,6}\.\d{1,2}(?!\d)/g, "$1")
    .replace(/(?:[¥￥]|[-_（(])\d{1,6}(?:元)?[)）]?$/, "")
    .replace(/^[-_（()）\s]+|[-_（()）\s]+$/g, "");
  return { amount: amount, date: date, kind: kind, merchant: label || stem };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// GitHub 提交互斥锁：后台队列和搬家共用，保证同一时间只有一个提交在进行
let ghChain = Promise.resolve();
function withGhLock(fn) {
  const p = ghChain.then(fn);
  ghChain = p.catch(() => {});
  return p;
}

// ---- 后台上传队列 ----
const uploadJobs = []; // { files: [{file, name}], kind, itemId, tries }
let uploadingNow = false;
let currentJobMsg = "";
const failedJobs = [];

function libTakenNames() {
  const s = new Set();
  if (typeof invoiceList !== "undefined") invoiceList.forEach((v) => s.add(v.file.split("/").pop()));
  uploadJobs.forEach((j) => j.files.forEach((f) => s.add(f.name)));
  failedJobs.forEach((j) => j.files.forEach((f) => s.add(f.name)));
  return s;
}

function pickUploadName(orig, kind, taken) {
  const prefix = kind === "dipiao" ? "抵票-" : kind === "screenshot" ? "付款截图-" : "";
  let name = orig.replace(/[\\/:*?"<>|]/g, "-");
  if (prefix && name.indexOf(prefix.slice(0, -1)) === -1) name = prefix + name;
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  for (let n = 2; taken.has(name); n++) name = stem + "-" + n + ext;
  taken.add(name);
  return name;
}

// 路径改名时同步修正发票库和挂载记录（极少发生：别的设备恰好占了同名）
function renameLibraryPath(oldPath, newPath) {
  if (typeof invoiceList !== "undefined") {
    const v = invoiceList.find((x) => x.file === oldPath);
    if (v) v.file = newPath;
  }
  if (typeof loadAttach !== "undefined") {
    const at = loadAttach();
    let changed = false;
    Object.keys(at).forEach((k) => {
      at[k] = at[k].map((f) => (f === oldPath ? ((changed = true), newPath) : f));
    });
    if (changed) saveAttach(at);
  }
}

// 立刻挂上并排队。返回最终文件名数组（同名自动加 -2/-3）。
function enqueueLibraryUpload(fileList, kind, itemId) {
  const taken = libTakenNames();
  const files = Array.from(fileList).map((f) => ({ file: f, name: pickUploadName(f.name, kind, taken) }));
  files.forEach((en) => {
    const path = "invoices/extra/" + en.name;
    if (typeof invoiceList !== "undefined" && !invoiceList.some((v) => v.file === path)) {
      const meta = guessInvoiceMeta(en.name);
      if (kind === "dipiao") meta.kind = "抵票";
      if (kind === "screenshot") meta.kind = "付款截图";
      invoiceList.push({ file: path, date: meta.date, merchant: meta.merchant, amount: meta.amount, kind: meta.kind });
    }
    if (itemId != null) attachInvoice(itemId, path);
  });
  uploadJobs.push({ files: files, kind: kind, itemId: itemId, tries: 0 });
  updateQueueStatus();
  runUploadWorker();
  return files.map((f) => f.name);
}

// 一批文件一次 commit；422（提交撞车）自动换最新基础重试
async function commitJob(job, onStatus) {
  // 远端同名检查（防止覆盖别的设备刚传的同名文件）
  const existing = await ghApi("/contents/" + GH_DIR + "?ref=main");
  const remote = new Set(existing.map((f) => f.name));
  job.files.forEach((en) => {
    if (remote.has(en.name)) {
      const dot = en.name.lastIndexOf(".");
      const stem = dot > 0 ? en.name.slice(0, dot) : en.name;
      const ext = dot > 0 ? en.name.slice(dot) : "";
      let name = en.name;
      for (let n = 2; remote.has(name); n++) name = stem + "-" + n + ext;
      renameLibraryPath("invoices/extra/" + en.name, "invoices/extra/" + name);
      en.name = name;
    }
    remote.add(en.name);
  });
  const treeItems = [];
  for (let i = 0; i < job.files.length; i++) {
    onStatus("正在上传 " + (i + 1) + "/" + job.files.length + "：" + job.files[i].name);
    const b64 = await fileToBase64(job.files[i].file);
    const blob = await ghApi("/git/blobs", { method: "POST", body: JSON.stringify({ content: b64, encoding: "base64" }) });
    treeItems.push({ path: GH_DIR + "/" + job.files[i].name, mode: "100644", type: "blob", sha: blob.sha });
  }
  for (let attempt = 1; ; attempt++) {
    onStatus(attempt > 1 ? "仓库刚有新提交，正在重试（第 " + attempt + " 次）…" : "正在提交…");
    const head = await ghApi("/git/ref/heads/main");
    const headSha = head.object.sha;
    const headCommit = await ghApi("/git/commits/" + headSha);
    const tree = await ghApi("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: headCommit.tree.sha, tree: treeItems }) });
    const commit = await ghApi("/git/commits", {
      method: "POST",
      body: JSON.stringify({ message: "页面直传发票 " + job.files.length + " 张", tree: tree.sha, parents: [headSha] }),
    });
    try {
      await ghApi("/git/refs/heads/main", { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
      return;
    } catch (e) {
      if (e.status === 422 && attempt < 5) {
        await new Promise((r) => setTimeout(r, 1200 * attempt));
        continue;
      }
      throw e;
    }
  }
}

async function runUploadWorker() {
  if (uploadingNow) return;
  uploadingNow = true;
  while (uploadJobs.length) {
    const job = uploadJobs[0];
    try {
      await withGhLock(() =>
        commitJob(job, (msg) => {
          currentJobMsg = msg;
          updateQueueStatus();
        })
      );
      uploadJobs.shift();
      currentJobMsg = "";
      updateQueueStatus();
      if (typeof renderInvoiceList === "function") renderInvoiceList();
    } catch (e) {
      job.tries = (job.tries || 0) + 1;
      if (job.tries < 3) {
        currentJobMsg = "这批没传上（" + e.message + "），" + 5 * job.tries + " 秒后自动重试…";
        updateQueueStatus();
        await new Promise((r) => setTimeout(r, 5000 * job.tries));
      } else {
        uploadJobs.shift();
        failedJobs.push(job);
        currentJobMsg = "";
        updateQueueStatus();
      }
    }
  }
  uploadingNow = false;
  updateQueueStatus();
}

function updateQueueStatus() {
  const status = document.getElementById("lib-upload-status");
  if (!status) return;
  const pending = uploadJobs.reduce((s, j) => s + j.files.length, 0);
  const parts = [];
  if (pending) parts.push("后台上传中：还剩 " + pending + " 个文件" + (currentJobMsg ? "（" + currentJobMsg + "）" : "…"));
  else if (uploadingNow) parts.push(currentJobMsg || "正在收尾…");
  if (failedJobs.length) {
    const n = failedJobs.reduce((s, j) => s + j.files.length, 0);
    parts.push('有 ' + n + ' 个文件多次上传失败 <a href="#" id="retry-failed-link" style="font-weight:600">点这里重试</a>');
  }
  if (!parts.length) {
    if (status.dataset.hadQueue === "1") {
      status.textContent = "全部上传完成 ✓（预览/下载约 2-3 分钟后生效）";
      status.dataset.hadQueue = "";
      setTimeout(() => {
        if (!uploadJobs.length && !failedJobs.length && !uploadingNow) maybeOfferMigration();
      }, 8000);
    } else {
      maybeOfferMigration();
    }
    return;
  }
  status.dataset.hadQueue = "1";
  status.innerHTML = parts.join(" · ");
  const retry = document.getElementById("retry-failed-link");
  if (retry)
    retry.addEventListener("click", (e) => {
      e.preventDefault();
      while (failedJobs.length) {
        const j = failedJobs.shift();
        j.tries = 0;
        uploadJobs.push(j);
      }
      updateQueueStatus();
      runUploadWorker();
    });
}

// 离开页面前如果还有没传完的，提醒一下（不拦死，用户可选择留下）
window.addEventListener("beforeunload", (e) => {
  if (uploadJobs.length || uploadingNow) {
    e.preventDefault();
    e.returnValue = "还有发票在后台上传，关掉会丢失，确定离开？";
  }
});

// ---- 一键搬家：把浏览器 localStorage 里暂存的旧上传全部提交进仓库发票库，
// 改写所有引用，然后清空本地腾出空间。 ----
async function migrateLocalUploads(onStatus) {
  const uploads = typeof loadUploads !== "undefined" ? loadUploads() : {};
  const entries = Object.keys(uploads).map((id) => [id, uploads[id]]);
  if (!entries.length) {
    onStatus("本地没有暂存的上传。");
    return;
  }
  onStatus("正在读取本地暂存的 " + entries.length + " 个文件…");
  const files = [];
  const taken = libTakenNames();
  for (let i = 0; i < entries.length; i++) {
    const meta = entries[i][1];
    let name = meta.name || "upload-" + entries[i][0] + ".pdf";
    name = pickUploadName(name, meta.kind, taken);
    const res = await fetch(meta.data);
    const blob = await res.blob();
    files.push({ file: new File([blob], name, { type: blob.type || "application/octet-stream" }), name: name });
  }
  const job = { files: files, kind: "invoice", itemId: null, tries: 0 };
  await withGhLock(() => commitJob(job, onStatus));
  const refMap = {};
  entries.forEach((en, i) => (refMap["upload:" + en[0]] = "invoices/extra/" + files[i].name));
  const swap = (f) => refMap[f] || f;
  const attach = typeof loadAttach !== "undefined" ? loadAttach() : {};
  Object.keys(attach).forEach((k) => (attach[k] = attach[k].map(swap)));
  const merges = typeof loadMerges !== "undefined" ? loadMerges() : [];
  merges.forEach((m) => {
    if (m.item) {
      m.item.invoiceFile = swap(m.item.invoiceFile || "");
      m.item.invoiceFiles = (m.item.invoiceFiles || []).map(swap);
    }
  });
  // 先清掉大块头腾出空间，再写小数据
  saveUploads({});
  saveAttach(attach);
  if (typeof saveMerges !== "undefined") saveMerges(merges);
  files.forEach((en, i) => {
    const path = "invoices/extra/" + en.name;
    const kind = entries[i][1].kind === "dipiao" ? "抵票" : entries[i][1].kind === "screenshot" ? "付款截图" : "发票";
    if (typeof invoiceList !== "undefined" && !invoiceList.some((v) => v.file === path)) {
      const meta = guessInvoiceMeta(en.name);
      invoiceList.push({ file: path, date: meta.date, merchant: meta.merchant, amount: meta.amount, kind: kind });
    }
  });
  if (typeof rebuildItems !== "undefined") rebuildItems();
  if (typeof renderEverything === "function") renderEverything();
  if (typeof renderInvoiceList === "function") renderInvoiceList();
  onStatus("已把 " + files.length + " 个文件搬进仓库、本地空间已腾空 ✓ 一切挂载关系保持不变（预览约 2-3 分钟后生效）。");
}

function maybeOfferMigration() {
  const status = document.getElementById("lib-upload-status");
  if (!status) return;
  const ups = typeof loadUploads !== "undefined" ? loadUploads() : {};
  const n = Object.keys(ups).length;
  if (!n) return;
  status.innerHTML =
    "浏览器里还暂存着 " + n + " 个早期上传的文件，占满了本地空间。" +
    '<a href="#" id="migrate-uploads-link" style="font-weight:600">点这里一键搬进仓库发票库并腾出空间</a>';
  const link = document.getElementById("migrate-uploads-link");
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!askGhToken(false)) {
      status.textContent = "需要先配置 GitHub 令牌才能搬（重新点会再问你要）。";
      return;
    }
    try {
      await migrateLocalUploads((msg) => (status.textContent = msg));
    } catch (err) {
      status.textContent = "搬家失败：" + err.message + "。原数据未动，可再试一次。";
    }
  });
}

// ---- 通用：把几个文本文件提交进仓库（新建报销单等用），带 422 撞车重试 ----
function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
async function commitTextFilesToRepo(files, message) {
  return withGhLock(async () => {
    const treeItems = [];
    for (const f of files) {
      const blob = await ghApi("/git/blobs", { method: "POST", body: JSON.stringify({ content: b64utf8(f.text), encoding: "base64" }) });
      treeItems.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    for (let attempt = 1; ; attempt++) {
      const head = await ghApi("/git/ref/heads/main");
      const headCommit = await ghApi("/git/commits/" + head.object.sha);
      const tree = await ghApi("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: headCommit.tree.sha, tree: treeItems }) });
      const commit = await ghApi("/git/commits", { method: "POST", body: JSON.stringify({ message: message, tree: tree.sha, parents: [head.object.sha] }) });
      try {
        await ghApi("/git/refs/heads/main", { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
        return;
      } catch (e) {
        if (e.status === 422 && attempt < 4) { await new Promise((r) => setTimeout(r, 1200 * attempt)); continue; }
        throw e;
      }
    }
  });
}

function setupLibraryUpload() {
  const input = document.getElementById("lib-upload-input");
  const status = document.getElementById("lib-upload-status");
  if (!input) return;
  input.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    input.value = "";
    if (!files.length) return;
    if (!askGhToken(false)) {
      status.textContent = "没有令牌，传不了；也可以把文件发我来托管。";
      return;
    }
    const names = enqueueLibraryUpload(files, "invoice", null);
    if (typeof renderInvoiceList === "function") renderInvoiceList();
    status.textContent = "已加入后台上传队列（" + names.length + " 个）——现在就能在「＋挂发票」里选到，可继续操作。";
    setTimeout(updateQueueStatus, 800);
  });
}

setupLibraryUpload();
maybeOfferMigration();
