/*
  ============================================================
   这是唯一需要你手动维护的文件。改完 push,页面和日历都会更新。
  ============================================================

  只需要改下面三块:
    1) project —— 项目基本信息
    2) stages  —— 各个后期阶段(显示在时间轴上)
    3) events  —— 需要提醒的具体日期(显示在日历上、也会进手机日历)

  日期一律写成 "YYYY-MM-DD",时间写成 "HH:MM"(24 小时制,可省略)。
  status 只能填三种:done(已完成) / active(进行中) / upcoming(待开始)。
*/

const FILM_DATA = {
  project: {
    title: "《暂定片名》后期进度",
    subtitle: "剪辑 · 调色 · 混音 · 交付",
    // 每次更新进度,顺手改一下这个日期,页面上会显示“最后更新”
    updated: "2026-07-11",
  },

  // ===== 时间轴:后期的各个阶段 =====
  stages: [
    {
      name: "素材整理 / 套底",
      start: "2026-07-01",
      end: "2026-07-10",
      status: "done",
      owner: "剪辑助理 · 小林",
      note: "全部素材已归档、代理文件生成完成",
    },
    {
      name: "粗剪 (Rough Cut)",
      start: "2026-07-10",
      end: "2026-07-28",
      status: "active",
      owner: "剪辑 · 小李",
      note: "全片结构已通,正在打磨节奏",
      // 最新 Cut 的链接(网盘 / Vimeo / B站均可),没有就删掉这一行
      cut: { label: "粗剪 v3", url: "https://your-cloud-drive-link" },
    },
    {
      name: "精剪 (Fine Cut)",
      start: "2026-07-28",
      end: "2026-08-18",
      status: "upcoming",
      owner: "剪辑 · 小李 + 导演",
      note: "导演进组一起过",
    },
    {
      name: "调色 (Color Grading)",
      start: "2026-08-18",
      end: "2026-09-01",
      status: "upcoming",
      owner: "调色 · DIT 工作室",
      note: "",
    },
    {
      name: "声音 / 混音 (Sound Mix)",
      start: "2026-08-25",
      end: "2026-09-10",
      status: "upcoming",
      owner: "声音 · 后期声音团队",
      note: "与调色部分并行",
    },
    {
      name: "成片交付 (Delivery)",
      start: "2026-09-10",
      end: "2026-09-15",
      status: "upcoming",
      owner: "制片",
      note: "输出 DCP / 各版本母版",
    },
  ],

  // ===== 日历:需要大家记住的具体日期 =====
  // type 只影响颜色标记:milestone(里程碑) / meeting(会议) / delivery(交付)
  events: [
    { date: "2026-07-28", title: "粗剪交付,发大家审看", type: "delivery" },
    { date: "2026-08-02", time: "14:00", title: "导演 + 制片 审片会", type: "meeting" },
    { date: "2026-08-18", title: "精剪锁定 (Picture Lock)", type: "milestone" },
    { date: "2026-09-01", title: "调色终版", type: "milestone" },
    { date: "2026-09-15", title: "成片交付", type: "delivery" },
  ],
};

// —— 下面这行不用动,是为了让自动生成日历的脚本也能读到数据 ——
if (typeof module !== "undefined" && module.exports) module.exports = FILM_DATA;
