/* =========================================================
   Pulse Admin — shared shell (sidebar + topbar + chrome logic)
   Rendered on every page so the navigation stays identical and
   works straight from the file system (no fetch / server needed).
   ========================================================= */
(function () {
  "use strict";

  var html = document.documentElement;
  var THEME_KEY = "pulse-theme";
  var COLLAPSE_KEY = "pulse-collapsed";

  /* ---------- Navigation model ---------- */
  var NAV = [
    { group: "Manage", items: [
      { id: "dashboard", href: "index.html",     icon: "bi-grid-1x2-fill",         label: "Dashboard" },
      { id: "orders",    href: "orders.html",     icon: "bi-bag-check-fill",         label: "Orders", badge: "12" },
      { id: "products",  href: "products.html",   icon: "bi-box-seam-fill",          label: "Products" },
      { id: "customers", href: "customers.html",  icon: "bi-people-fill",            label: "Customers" },
      { id: "analytics", href: "analytics.html",  icon: "bi-bar-chart-fill",         label: "Analytics" }
    ]},
    { group: "System", items: [
      { id: "reports",   href: "reports.html",    icon: "bi-file-earmark-text-fill", label: "Reports" },
      { id: "roles",     href: "roles.html",      icon: "bi-shield-lock-fill",       label: "Roles & Access" },
      { id: "settings",  href: "settings.html",   icon: "bi-gear-fill",              label: "Settings" },
      { id: "help",      href: "help.html",       icon: "bi-question-circle-fill",   label: "Help" }
    ]}
  ];

  var page  = document.body.dataset.page || "dashboard";
  var title = document.body.dataset.title || "Dashboard";
  var sub   = document.body.dataset.subtitle || "";

  /* ---------- Markup builders ---------- */
  function sidebarHTML(active) {
    var groups = NAV.map(function (g) {
      var items = g.items.map(function (it) {
        return '<a href="' + it.href + '" class="nav-item' + (it.id === active ? " active" : "") +
          '" title="' + it.label + '"><i class="bi ' + it.icon + '"></i><span>' + it.label + "</span>" +
          (it.badge ? '<span class="nav-badge">' + it.badge + "</span>" : "") + "</a>";
      }).join("");
      return '<p class="nav-label">' + g.group + "</p>" + items;
    }).join("");

    return '' +
      '<div class="sidebar-brand">' +
        '<span class="brand-logo"><i class="bi bi-activity"></i></span>' +
        '<span class="brand-name">Pulse<small>Admin Panel</small></span>' +
      '</div>' +
      '<nav class="sidebar-nav">' + groups + '</nav>' +
      '<a href="billing.html" class="sidebar-upgrade" style="text-decoration:none;color:#fff">' +
        '<i class="bi bi-rocket-takeoff-fill"></i>' +
        '<h6>Go Pro</h6>' +
        '<p>Unlock advanced reports &amp; export.</p>' +
        '<span class="btn btn-sm btn-light w-100 fw-semibold d-block">Upgrade</span>' +
      '</a>';
  }

  function topbarHTML(t, s) {
    return '' +
      '<div class="d-flex align-items-center gap-3">' +
        '<button class="icon-btn" id="menuToggle" aria-label="Toggle menu"><i class="bi bi-list"></i></button>' +
        '<div><h1 class="page-title">' + t + '</h1><p class="page-sub">' + s + '</p></div>' +
      '</div>' +
      '<div class="topbar-actions">' +
        '<form class="search-box d-none d-lg-flex" id="searchForm" onsubmit="return false">' +
          '<i class="bi bi-search"></i>' +
          '<input type="text" placeholder="Search anything..." aria-label="Search" />' +
          '<kbd>Ctrl K</kbd>' +
        '</form>' +

        '<div class="dropdown" id="notifWrap">' +
          '<button class="icon-btn" id="notifBtn" aria-label="Notifications" aria-haspopup="true" aria-expanded="false"><i class="bi bi-bell"></i><span class="dot"></span></button>' +
          '<div class="menu notif-menu" role="menu">' +
            '<div class="menu-head"><strong>Notifications</strong><button class="menu-link" id="markRead" type="button">Mark all read</button></div>' +
            '<div class="menu-list">' +
              '<a href="orders.html" class="notif unread" role="menuitem"><span class="n-ico ic-blue"><i class="bi bi-cart-check-fill"></i></span><div class="n-body"><p>New order <b>#1829</b> was placed</p><span>2 min ago</span></div></a>' +
              '<a href="customers.html" class="notif unread" role="menuitem"><span class="n-ico ic-violet"><i class="bi bi-person-plus-fill"></i></span><div class="n-body"><p><b>Maya Khan</b> just signed up</p><span>18 min ago</span></div></a>' +
              '<a href="products.html" class="notif" role="menuitem"><span class="n-ico ic-amber"><i class="bi bi-exclamation-triangle-fill"></i></span><div class="n-body"><p>Low stock: <b>Headphones X</b></p><span>1 hr ago</span></div></a>' +
              '<a href="reports.html" class="notif" role="menuitem"><span class="n-ico ic-green"><i class="bi bi-star-fill"></i></span><div class="n-body"><p>New 5★ review received</p><span>3 hrs ago</span></div></a>' +
            '</div>' +
            '<a href="orders.html" class="menu-foot">View all notifications</a>' +
          '</div>' +
        '</div>' +

        '<button class="icon-btn" id="themeToggle" aria-label="Toggle theme"><i class="bi bi-moon-stars-fill"></i></button>' +

        '<div class="dropdown" id="profileWrap">' +
          '<button class="user-chip" id="profileBtn" aria-haspopup="true" aria-expanded="false">' +
            '<div class="avatar">AR</div>' +
            '<div class="user-meta d-none d-xl-block"><strong>Alex Rivera</strong><span>Administrator</span></div>' +
            '<i class="bi bi-chevron-down chev d-none d-xl-block"></i>' +
          '</button>' +
          '<div class="menu profile-menu" role="menu">' +
            '<div class="profile-banner">' +
              '<div class="pb-avatar"><div class="avatar lg">AR</div><span class="online"></span></div>' +
              '<div class="pb-info"><strong>Alex Rivera</strong><span>alex@pulse.app</span></div>' +
              '<span class="pb-badge"><i class="bi bi-patch-check-fill"></i> Pro</span>' +
            '</div>' +
            '<div class="profile-stats"><div><strong>1.8k</strong><span>Orders</span></div><div><strong>$48k</strong><span>Revenue</span></div><div><strong>9.5k</strong><span>Users</span></div></div>' +
            '<div class="menu-list profile-list">' +
              '<a href="profile.html" class="menu-item" role="menuitem"><span class="mi-ico ic-violet"><i class="bi bi-person-fill"></i></span>My Profile<i class="bi bi-chevron-right mi-arrow"></i></a>' +
              '<a href="settings.html" class="menu-item" role="menuitem"><span class="mi-ico ic-blue"><i class="bi bi-gear-fill"></i></span>Account Settings<i class="bi bi-chevron-right mi-arrow"></i></a>' +
              '<a href="billing.html" class="menu-item" role="menuitem"><span class="mi-ico ic-green"><i class="bi bi-credit-card-2-front-fill"></i></span>Billing<i class="bi bi-chevron-right mi-arrow"></i></a>' +
              '<a href="privacy.html" class="menu-item" role="menuitem"><span class="mi-ico ic-amber"><i class="bi bi-shield-fill-check"></i></span>Privacy<i class="bi bi-chevron-right mi-arrow"></i></a>' +
            '</div>' +
            '<div class="menu-divider"></div>' +
            '<div class="profile-list"><a href="login.html" class="menu-item logout" role="menuitem"><span class="mi-ico ic-red"><i class="bi bi-box-arrow-right"></i></span>Log out</a></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function footerHTML() {
    return '<footer class="foot"><span>Pulse Admin · Crafted with HTML, CSS &amp; Bootstrap</span>' +
      '<span>© 2026 · All systems normal <span class="live-dot"></span></span></footer>';
  }

  /* ---------- Inject chrome ---------- */
  var sidebar = document.getElementById("sidebar");
  var topbar  = document.getElementById("topbar");
  var overlay = document.getElementById("sidebarOverlay");
  var pageEl  = document.getElementById("page");

  if (sidebar) sidebar.innerHTML = sidebarHTML(page);
  if (topbar)  topbar.innerHTML  = topbarHTML(title, sub);
  if (pageEl)  pageEl.insertAdjacentHTML("beforeend", footerHTML());

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("themeToggle");
  var themeIcon = themeBtn ? themeBtn.querySelector("i") : null;
  function reflectThemeIcon() {
    if (themeIcon) themeIcon.className = html.getAttribute("data-bs-theme") === "dark" ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
  }
  reflectThemeIcon();
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-bs-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    reflectThemeIcon();
    Pulse.restyleCharts();
  });

  /* ---------- Sidebar collapse + mobile off-canvas ---------- */
  var menuBtn = document.getElementById("menuToggle");
  var mqDesktop = window.matchMedia("(min-width: 992px)");

  // Restore collapsed state (desktop only)
  try { if (localStorage.getItem(COLLAPSE_KEY) === "1" && mqDesktop.matches) html.classList.add("sidebar-collapsed"); } catch (e) {}

  function openSidebar()  { sidebar.classList.add("show"); overlay.classList.add("show"); }
  function closeSidebar() { sidebar.classList.remove("show"); overlay.classList.remove("show"); }
  function toggleCollapsed() {
    var collapsed = html.classList.toggle("sidebar-collapsed");
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0"); } catch (e) {}
    setTimeout(Pulse.resizeCharts, 300);
  }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    if (mqDesktop.matches) toggleCollapsed(); else openSidebar();
  });
  if (overlay) overlay.addEventListener("click", closeSidebar);
  mqDesktop.addEventListener("change", function (e) {
    if (e.matches) closeSidebar(); else html.classList.remove("sidebar-collapsed");
    setTimeout(Pulse.resizeCharts, 300);
  });
  sidebar && sidebar.querySelectorAll(".nav-item").forEach(function (a) {
    a.addEventListener("click", function () { if (!mqDesktop.matches) closeSidebar(); });
  });

  /* ---------- Keep content clear of the fixed topbar ---------- */
  function syncTopbar() {
    if (topbar) html.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
  }
  syncTopbar();
  window.addEventListener("resize", syncTopbar);
  window.addEventListener("load", syncTopbar);

  /* ---------- Dropdowns ---------- */
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".dropdown"));
  function closeDropdowns(except) {
    dropdowns.forEach(function (dd) {
      if (dd === except) return;
      dd.classList.remove("open");
      var b = dd.querySelector("button");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector("button");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !dd.classList.contains("open");
      closeDropdowns(dd);
      dd.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
    var menu = dd.querySelector(".menu");
    if (menu) {
      menu.addEventListener("click", function (e) { e.stopPropagation(); });
      menu.querySelectorAll(".menu-item, .notif, .menu-foot").forEach(function (link) {
        link.addEventListener("click", function () { closeDropdowns(); });
      });
    }
  });
  document.addEventListener("click", function () { closeDropdowns(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDropdowns(); });

  var markRead = document.getElementById("markRead");
  if (markRead) markRead.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".notif.unread").forEach(function (n) { n.classList.remove("unread"); });
    var dot = document.querySelector("#notifBtn .dot");
    if (dot) dot.style.display = "none";
  });

  // Log out -> clear the session flag, then the link navigates to login.html
  var logoutLink = document.querySelector(".menu-item.logout");
  if (logoutLink) logoutLink.addEventListener("click", function () {
    try { localStorage.removeItem("pulse-auth"); } catch (e) {}
  });

  /* ---------- Generic filter tabs (data-target selects rows w/ data-status) ---------- */
  document.querySelectorAll(".filter-tabs").forEach(function (tabs) {
    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      tabs.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.dataset.filter, target = tabs.dataset.target;
      if (!target) return;
      document.querySelectorAll(target + " [data-status]").forEach(function (row) {
        row.style.display = (!f || f === "all" || row.dataset.status === f) ? "" : "none";
      });
    });
  });

  /* ---------- Generic in-page search (data-search = row container selector) ---------- */
  document.querySelectorAll("[data-search]").forEach(function (inp) {
    inp.addEventListener("input", function () {
      var q = inp.value.toLowerCase(), rows = document.querySelectorAll(inp.dataset.search);
      rows.forEach(function (r) { r.style.display = r.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none"; });
    });
  });

  /* =========================================================
     Pulse helpers (shared by page scripts)
     ========================================================= */
  function cssVar(v) { return getComputedStyle(html).getPropertyValue(v).trim(); }

  window.Pulse = {
    charts: [],
    registerChart: function (ch) { this.charts.push(ch); return ch; },
    colors: function () { return { grid: cssVar("--border"), text: cssVar("--text-soft"), violet: "#7c5cff", blue: "#5b8cff", green: "#22c55e", amber: "#f59e0b", red: "#ef4444" }; },
    tooltip: function () { return { backgroundColor: "#151826", titleColor: "#fff", bodyColor: "#cbd0e0", padding: 12, cornerRadius: 10, borderColor: "#2a2e42", borderWidth: 1, usePointStyle: true }; },
    makeGradient: function (ctx, area, hex) {
      var g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
      g.addColorStop(0, hex + "66"); g.addColorStop(1, hex + "00"); return g;
    },
    resizeCharts: function () { (window.Pulse.charts || []).forEach(function (ch) { ch && ch.resize && ch.resize(); }); },
    restyleCharts: function () {
      var c = window.Pulse.colors();
      (window.Pulse.charts || []).forEach(function (ch) {
        if (!ch || !ch.options) return;
        if (ch.options.scales) {
          ["x", "y"].forEach(function (ax) {
            if (ch.options.scales[ax]) {
              if (ch.options.scales[ax].ticks) ch.options.scales[ax].ticks.color = c.text;
              if (ch.options.scales[ax].grid) ch.options.scales[ax].grid.color = c.grid;
            }
          });
        }
        if (ch.options.plugins && ch.options.plugins.legend && ch.options.plugins.legend.labels)
          ch.options.plugins.legend.labels.color = c.text;
        ch.update();
      });
    },
    animateCounters: function (root) {
      (root || document).querySelectorAll(".stat-value").forEach(function (el) {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        var target = parseFloat(el.dataset.count);
        if (isNaN(target)) return;
        var decimals = parseInt(el.dataset.decimals || "0", 10);
        var prefix = el.dataset.prefix || "", suffix = el.dataset.suffix || "";
        var dur = 1400, start = performance.now();
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var val = target * (1 - Math.pow(1 - p, 3));
          el.textContent = prefix + val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    },
    revealBars: function (root) {
      (root || document).querySelectorAll(".bar i").forEach(function (b) {
        var w = b.style.width; b.style.width = "0";
        requestAnimationFrame(function () { requestAnimationFrame(function () { b.style.width = w; }); });
      });
      var ring = document.getElementById("goalRing");
      if (ring) { var C = 327, pct = parseFloat(ring.dataset.pct || "0.82"); requestAnimationFrame(function () { requestAnimationFrame(function () { ring.style.strokeDashoffset = C * (1 - pct); }); }); }
    }
  };

  /* ---------- Auto-run entrance effects on every page ---------- */
  window.addEventListener("load", function () {
    Pulse.animateCounters();
    Pulse.revealBars();
  });
})();
