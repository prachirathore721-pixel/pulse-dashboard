/* =========================================================
   Pulse Admin — Dashboard page (charts)
   Relies on window.Pulse from shell.js
   ========================================================= */
(function () {
  "use strict";

  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var revA = [28,34,30,42,38,52,48,61,55,68,72,80];
  var revB = [18,22,26,24,32,30,38,34,44,40,50,56];
  var revenueChart;

  function buildRevenue() {
    var ctx = document.getElementById("revenueChart").getContext("2d");
    var c = Pulse.colors();
    revenueChart = new Chart(ctx, {
      type: "line",
      data: { labels: months, datasets: [
        { label: "This year", data: revA, borderColor: c.violet, borderWidth: 3, tension: .4, fill: true, pointRadius: 0, pointHoverRadius: 6,
          pointHoverBackgroundColor: c.violet, pointHoverBorderColor: "#fff", pointHoverBorderWidth: 2,
          backgroundColor: function (x) { return x.chart.chartArea ? Pulse.makeGradient(ctx, x.chart.chartArea, "#7c5cff") : "transparent"; } },
        { label: "Last year", data: revB, borderColor: c.blue, borderWidth: 2, borderDash: [6,6], tension: .4, fill: false, pointRadius: 0, pointHoverRadius: 5 }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: false },
          tooltip: Object.assign(Pulse.tooltip(), { callbacks: { label: function (i) { return "  " + i.dataset.label + ": $" + i.formattedValue + "k"; } } })
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.text, font: { family: "Plus Jakarta Sans" } }, border: { display: false } },
          y: { grid: { color: c.grid, drawTicks: false }, ticks: { color: c.text, callback: function (v) { return "$" + v + "k"; }, font: { family: "Plus Jakarta Sans" } }, border: { display: false } }
        }
      }
    });
    Pulse.registerChart(revenueChart);
  }

  function buildTraffic() {
    var ctx = document.getElementById("trafficChart").getContext("2d");
    var ch = new Chart(ctx, {
      type: "doughnut",
      data: { labels: ["Direct","Social","Referral","Other"], datasets: [{ data: [38,26,22,14], backgroundColor: ["#7c5cff","#5b8cff","#22c55e","#f59e0b"], borderWidth: 0, hoverOffset: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "72%",
        plugins: { legend: { display: false }, tooltip: Object.assign(Pulse.tooltip(), { callbacks: { label: function (i) { return "  " + i.label + ": " + i.formattedValue + "%"; } } }) } }
    });
    Pulse.registerChart(ch);
  }

  // Segmented buttons re-roll the revenue line
  document.querySelectorAll(".seg").forEach(function (seg) {
    seg.querySelectorAll(".seg-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        seg.querySelectorAll(".seg-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        revA = revA.map(function () { return Math.round(25 + Math.random() * 60); });
        if (revenueChart) { revenueChart.data.datasets[0].data = revA; revenueChart.update(); }
      });
    });
  });

  window.addEventListener("load", function () { buildRevenue(); buildTraffic(); });
})();
