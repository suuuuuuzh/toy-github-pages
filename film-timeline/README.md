# 后期进度 · 时间轴 + 共享日历

一个纯静态网页,挂在 GitHub Pages 上。微信里点链接就能打开,手机上「添加到主屏幕」后当 App 用。

## 它能干什么

- **时间轴**:后期各阶段的进度(已完成 / 进行中 / 待开始),进行中的阶段带进度条,可挂最新 Cut 的链接。
- **日历**:月历视图,标出各阶段区间和关键日期。
- **进手机日历**:一键下载 `.ics` 导入;或用日历 App「订阅」`calendar.ics`,以后计划一变自动更新。

## 怎么更新(只改一个文件)

编辑 [`data.js`](./data.js) —— 里面有三块:项目信息、`stages`(阶段)、`events`(具体日期),都有注释。改完 push 就行。

`calendar.ics` **不用手动改**:GitHub Action 会在 `data.js` 变动后自动重建。
(本地想手动生成:`node film-timeline/build-ics.cjs`)

## 访问地址

启用 GitHub Pages 后:

```
https://<你的用户名>.github.io/toy-github-pages/film-timeline/
```

订阅日历地址(填进手机日历 App 的「添加订阅日历」):

```
https://<你的用户名>.github.io/toy-github-pages/film-timeline/calendar.ics
```

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `data.js` | **唯一要维护的文件**,所有进度和排期 |
| `index.html` / `style.css` / `app.js` | 页面本体 |
| `build-ics.cjs` | 从 data.js 生成 calendar.ics |
| `calendar.ics` | 自动生成,供订阅 |
