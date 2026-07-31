// 追加发票库（两份报销单共用）：用户分批上传的发票，先托管在这，页面里「＋挂发票」可选
const invoiceListExtra = [
 {
  "file": "invoices/extra/extra-001.pdf",
  "date": "2026-05-24",
  "merchant": "都匀港龙大酒店",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-002.pdf",
  "date": "2026-05-25",
  "merchant": "贵州黔邺超市有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-003.pdf",
  "date": "2026-05-25",
  "merchant": "贵州黔邺超市有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-004.pdf",
  "date": "2026-05-28",
  "merchant": "济南市章丘区燕归来燕窝馆（个体工商户）",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-005.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-006.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-007.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-008.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-009.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-010.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-011.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-012.pdf",
  "date": "2026-05-28",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-013.pdf",
  "date": "2026-05-30",
  "merchant": "云岩区乔治咖啡文昌店",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-014.pdf",
  "date": "2026-05-30",
  "merchant": "贵阳茶山上餐饮管理有限公司悦然时光分公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-015.pdf",
  "date": "2026-06-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-016.pdf",
  "date": "2026-06-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-017.pdf",
  "date": "2026-06-12",
  "merchant": "上海九皓祥餐饮有限公司",
  "amount": 391.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-018.pdf",
  "date": "2026-06-13",
  "merchant": "上海季阶餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-019.pdf",
  "date": "2026-06-14",
  "merchant": "上海欧恩亿餐饮管理有限公司",
  "amount": 141.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-020.pdf",
  "date": "2026-06-17",
  "merchant": "20260617_【华住酒店集团】全季上海延安路酒店发票已开具，感谢",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-021.pdf",
  "date": "2026-06-17",
  "merchant": "上海长庭酒店管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-022.pdf",
  "date": "2026-06-18",
  "merchant": "20260618_【华住酒店集团】全季上海延安路酒店发票已开具，感谢",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-023.pdf",
  "date": "2026-06-18",
  "merchant": "上海长庭酒店管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-024.pdf",
  "date": "2026-06-18",
  "merchant": "美团 贵阳市双龙航空港经济区莽拧餐饮店（个体工商户",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-025.pdf",
  "date": "2026-06-19",
  "merchant": "寄畅兴湖畔餐饮管理（杭州）有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-026.pdf",
  "date": "2026-06-22",
  "merchant": "20260622_【华住酒店集团】全季杭州西溪湿地花坞地铁站酒店发票",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-027.pdf",
  "date": "2026-06-22",
  "merchant": "20260622_【华住酒店集团】全季杭州西溪湿地花坞地铁站酒店发票",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-028.pdf",
  "date": "2026-06-22",
  "merchant": "杭州启安酒店管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-029.pdf",
  "date": "2026-06-22",
  "merchant": "杭州启安酒店管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-030.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 0.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-031.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 0.8,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-032.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 0.8,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-033.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-034.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-035.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-036.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.6,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-037.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.7,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-038.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.7,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-039.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.7,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-040.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 1.9,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-041.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 3.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-042.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 3.38,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-043.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 3.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-044.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 4.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-045.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 4.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-046.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 4.2,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-047.pdf",
  "date": "2026-06-24",
  "merchant": "上海三快智送科技有限公司",
  "amount": 9.4,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-048.pdf",
  "date": "2026-06-24",
  "merchant": "上海喜创于茶餐饮管理有限公司",
  "amount": 61.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-049.pdf",
  "date": "2026-06-24",
  "merchant": "北京卡波帕思塔餐饮管理有限责任公司",
  "amount": 244.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-050.pdf",
  "date": "2026-06-24",
  "merchant": "北京睿贝库餐饮服务有限公司",
  "amount": 76.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-051.pdf",
  "date": "2026-06-24",
  "merchant": "北京睿贝库餐饮服务有限公司",
  "amount": 141.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-052.pdf",
  "date": "2026-06-24",
  "merchant": "杭州合郡餐饮管理有限公司",
  "amount": 157.7,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-053.pdf",
  "date": "2026-06-24",
  "merchant": "杭州盈红餐饮管理有限公司",
  "amount": 46.18,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-054.png",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-055.png",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-056.png",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-057.pdf",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-058.pdf",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-059.pdf",
  "date": "2026-06-25",
  "merchant": "上海麓隐餐饮管理有限公司",
  "amount": 41.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-060.png",
  "date": "2026-06-25",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-061.pdf",
  "date": "2026-06-25",
  "merchant": "美团 杭州市滨江区贝果咖啡馆（个体工商户",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-062.pdf",
  "date": "2026-06-25",
  "merchant": "美团 杭州市滨江区贝果咖啡馆（个体工商户",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-063.png",
  "date": "2026-06-26",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-064.png",
  "date": "2026-06-26",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-065.pdf",
  "date": "2026-06-26",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-066.pdf",
  "date": "2026-07-01",
  "merchant": "上海三快智送科技有限公司",
  "amount": 26.9,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-067.pdf",
  "date": "2026-07-01",
  "merchant": "上海三快智送科技有限公司",
  "amount": 46.9,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-068.pdf",
  "date": "2026-07-01",
  "merchant": "上海市浦东新区陆家嘴街道板板扎扎餐饮店",
  "amount": 20.2,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-069.pdf",
  "date": "2026-07-01",
  "merchant": "上海市浦东新区陆家嘴街道板板扎扎餐饮店",
  "amount": 20.2,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-070.pdf",
  "date": "2026-07-01",
  "merchant": "上海市浦东新区陆家嘴街道板板扎扎餐饮店",
  "amount": 25.2,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-071.pdf",
  "date": "2026-07-01",
  "merchant": "丽水市莲都区姨妈饮品店",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-072.pdf",
  "date": "2026-07-01",
  "merchant": "北京奈雪餐饮管理有限公司",
  "amount": 19.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-073.pdf",
  "date": "2026-07-01",
  "merchant": "北京木维莫可餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-074.pdf",
  "date": "2026-07-01",
  "merchant": "北京灵感之茶餐饮管理有限公司",
  "amount": 17.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-075.pdf",
  "date": "2026-07-01",
  "merchant": "携程行程单-邱涛",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-076.pdf",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-077.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-078.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-079.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-080.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-081.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-082.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-083.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-084.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-085.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-086.pdf",
  "date": "2026-07-01",
  "merchant": "美团 北京滇野食集餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-087.pdf",
  "date": "2026-07-01",
  "merchant": "美团 皮氏咖啡（北京）有限公司",
  "amount": 26.1,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-088.pdf",
  "date": "2026-07-01",
  "merchant": "金牛区馨禧四宝牛杂面馆（个体工商户",
  "amount": 70.0,
  "kind": "抵票"
 },
 {
  "file": "invoices/extra/extra-089.pdf",
  "date": "2026-07-01",
  "merchant": "金牛区馨禧四宝牛杂面馆（个体工商户",
  "amount": 120.8,
  "kind": "抵票"
 },
 {
  "file": "invoices/extra/extra-090.pdf",
  "date": "2026-07-01",
  "merchant": "金牛区馨禧四宝牛杂面馆（个体工商户",
  "amount": 187.8,
  "kind": "抵票"
 },
 {
  "file": "invoices/extra/extra-091.pdf",
  "date": "2026-07-02",
  "merchant": "东部新区樊薯薯小吃店（个体工商户）",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-092.pdf",
  "date": "2026-07-02",
  "merchant": "东部新区樊薯薯小吃店（个体工商户）",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-093.pdf",
  "date": "2026-07-02",
  "merchant": "东部新区樊薯薯小吃店（个体工商户）",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-094.pdf",
  "date": "2026-07-02",
  "merchant": "北京云茶山水商贸有限公司",
  "amount": 166.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-095.pdf",
  "date": "2026-07-02",
  "merchant": "北京漪濛餐饮管理有限公司",
  "amount": 45.5,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-096.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-097.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-098.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-099.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-100.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-101.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-102.pdf",
  "date": "2026-07-02",
  "merchant": "美团 北京丽景蓝图科技开发有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-103.pdf",
  "date": "2026-07-02",
  "merchant": "美团 北京鑫和博创贸易有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-104.pdf",
  "date": "2026-07-02",
  "merchant": "美团 皮氏咖啡（北京）有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-105.pdf",
  "date": "2026-07-02",
  "merchant": "都匀市干平便利店",
  "amount": null,
  "kind": "抵票"
 },
 {
  "file": "invoices/extra/extra-106.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-107.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-108.pdf",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-109.pdf",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-110.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-111.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-112.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-113.pdf",
  "date": "2026-07-04",
  "merchant": "北京漫荟萃餐饮服务有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-114.pdf",
  "date": "2026-07-04",
  "merchant": "北京漫荟萃餐饮服务有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-115.pdf",
  "date": "2026-07-04",
  "merchant": "北京漫荟萃餐饮服务有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-116.pdf",
  "date": "2026-07-04",
  "merchant": "北京蓁果餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-117.png",
  "date": "2026-07-04",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-118.png",
  "date": "2026-07-04",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-119.png",
  "date": "2026-07-04",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-120.ofd",
  "date": "2026-07-05",
  "merchant": "北京酥麻引力餐饮管理有限公司",
  "amount": 67.6,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-121.pdf",
  "date": "2026-07-05",
  "merchant": "北京酥麻引力餐饮管理有限公司",
  "amount": 67.6,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-122.pdf",
  "date": "2026-07-06",
  "merchant": "263720000032_68894726.pdf",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-123.ofd",
  "date": "2026-07-06",
  "merchant": "北京庆春朴门餐饮有限公司",
  "amount": 227.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-124.pdf",
  "date": "2026-07-06",
  "merchant": "北京庆春朴门餐饮有限公司",
  "amount": 227.0,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-125.ofd",
  "date": "2026-07-06",
  "merchant": "北京星未望新天枢餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-126.pdf",
  "date": "2026-07-06",
  "merchant": "北京星未望新天枢餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-127.ofd",
  "date": "2026-07-06",
  "merchant": "北京艾恰餐饮服务有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-128.pdf",
  "date": "2026-07-06",
  "merchant": "北京艾恰餐饮服务有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-129.png",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-130.png",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-131.png",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-132.pdf",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-133.pdf",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-134.pdf",
  "date": "2026-07-06",
  "merchant": "美团 北京浓浓奶餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-135.png",
  "date": "2026-07-07",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-136.pdf",
  "date": "2026-07-07",
  "merchant": "美团",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/extra/extra-137.pdf",
  "date": "2026-07-08",
  "merchant": "北京三里屯在望餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 }
];
