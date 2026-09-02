// 报销单登记表：只维护 slug / 标题 / 周期 / 页面 / 借款 / 归档。
// 笔数和合计由首页直接读各 data-*.js 实时算出，不用手工填，也就不会被记账会话覆写。
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
  "count": 48,
  "total": 11178.46,
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
 },
 {
  "slug": "prep",
  "title": "报销单 G · 短片筹备",
  "period": "筹备期",
  "page": "sheet.html?r=prep",
  "count": 0,
  "total": 0,
  "loan": 0,
  "archived": false
 },
 {
  "slug": "tiff",
  "title": "报销单 H · TIFF 多伦多电影节",
  "period": "TIFF",
  "page": "sheet.html?r=tiff",
  "count": 0,
  "total": 0,
  "loan": 0,
  "archived": false
 }
];
