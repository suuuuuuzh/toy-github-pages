// 报销单登记表：首页卡片和合计从这里来。新建报销单会自动追加；count/total 在我固化数据时更新。
const reportRegistry = [
 {
  "slug": "default",
  "title": "报销单 · 日常运营",
  "period": "日常",
  "page": "sheet.html?r=default",
  "count": 0,
  "total": 0,
  "loan": 0,
  "archived": false
 },
 {
  "slug": "smspxlfac",
  "title": "报销单 · chelsea 西藏行程",
  "period": "",
  "page": "sheet.html?r=smspxlfac",
  "count": 0,
  "total": 0,
  "loan": 0,
  "archived": false
 }
];
