# Lexie 记账上手说明

> 一句话：你有一个**自己的 AI 记账会话**。花销发给它，它记进网站上**你自己的两张报销单**
> （拍摄 / 短片筹备）。月底水素从她那边导出你的实支单和发票包——你不用碰 Excel，也不用改网站。

网站：<https://suuuuuuzh.github.io/toy-github-pages/expense-report/>

---

## 一、水素先做的（5 分钟）

1. 加协作者：打开 <https://github.com/suuuuuuzh/toy-github-pages/settings/access> → **Add people**
   → 填 Lexie 的 GitHub 用户名 → 权限选 **Write**
2. 把本文链接发给 Lexie

---

## 二、Lexie 一次性准备（20 分钟，在电脑上做）

### 1. GitHub 账号（免费）

- 没有的话去 <https://github.com/signup> 注册；把用户名告诉水素
- 收到邀请邮件点 **Accept invitation**（或者打开 <https://github.com/suuuuuuzh/toy-github-pages>，
  页面顶部会有一条接受邀请的横幅）

### 2. Claude Pro（约 $20/月）

- <https://claude.ai> 订阅 Pro。免费版没有 Claude Code，连不上仓库，记不了账
- 用 ChatGPT Plus 的 Codex 也可以，流程一样；下面按 Claude 写

### 3. 开记账会话

1. 电脑浏览器打开 <https://claude.ai/code>
2. 第一次会让你连接 GitHub：点连接，用你自己的 GitHub 账号授权
3. 新建会话：仓库选 `suuuuuuzh/toy-github-pages`，分支用默认的 `main`
4. 把下面 **第五节「粘给 AI 的话」整段复制**，作为第一条消息发出去
5. 等它回复「Lexie 记账助手就绪」——完成

仓库列表里找不到 `toy-github-pages`？先确认第 1 步的邀请已经接受；还不行让水素在她的
GitHub 里检查 Claude 应用是否覆盖了这个仓库（她自己在用，正常是开着的）。

### 4. 手机

Claude App 登录同一个账号 → **Code**（代码）板块 → 打开这个会话。以后都在手机上发就行。

---

## 三、每天怎么发

直接打字，一条消息里几笔都行，**说清是拍摄还是筹备**：

> 拍摄：8/20 器材车加油 300，剧组午饭 12 人 480（有发票），停车 20
> 筹备：付了道具师定金 2000，美术看料打车 42

它会回一张小表 + 今日合计 + 哪几笔缺发票。1–2 分钟后网站更新。

- 记错了直接说：「昨天那笔打车改成 45」「删掉今天的停车费」
- 分不清拍摄还是筹备，它会问你一句
- 公司给你打了备用金/借款，告诉它金额，它填在表头，网站自动算差额

---

## 四、发票和截图怎么给

| 你手里的东西 | 怎么给 |
|---|---|
| 电子发票 PDF（滴滴、美团、酒店开的） | 以**文件**发到会话：微信/邮件里的 PDF → 用其他应用打开 / 分享 → Claude；或先存到手机「文件」里，再从会话的附件里选 |
| 纸质发票 | 拍照后**存成文件**再发（同下一行的做法）；或先只报金额，票攒着交给水素 |
| 付款截图 | 截图直接贴进对话，AI 只能**看**不能**存**——金额会记上，但截图挂不上。要挂上：截图 → 分享 → 「存储到文件」→ 会话里用附件→文件发；或者按第七节在网页上传 |
| 抵票 | 发文件时说一句「这张是抵票，抵 X 和 Y 两笔」 |

文件名不用你改，AI 会按规范重命名。

---

## 五、粘给 AI 的话（整段复制，作为会话第一条消息）

````
你是 Lexie 的报销记账助手。Lexie 是电影《竹林遗录》先导片的制片（廿一影视文化传播（上海）有限公司），
和另一位制片水素共用 GitHub 仓库 `suuuuuuzh/toy-github-pages` 记账。
网站 https://suuuuuuzh.github.io/toy-github-pages/expense-report/ ，GitHub Pages 从 `main` 分支发布。

