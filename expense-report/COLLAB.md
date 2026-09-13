# 两个人一起记账（方案已更新）

原来的方案（两人共用 `data-hz08.js`、备注里 `[署名]`）已停用，改成**每人自己的表、各自的 AI 会话**，
两个会话永远不写同一个文件：

- 水素：堪景 `data-hz08.js` / 拍摄 `data-shoot.js` / 日常 `data-daily.js` 等，她自己的会话维护
- Lexie：拍摄 `data-shoot-lexie.js` / 短片筹备 `data-prep-lexie.js`，她自己的会话维护

完整流程（水素要做的、Lexie 要做的、粘给 AI 的话）见 [`Lexie记账-上手说明.md`](./Lexie记账-上手说明.md)。

首页的笔数、合计、每个人的预支/实花/差额都由页面实时从各数据文件算出，`reports.js` 谁都不用改。
`data-hz08.js` 里已有的 `[水素]` 署名备注保留即可。
