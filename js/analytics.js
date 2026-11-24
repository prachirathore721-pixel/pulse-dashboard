/* Pulse Admin — Analytics charts (relies on window.Pulse) */
(function () {
  "use strict";
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function visitors() {
    var ctx = document.getElementById("visitorsChart").getContext("2d");
    var c = Pulse.colors();
    Pulse.registerChart(new Chart(ctx, {
      type: "line",
      data: { labels: months, datasets: [{ label: "Visitors", data: [32,38,35,46,42,55,51,60,58,66,70,78], borderColor: c.blue, borderWidth: 3, tension: .4, fill: true, pointRadius: 0, pointHoverRadius: 6,
        backgroundColor: function (x) { return x.chart.chartArea ? Pulse.makeGradient(ctx, x.chart.chartArea, "#5b8cff") : "transparent"; } }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" },
        plugins: { legend: { display: false }, tooltip: Object.assign(Pulse.tooltip(), { callbacks: { label: function (i) { return "  " + i.formattedValue + "k visitors"; } } }) },
        scales: { x: { grid: { display: false }, ticks: { color: c.text }, border: { display: false } }, y: { grid: { color: c.grid }, ticks: { color: c.text, callback: function (v) { return v + "k"; } }, border: { display: false } } } }
    }));
  }

  function devices() {
    var ctx = document.getElementById("devicesChart").getContext("2d");
    Pulse.registerChart(new Chart(ctx, {
      type: "doughnut",
      data: { labels: ["Mobile","Desktop","Tablet"], datasets: [{ data: [63,28,9], backgroundColor: ["#7c5cff","#5b8cff","#22c55e"], borderWidth: 0, hoverOffset: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false }, tooltip: Object.assign(Pulse.tooltip(), { callbacks: { label: function (i) { return "  " + i.label + ": " + i.formattedValue + "%"; } } }) } }
    }));
  }

  function categories() {
    var ctx = document.getElementById("catChart").getContext("2d");
    var c = Pulse.colors();
    Pulse.registerChart(new Chart(ctx, {
      type: "bar",
      data: { labels: ["Audio","Wearables","Plans","Accessories","Other"], datasets: [{ data: [34,28,22,11,5], borderRadius: 8, maxBarThickness: 42,
        backgroundColor: function (x) {
          var a = x.chart.chartArea; if (!a) return "#7c5cff";
          var g = x.chart.ctx.createLinearGradient(0, a.bottom, 0, a.top);
          g.addColorStop(0, "#5b8cff"); g.addColorStop(1, "#7c5cff"); return g;
        } }] },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: Object.assign(Pulse.tooltip(), { callbacks: { label: function (i) { return "  " + i.formattedValue + "% of sales"; } } }) },
        scales: { x: { grid: { display: false }, ticks: { color: c.text }, border: { display: false } }, y: { grid: { color: c.grid }, ticks: { color: c.text, callback: function (v) { return v + "%"; } }, border: { display: false } } } }
    }));
  }

  window.addEventListener("load", function () { visitors(); devices(); categories(); });
})();
