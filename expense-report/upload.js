// ---- 页面直传发票库：把文件直接提交进 GitHub 仓库的 invoices/extra/，
// 需要报销人自己的 GitHub 令牌（只存本机浏览器），提交后 Actions 会自动更新清单并重新部署。
// 依赖 app.js 里的全局：invoiceList / renderInvoiceList。 ----
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

// 一批文件一次 commit：blob → tree → commit → 更新 main。
// 提交瞬间如果仓库正好有别的提交进来（比如自动更新清单的机器人），
// 更新 main 会报 422 非快进，这里自动换最新基础重试几次。
async function commitFilesToLibrary(files, onStatus) {
  // 已有文件名，重名自动加 -2 / -3
  const existing = await ghApi("/contents/" + GH_DIR + "?ref=main");
  const taken = new Set(existing.map((f) => f.name));
  const treeItems = [];
  const finalNames = [];
  for (let i = 0; i < files.length; i++) {
    onStatus("正在上传 " + (i + 1) + "/" + files.length + "：" + files[i].name);
    const b64 = await fileToBase64(files[i]);
    const blob = await ghApi("/git/blobs", { method: "POST", body: JSON.stringify({ content: b64, encoding: "base64" }) });
    let name = files[i].name.replace(/[\\/:*?"<>|]/g, "-");
    const dot = name.lastIndexOf(".");
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : "";
    for (let n = 2; taken.has(name); n++) name = stem + "-" + n + ext;
    taken.add(name);
    finalNames.push(name);
    treeItems.push({ path: GH_DIR + "/" + name, mode: "100644", type: "blob", sha: blob.sha });
  }
  for (let attempt = 1; ; attempt++) {
    onStatus(attempt > 1 ? "仓库刚有新提交，正在重试（第 " + attempt + " 次）…" : "正在提交…");
    const head = await ghApi("/git/ref/heads/main");
    const headSha = head.object.sha;
    const headCommit = await ghApi("/git/commits/" + headSha);
    const tree = await ghApi("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: headCommit.tree.sha, tree: treeItems }) });
    const commit = await ghApi("/git/commits", {
      method: "POST",
      body: JSON.stringify({ message: "页面直传发票 " + finalNames.length + " 张", tree: tree.sha, parents: [headSha] }),
    });
    try {
      await ghApi("/git/refs/heads/main", { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
      return finalNames;
    } catch (e) {
      if (e.status === 422 && attempt < 4) {
        await new Promise((r) => setTimeout(r, 1200 * attempt));
        continue;
      }
      if (e.status === 422) throw new Error("仓库连续几次都在同一时间有新提交（422），稍等十几秒再点一次就好");
      throw e;
    }
  }
}

function setupLibraryUpload() {
  const input = document.getElementById("lib-upload-input");
  const status = document.getElementById("lib-upload-status");
  if (!input) return;
  input.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files || []);
    input.value = "";
    if (!files.length) return;
    if (!askGhToken(false)) {
      status.textContent = "没有令牌，传不了；也可以把文件发我来托管。";
      return;
    }
    try {
      const names = await commitFilesToLibrary(files, (msg) => (status.textContent = msg));
      // 先把它们立刻加进本页的发票库（正式部署要等 2-3 分钟，但现在就能挂）
      names.forEach((name) => {
        const path = "invoices/extra/" + name;
        if (typeof invoiceList !== "undefined" && !invoiceList.some((v) => v.file === path)) {
          const meta = guessInvoiceMeta(name);
          invoiceList.push({ file: path, date: meta.date, merchant: meta.merchant, amount: meta.amount, kind: meta.kind });
        }
      });
      renderInvoiceList();
      status.textContent = "已提交 " + names.length + " 张 ✓ 现在就能在「＋挂发票」里选到；正式生效（可预览/下载）约需 2-3 分钟。";
    } catch (err) {
      status.textContent = "上传失败：" + err.message + "（在中国大陆连不上 GitHub 接口时也会这样；可换网络重试，或把文件发我）";
    }
  });
}

setupLibraryUpload();
