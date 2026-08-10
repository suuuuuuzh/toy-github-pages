# 两个人一起记同一张报销单

适用于：水素 + Lexie 两位制片，各自用自己的 AI，往**同一张报销单**里记账。
本文件同时写给人和 AI 看。Lexie 的 AI 直接读这个文件即可。

---

## 一、一次性设置（水素做，5 分钟）

1. 水素打开仓库 <https://github.com/suuuuuuzh/toy-github-pages>
2. **Settings → Collaborators and teams → Add people**
3. 填 Lexie 的 GitHub 用户名或邮箱，权限选 **Write**（写权限，能直接推送，不用走 PR）
4. Lexie 在邮箱里点 **Accept invitation**

Lexie 没有 GitHub 账号的话，先去 <https://github.com/signup> 注册一个，再回到第 3 步。

设置完，两人对这个仓库的权限完全相同，网站还是同一个：
<https://suuuuuuzh.github.io/toy-github-pages/expense-report/>

---

## 二、记在哪

**不新开单。** 所有堪景花销都记进同一张：

| 文件 | 报销单 | 页面 |
|---|---|---|
| `expense-report/data-hz08.js` | 报销单 D · 杭州八月堪景 | `sheet.html?r=hz08` |

日常行程记 `data-daily.js`（`sheet.html?r=daily`）。

---

## 三、怎么标记"谁记的"

在条目的 `remark` 字段**最前面**加方括号署名，其余备注照写：

```js
{
  id: 7,
  category: "餐费",
  description: "8/11 堪景午饭 3人",
  date: "2026-08-11",
  amount: 186,
  voucherType: "none",
  invoiceFile: "",
  invoiceFiles: [],
  invoiceCategory: "",
  invoiceAmount: "",
  tpiaoIds: [],
  remark: "[水素] 西溪路小馆，发票待开",
}
```

规则：

- 署名放最前，只有两种：`[水素] ` 和 `[Lexie] `，后面接正常备注
- **谁付的钱谁署名**。如果是一个人记账、另一个人垫付，写成 `[水素] 垫付：Lexie｜…`
- 网页上"备注"这一列直接可见可编辑，所以在手机上也一眼能看出是谁的

这样标记有两层保险：备注里的署名（人看得见），加上 git 提交记录（机器看得见，`git log` 能查到每一笔是谁的账号推的）。

---

## 四、防打架的三条铁律

同一个文件两个人同时改，会冲突。按这三条走基本不会出事：

1. **动手前先拉**：`git pull` —— 每次记账前必做，不能省
2. **记完立刻推**：改完马上 `git push`，不要攒着
3. **id 现取现用**：`id` 取**当前文件里的最大 id + 1**，不要凭记忆填

再加一条软约定：**两人尽量不要在同一分钟一起记**。发之前在群里说一句"我记一下"，记完说"好了"，比什么技术手段都管用。

---

## 五、万一还是冲突了

症状：push 被拒，或者文件里出现 `<<<<<<<` `=======` `>>>>>>>`。

处理原则：**两条都是真花销，一条都不能删**。

1. 把冲突标记删掉，两个人的条目都保留
2. 给重复的 `id` 重新编号（顺着往下排，不要跳号、不要重号）
3. 重新数一遍条数、加一遍金额，更新 `reports.js` 里 `hz08` 的 `count` 和 `total`
4. 提交，推送

交给 AI 处理时，把这段话给它就行："data-hz08.js 冲突了，两边的条目都保留，重新编 id，然后重算 reports.js 里 hz08 的 count 和 total。"

---

## 六、每记一笔要改的东西

1. `expense-report/data-hz08.js` —— `expenseItems` 数组末尾追加条目
2. `expense-report/reports.js` —— `hz08` 那一项的 `count`（笔数）和 `total`（合计，两位小数）

`total` 必须等于所有条目 `amount` 之和。改完可以跑一下自检：

```bash
node -e '
  const src = require("fs").readFileSync("expense-report/data-hz08.js","utf8");
  const items = eval(src + "\n;expenseItems");
  const t = items.reduce((s,i)=>s+i.amount,0);
  console.log("笔数", items.length, "合计", t.toFixed(2));
'
```

把输出的两个数字填进 `reports.js` 即可。

---

## 七、发票和截图

- 文件放 `expense-report/invoices/extra/`
- 命名：`日期_说明_[抵票/付款截图]_金额.扩展名`
  - 正式发票不加中间标记：`2026-08-11_堪景午饭_186.00.pdf`
  - 付款截图：`2026-08-11_堪景午饭_付款截图_186.00.jpg`
  - 抵票：`2026-08-11_堪景午饭_抵票_186.00.jpg`
- 放完跑一次 `python3 expense-report/tools/gen_extra_manifest.py`
- 然后把路径填进条目的 `invoiceFile` 和 `invoiceFiles`，`voucherType` 改成 `"invoice"`

**更省事的做法**：直接在网页上传。打开报销单页面，在对应条目上传附件，站点会自动归档，不用碰命令行。两个人都可以传。

---

## 八、发布到网站

网站从 `main` 分支发布。有写权限的话，最简单就是直接在 `main` 上改：

```bash
git pull
# ...改文件...
git add expense-report/data-hz08.js expense-report/reports.js
git commit -m "记账：[Lexie] 8/11 午饭 186"
git push
```

推完 1–2 分钟，网站生效。

**注意**：`main` 上有网页直传的发票文件和自动更新的 `invoices-extra.js`，永远只提交自己改过的具体文件，不要整个目录覆盖。

---

## 九、直接甩给对方 AI 的一段话

> 你是 Lexie 的报销记账助手。Lexie 是电影项目《竹林遗录》的制片，和另一位制片水素共用同一个 GitHub 仓库
> `suuuuuuzh/toy-github-pages` 记账，网站是 <https://suuuuuuzh.github.io/toy-github-pages/expense-report/>。
> 记账前先读 `expense-report/COLLAB.md`，严格按里面的规则执行：
> 所有堪景花销记进 `expense-report/data-hz08.js` 的 `expenseItems`，id 取当前最大 +1，
> 备注一律以 `[Lexie] ` 开头署名（水素的条目署 `[水素]`，不要动），同步更新 `reports.js` 里 hz08 的 count 和 total。
> 每次动手前先 `git pull`，改完立刻 `git push` 到 main。
> 不要新建报销单，不要改动其他代码。

---

## 十、对账

任何时候想核对，两人都可以看同一个页面：

- 报销单明细：<https://suuuuuuzh.github.io/toy-github-pages/expense-report/sheet.html?r=hz08>
- 首页总账（含预支和结余）：<https://suuuuuuzh.github.io/toy-github-pages/expense-report/>

想看"谁记了哪些"，在仓库里跑：

```bash
git log --oneline -- expense-report/data-hz08.js
```
