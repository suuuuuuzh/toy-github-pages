/* 渲染逻辑,不用改。数据全部来自 data.js */
(function () {
  const D = FILM_DATA;

  // ---- 小工具:把 "YYYY-MM-DD" 当本地日期解析,避免时区偏差 ----
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const today = (() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); })();
  const fmt = (s) => { const d = parse(s); return `${d.getMonth() + 1}月${d.getDate()}日`; };
  const STATUS_LABEL = { done: "已完成", active: "进行中", upcoming: "待开始" };

  // ---------- 头部 ----------
  document.getElementById("proj-title").textContent = D.project.title;
  document.getElementById("proj-subtitle").textContent = D.project.subtitle || "";
  document.title = D.project.title;
  if (D.project.updated)
    document.getElementById("proj-updated").textContent = "最后更新:" + fmt(D.project.updated);

  // ---------- 时间轴 ----------
  const tl = document.getElementById("timeline");
  D.stages.forEach((s) => {
    const node = document.createElement("div");
    node.className = "node " + s.status;

    let progressHtml = "";
    if (s.status === "active" && s.start && s.end) {
      const a = parse(s.start), b = parse(s.end);
      const pct = Math.max(4, Math.min(100, Math.round(((today - a) / (b - a)) * 100)));
      progressHtml = `<div class="node-progress"><i style="width:${pct}%"></i></div>`;
    }
    const cutHtml = s.cut && s.cut.url
      ? `<a class="node-cut" href="${s.cut.url}" target="_blank" rel="noopener">▶ 查看最新:${s.cut.label || "Cut"}</a>`
      : "";
    const noteHtml = s.note ? `<div class="node-note">${s.note}</div>` : "";
    const ownerHtml = s.owner ? `<div class="node-owner">负责:${s.owner}</div>` : "";

    node.innerHTML = `
      <span class="dot"></span>
      <div class="node-card">
        <div class="node-top">
          <span class="node-name">${s.name}</span>
          <span class="badge ${s.status}">${STATUS_LABEL[s.status] || ""}</span>
        </div>
        <div class="node-dates">${fmt(s.start)} → ${fmt(s.end)}</div>
        ${ownerHtml}${noteHtml}${progressHtml}${cutHtml}
      </div>`;
    tl.appendChild(node);
  });

  // ---------- 日历 ----------
  let curYear = today.getFullYear(), curMonth = today.getMonth();
  const calEl = document.getElementById("calendar");
  const calLabel = document.getElementById("cal-label");
  const calList = document.getElementById("cal-list");
  const DOW = ["日", "一", "二", "三", "四", "五", "六"];

  function inAnyStage(dateStr) {
    const d = parse(dateStr);
    return D.stages.some((s) => d >= parse(s.start) && d <= parse(s.end));
  }
  function eventsOn(dateStr) { return D.events.filter((e) => e.date === dateStr); }

  function renderCalendar() {
    calLabel.textContent = `${curYear}年${curMonth + 1}月`;
    calEl.innerHTML = "";
    DOW.forEach((w) => {
      const el = document.createElement("div");
      el.className = "cal-dow"; el.textContent = w; calEl.appendChild(el);
    });
    const first = new Date(curYear, curMonth, 1).getDay();
    const days = new Date(curYear, curMonth + 1, 0).getDate();
    for (let i = 0; i < first; i++) {
      const b = document.createElement("div"); b.className = "cal-cell blank"; calEl.appendChild(b);
    }
    for (let d = 1; d <= days; d++) {
      const ds = `${curYear}-${String(curMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const cell = document.createElement("div");
      cell.className = "cal-cell";
      if (inAnyStage(ds)) cell.classList.add("instage");
      if (curYear === today.getFullYear() && curMonth === today.getMonth() && d === today.getDate())
        cell.classList.add("today");
      const evs = eventsOn(ds);
      const dots = evs.map((e) => `<i class="dot-${e.type || "milestone"}"></i>`).join("");
      cell.innerHTML = `<span class="d">${d}</span><span class="dots">${dots}</span>`;
      calEl.appendChild(cell);
    }
    // 当月事件清单
    const monthEvents = D.events
      .filter((e) => { const d = parse(e.date); return d.getFullYear() === curYear && d.getMonth() === curMonth; })
      .sort((a, b) => a.date.localeCompare(b.date));
    calList.innerHTML = monthEvents.length
      ? monthEvents.map((e) => `
        <div class="cal-item ${e.type || "milestone"}">
          <span class="bar"></span>
          <div>
            <div class="when">${fmt(e.date)}${e.time ? " · " + e.time : ""}</div>
            <div class="what">${e.title}</div>
          </div>
        </div>`).join("")
      : `<div class="cal-empty">本月暂无标记的事件</div>`;
  }
  renderCalendar();
  document.getElementById("cal-prev").onclick = () => { if (--curMonth < 0) { curMonth = 11; curYear--; } renderCalendar(); };
  document.getElementById("cal-next").onclick = () => { if (++curMonth > 11) { curMonth = 0; curYear++; } renderCalendar(); };

  // ---------- 标签切换(支持 #calendar 直达链接) ----------
  function activate(v) {
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    document.getElementById("view-timeline").classList.toggle("hidden", v !== "timeline");
    document.getElementById("view-calendar").classList.toggle("hidden", v !== "calendar");
  }
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.onclick = () => { activate(btn.dataset.view); location.hash = btn.dataset.view; };
  });
  if (location.hash === "#calendar") activate("calendar");

  // ---------- 生成 ICS(手机日历) ----------
  function toICSDate(dateStr, time) {
    const d = parse(dateStr);
    if (time) {
      const [h, mi] = time.split(":").map(Number);
      const p = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(h)}${p(mi)}00`;
    }
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`; // 全天
  }
  function buildICS() {
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//film-timeline//CN",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      `X-WR-CALNAME:${D.project.title}`,
    ];
    let uid = 0;
    const push = (start, end, title) => {
      lines.push("BEGIN:VEVENT", `UID:film-${uid++}@timeline`);
      if (start.includes("T")) {
        lines.push(`DTSTART:${start}`);
        if (end) lines.push(`DTEND:${end}`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${start}`);
        if (end) lines.push(`DTEND;VALUE=DATE:${end}`);
      }
      lines.push(`SUMMARY:${title}`, "END:VEVENT");
    };
    // 阶段作为跨天全天事件(DTEND 要 +1 天)
    D.stages.forEach((s) => {
      const e = parse(s.end); e.setDate(e.getDate() + 1);
      const endStr = `${e.getFullYear()}${String(e.getMonth() + 1).padStart(2, "0")}${String(e.getDate()).padStart(2, "0")}`;
      push(toICSDate(s.start), endStr, `【${STATUS_LABEL[s.status] || ""}】${s.name}`);
    });
    // 具体事件
    D.events.forEach((ev) => push(toICSDate(ev.date, ev.time), "", ev.title));
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }
  document.getElementById("btn-ics").onclick = () => {
    const blob = new Blob([buildICS()], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "film-schedule.ics";
    document.body.appendChild(a); a.click(); a.remove();
  };
  // 显示可订阅地址(指向自动生成的静态 calendar.ics)
  document.getElementById("ics-url").textContent =
    location.origin + location.pathname.replace(/index\.html$/, "") + "calendar.ics";
})();
