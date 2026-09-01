(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------ */
  /* Falling petals — ambient ash of rose petals drifting down the page */
  /* ------------------------------------------------------------------ */
  function initPetals(containerId, opts) {
    var field = document.getElementById(containerId);
    if (!field || prefersReducedMotion) return;

    var maxPetals = (opts && opts.max) || 14;
    var spawnMs = (opts && opts.spawnMs) || 900;
    var count = 0;

    function spawnPetal() {
      if (count >= maxPetals) return;
      count++;

      var petal = document.createElement("div");
      petal.className = "petal";

      var startX = Math.random() * 100;
      var drift = (Math.random() * 140 - 70).toFixed(0) + "px";
      var duration = (10 + Math.random() * 8).toFixed(2) + "s";
      var delay = (Math.random() * 0.6).toFixed(2) + "s";
      var scale = (0.6 + Math.random() * 0.8).toFixed(2);

      petal.style.left = startX + "%";
      petal.style.setProperty("--drift", drift);
      petal.style.animationDuration = duration;
      petal.style.animationDelay = delay;
      petal.style.transform = "scale(" + scale + ")";

      petal.addEventListener("animationend", function () {
        petal.remove();
        count--;
      });

      field.appendChild(petal);
    }

    for (var i = 0; i < Math.min(5, maxPetals); i++) {
      setTimeout(spawnPetal, i * 250);
    }

    setInterval(spawnPetal, spawnMs);
  }

  /* ------------------------------------------------------------------ */
  /* Cursor glow — soft rose light that follows the pointer              */
  /* ------------------------------------------------------------------ */
  function initCursorGlow() {
    var glow = document.getElementById("cursor-glow");
    if (!glow || !isFinePointer || prefersReducedMotion) return;

    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var curX = targetX;
    var curY = targetY;

    window.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function tick() {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      glow.style.left = curX + "px";
      glow.style.top = curY + "px";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /* Countdown — to 25 Sept, 6:00 PM (Singapore time, UTC+8)             */
  /* ------------------------------------------------------------------ */
  function initCountdown() {
    var wrap = document.getElementById("countdown");
    if (!wrap) return;

    var target = new Date("2026-09-25T18:00:00+08:00").getTime();
    var dayEl = wrap.querySelector('[data-unit="d"]');
    var hourEl = wrap.querySelector('[data-unit="h"]');
    var minEl = wrap.querySelector('[data-unit="m"]');

    function render() {
      var diff = target - Date.now();
      if (diff <= 0) {
        dayEl.textContent = "0";
        hourEl.textContent = "0";
        minEl.textContent = "0";
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      dayEl.textContent = d;
      hourEl.textContent = h;
      minEl.textContent = m;
    }

    render();
    setInterval(render, 30000);
  }

  /* ------------------------------------------------------------------ */
  /* Location card flip                                                  */
  /* ------------------------------------------------------------------ */
  function initLocationFlip() {
    var card = document.getElementById("locationCard");
    if (!card) return;

    function toggle() {
      var flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", flipped ? "true" : "false");
    }

    card.addEventListener("click", function (e) {
      if (e.target.closest("#mapLink")) return;
      toggle();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Candle — click to blow it out and reveal a wish                     */
  /* ------------------------------------------------------------------ */
  function initCandle() {
    var btn = document.getElementById("candleBtn");
    var note = document.getElementById("wishNote");
    var caption = document.getElementById("candleCaption");
    if (!btn) return;

    var blown = false;

    btn.addEventListener("click", function () {
      blown = !blown;
      btn.classList.toggle("blown", blown);

      if (blown) {
        caption.textContent = "wish made. relight?";
        if (note) note.classList.add("show");
        burst(btn.getBoundingClientRect());
      } else {
        caption.textContent = "click to blow it out";
        if (note) note.classList.remove("show");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* RSVP — a small confetti of petals + status line                     */
  /* ------------------------------------------------------------------ */
  function initRSVP() {
    var btn = document.getElementById("rsvpYes");
    var status = document.getElementById("rsvpStatus");
    if (!btn) return;

    btn.addEventListener("click", function () {
      status.classList.add("show");
      btn.textContent = "You're on the list";
      btn.disabled = true;
      btn.style.opacity = "0.6";
      btn.style.cursor = "default";
      burst(btn.getBoundingClientRect());
    });
  }

  /* ------------------------------------------------------------------ */
  /* Shared burst effect — a handful of petals thrown from a point       */
  /* ------------------------------------------------------------------ */
  function burst(rect) {
    var field = document.getElementById("burst-field");
    if (!field || prefersReducedMotion) return;

    var originX = rect.left + rect.width / 2;
    var originY = rect.top + rect.height / 2;

    for (var i = 0; i < 14; i++) {
      (function () {
        var p = document.createElement("div");
        p.className = "petal";
        p.style.left = originX + "px";
        p.style.top = originY + "px";
        p.style.animation = "none";
        p.style.opacity = "1";

        var angle = Math.random() * Math.PI * 2;
        var dist = 60 + Math.random() * 120;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist - 40;
        var rot = (Math.random() * 480 - 240).toFixed(0);

        field.appendChild(p);

        requestAnimationFrame(function () {
          p.style.transition = "transform 900ms cubic-bezier(.16,.84,.44,1), opacity 900ms ease";
          p.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + rot + "deg)";
          p.style.opacity = "0";
        });

        setTimeout(function () { p.remove(); }, 950);
      })();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var isSmallScreen = window.innerWidth <= 640;
    initPetals("petal-field", isSmallScreen ? { max: 7, spawnMs: 1500 } : { max: 12, spawnMs: 1100 });
    initCursorGlow();
    initCountdown();
    initLocationFlip();
    initCandle();
    initRSVP();
  });
})();