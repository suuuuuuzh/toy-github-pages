// 报销单登记表：首页卡片和合计从这里来。archived: true = 已结算，收进首页下方的折叠区，不计入总账。
const reportRegistry = [
 {
  "slug": "kanjing",
  "title": "报销单 A · 堪景（贵州+山东）",
  "period": "2026年5月",
  "page": "kanjing.html",
  "count": 81,
  "total": 29703.8,
  "loan": 5000,
  "archived": true
 },
 {
  "slug": "shanghai",
  "title": "报销单 B · 上海+杭州",
  "period": "2026年6月",
  "page": "shanghai.html",
  "count": 70,
  "total": 23360.77,
  "loan": 0,
  "archived": true
 },
 {
  "slug": "daily",
  "title": "报销单 C · 水素日常行程",
  "period": "日常行程",
  "page": "sheet.html?r=daily",
  "count": 0,
  "total": 0,
  "loan": 0,
  "archived": false
 },
 {
  "slug": "hz08",
  "title": "报销单 D · 堪景（杭州八月）",
  "period": "2026年8月",
  "page": "sheet.html?r=hz08",
  "count": 28,
  "total": 7573.29,
  "loan": 100000,
  "archived": false
 },
 {
  "slug": "yff",
  "title": "报销单 E · 青年电影周",
  "period": "青年电影周",
  "page": "sheet.html?r=yff",
  "count": 3,
  "total": 727.7,
  "loan": 0,
  "archived": false
 },
 {
  "slug": "shoot",
  "title": "报销单 F · 拍摄",
  "period": "拍摄期",
  "page": "sheet.html?r=shoot",
  "count": 0,
  "total": 0,
  "loan": 0,
  "archived": false
 }
];