你只管 Lexie 自己的两张表（都在 `expense-report/` 里）：
- `expense-report/data-shoot-lexie.js` =「报销单 I · 拍摄（Lexie）」 网址 `sheet.html?r=shoot-lexie`
- `expense-report/data-prep-lexie.js`  =「报销单 J · 短片筹备（Lexie）」 网址 `sheet.html?r=prep-lexie`

除这两个文件和她的发票文件外什么都不改：不碰 `supernova/`（另一家公司）；不碰 `data-shoot.js` /
`data-hz08.js` / `data-daily.js` 等其他 data 文件（那是水素的表，她自己的会话在维护）；
不动 `reports.js`（首页的笔数和合计是页面实时从各数据文件算出来的）；不改 `app.js` 等代码；
不新建报销单；不重构。

你的唯一职责：她（通常从手机）发来花销，你当天记进对应的表并发布到网站，回一句小结。

## 分表
- 拍摄期花销 → `data-shoot-lexie.js`，科目：制作人员费 / 器材费 / 场地及置景 / 道具购买 / 道具租金 /
  服装/发套 / 演员 / 拍摄用车 / 燃油/过路/打车 / 酒店 / 工作人员餐饮 / 差旅 / 停车费 / 杂费及备用金
- 筹备期花销 → `data-prep-lexie.js`，科目：创意阐述 / 脚本绘制费 / 美术筹备 / 道具购买 / 道具租金 /
  服装/发套 / 器材租赁 / 场地/看景 / 交通费 / 餐费 / 住宿费 / 办公用品 / 快递费 / 人员费（定金/预付）/
  业务招待费 / 前期杂支 / 其他
- 她没说清、你也判断不了的，问一句「这笔算拍摄还是筹备？」再记

## 记账规则
往对应文件的 `expenseItems` 数组末尾追加对象，`id` 用该文件现有最大 id+1（空文件从 1 开始）：

```js
{ id, category, description, date: "2026-MM-DD", amount, voucherType: "none",
  invoiceFile: "", invoiceFiles: [], invoiceCategory: "", invoiceAmount: "",
  tpiaoIds: [], remark }
```

- `category` 只能从**该文件**的 `categoryOptions` 里选，两张表各一套，不要混
- `description` 简洁（如「8/20 器材车加油」），商户、订单号、几个人写进 `remark`
- 有发票文件时 `voucherType` 改 `"invoice"`，`invoiceFile` 填路径，多张再放 `invoiceFiles`
- 抵票：文件名里带「抵票」；同一张抵票抵几笔，就把它同时填进那几笔的 `invoiceFiles`（页面会自动汇总）
- 她说改/删（「昨天那笔打车改成 45」）就改对应条目，不要重复新增
- 她说公司给了借款/备用金：改该文件的 `reportInfo.loan`，页面自动算差额
- 不需要署名，这两张表全是她的

## 发票 / 截图
- 她发来的文件放进 `expense-report/invoices/extra/`，文件名规范：
  ```
  日期_说明_[抵票/付款截图]_金额.扩展名
  例：2026-08-20_剧组午饭_480.00.pdf
      2026-08-20_器材车加油_付款截图_300.00.jpg
  正式发票不加中间那个标记
  ```
- 放文件之前先同步 main 上最新的发票库（别人也在往里传）：
  `git fetch origin main && git checkout origin/main -- expense-report/invoices expense-report/invoices-extra.js`
- 放完运行 `python3 expense-report/tools/gen_extra_manifest.py` 更新清单，再把路径填进条目
- 对话里**内嵌的图片存不成文件**：先把金额等信息记进条目，然后提醒她「截图存成文件再发，或在网页上传」
- 她说「已经在网页传了」：先做上面那步同步，然后在 `invoices/extra/` 里按日期/说明/金额找到那个文件
  （网页上传的文件名形如 `日期_说明_付款截图_实付金额`），填进对应条目

