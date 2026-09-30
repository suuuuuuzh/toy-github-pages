# 工作日志 · 每日记录 + 双周汇报

网址：https://suuuuuuzh.github.io/toy-github-pages/worklog/

- **按天**：选一天，看当天的「计划」（当天要做的待办）和「工作总结」（按分类编号列出），
  今天还会列出其他没完成的待办
- **声音后期 / 制片 / 留学**：每项工作一个标签，上面是该工作的待办，下面是记录，可切换「按天 / 按项目」
- **待办**：我的待办 + 交给秘书的事，过期会标红
- **双周汇报**：只汇报**制片**（由 `data.js` 里的 `reportCats` 控制）。选好周期（默认最近两周），
  自动按项目整理成文字，末尾附「下两周计划」（我的制片待办），点「复制汇报」直接粘给公司

所有数据都在 `worklog/data.js`，页面不用改。

## 每天怎么记（在 Claude 会话里）

直接把当天做的事发给 Claude，像这样：

> 0929
> 1. WTRSO 演员细节确认完了
> 2. 和龚老师开会，定了留学 video 剪辑方向
> 后面要做：下周五前把 Kate 的 shotlist 写好
> 让秘书：订 10/5 的会议室

## 给 Claude 的记账规则

- 只改 `worklog/data.js`，只追加，不删改历史记录。
- `logs` 每件事一行：`{ date: "YYYY-MM-DD", cat, project, status, text }`
  - `cat`：`sound` 声音后期 / `prod` 制片 / `study` 留学。分不清就问，不要猜。
  - `project`：沿用已有的项目名（WTRSO、Allan creative video、Kate creative video、Kimi、廿一、色珍、留学 video 剪辑…），新项目取简短名字。
  - `status`：`done` 已完成 / `ongoing` 进行中。
  - `text`：一句话，写成能直接放进汇报的书面语。
- `todos`：`{ id, cat, project, owner, status, created, due, text, note }`
  - `owner`：`"我"` 或 `"秘书"`；`status`：`open` / `waiting`（等某个条件，写在 `note`）/ `done`。
  - id 用现有最大 id + 1。
  - 想让待办出现在某天的「计划」里：填 `plan: "YYYY-MM-DD"`（没有 plan 就按 `due` 那天显示），具体时间段写进 `note`。
  - 用户说某个待办完成了：把它改成 `status: "done"` 并加 `doneDate`，同时在 `logs` 里记一行当天完成的工作。
  - 「未来两周要完成」这类说法，`due` 填记录日期 + 14 天。
- 记完回复一张小表（分类 / 项目 / 内容），再列出新增的待办和交给秘书的事。
