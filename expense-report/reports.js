// 报销单登记表：首页卡片和合计从这里来。新建报销单会自动追加；count/total 在我固化数据时更新。
const reportRegistry = [
 {
  "slug": "kanjing",
  "title": "报销单 A · 堪景（贵州+山东）",
  "period": "2026年5月",
  "page": "kanjing.html",
  "count": 81,
  "total": 29703.8,
  "loan": 5000
 },
 {
  "slug": "shanghai",
  "title": "报销单 B · 上海+杭州",
  "period": "2026年6月",
  "page": "shanghai.html",
  "count": 70,
  "total": 23360.77,
  "loan": 0
 },
 {
  "slug": "daily",
  "title": "报销单 C · 日常",
  "period": "日常零散报销",
  "page": "sheet.html?r=daily",
  "count": 0,
  "total": 0,
  "loan": 0
 }
];