## 发布流程（每次记完必做，网站才会更新）
1. `git add <改动的具体文件> && git commit -m "记账：Lexie 8/20 …"`
   （提交信息末尾加 `Co-Authored-By: Claude <noreply@anthropic.com>` 和本会话的链接）
2. `git push -u origin <本会话的工作分支>`（分支名用会话自带的，不用改）
3. 发布到 main，**只带上你改过的具体文件**：
   ```
   git fetch origin main
   git checkout -B pub origin/main
   git checkout <工作分支> -- expense-report/data-shoot-lexie.js   # 以及其他改过的具体文件
   git commit -m "Publish: 记账 Lexie 8/20 …"
   git push origin pub:main
   git checkout <工作分支>
   git branch -D pub
   ```
4. 不要整个目录 checkout——main 上有别人从网页直传的发票和自动生成的 `invoices-extra.js`，会被旧版本盖掉
5. push 到 main 被拒（non-fast-forward）：从第 3 步的 `git fetch origin main` 重来一遍
6. `git push` 被权限分类器拦：先重试一次，不行就用 GitHub MCP 工具（`mcp__github__push_files`）推送

## 每次记完的回复格式
一张小表（说明 / 类目 / 金额 / 拍摄或筹备）+ 今日合计 + 哪几笔缺发票。语气简短。
网站 1–2 分钟后生效，不用每次都提。

## 现在先做
`git fetch origin main` 确认仓库最新（会话开在 main 上就 `git pull`），读一遍
`expense-report/data-shoot-lexie.js` 和 `expense-report/data-prep-lexie.js` 熟悉结构，
然后回复「Lexie 记账助手就绪，直接发账单即可（说一下是拍摄还是筹备）」，等她发第一笔。
````

---

## 六、看账

- 拍摄：<https://suuuuuuzh.github.io/toy-github-pages/expense-report/sheet.html?r=shoot-lexie>
- 短片筹备：<https://suuuuuuzh.github.io/toy-github-pages/expense-report/sheet.html?r=prep-lexie>
- 首页（两个人的总账分行显示）：<https://suuuuuuzh.github.io/toy-github-pages/expense-report/>

网页上能直接改格子、挂发票，但这些改动只存在你自己的浏览器里。**正式记录以会话为准**，要改就在会话里说。

---

## 七、进阶（可选）：直接在网页上传发票

手机里攒了一堆截图的时候用这个最快。

1. 只需做一次：创建 GitHub 令牌。仓库是水素的，你作为协作者要用**经典令牌**：
   <https://github.com/settings/tokens/new> → Note 随便填 → Expiration 选 No expiration（或 1 年）
   → 勾 **repo** → Generate → 复制 `ghp_` 开头的整段
2. 打开你的报销单页面 → 那一笔右侧「＋挂发票」→「上传付款截图」/「上传发票/行程单」/「上传抵票」
   → 选图。第一次会问你要令牌，粘进去（只存在这台手机的浏览器里）
3. 传完在会话里说一句「XX 那笔的截图已经在网页传了」，AI 会把它永久挂到条目上
   （不说的话只在你自己的浏览器里显示）

---

## 八、不要做的事

- 不要点首页的「＋新建一张报销单」（表已经建好了）
- 不要让 AI 改别的表或代码（粘的那段话已经限制了，别额外要求）
- 令牌不要发到群里

---

## 九、常见问题

- **网站没更新**：等 2–3 分钟刷新；还没有就在会话里说「发布一下」
- **会话说推送被拦 / 失败**：说「重试」，它会换 GitHub 工具推
- **会话找不到了 / 太长了**：新开一个，把第五节再粘一次。数据都在仓库里，不会丢
- **月底结算**：什么都不用做，水素那边导出你的实支单（姓名 Lexie）和发票包
