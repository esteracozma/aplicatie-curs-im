(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var CAPS = window.CAPTAINS;
  var svg = document.getElementById("map");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function sv(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function proj(p) { return [(p[0] + 180) / 360 * 1000, (90 - p[1]) * 500 / 180]; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var done = {};          // id căpitan -> număr de stele
  var G = null;           // starea jocului curent
  var view = { x: 0, y: 40, w: 1000, h: 380 };
  var scalers = [];
  var layers = {};

  /* ---------- Cameră și scalare ---------- */
  function kNow() { var cw = svg.clientWidth || 600; return view.w / cw; }
  function applyView() {
    svg.setAttribute("viewBox", r2(view.x) + " " + r2(view.y) + " " + r2(view.w) + " " + r2(view.h));
    var k = kNow();
    scalers.forEach(function (f) { f(k); });
  }
  function scaled(f) { scalers.push(f); f(kNow()); }
  function tween(dur, fn, end) {
    if (reduce || dur <= 0) { fn(1); if (end) end(); return; }
    var t0 = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - t0) / dur);
      fn(t);
      if (t < 1) requestAnimationFrame(frame); else if (end) end();
    }
    requestAnimationFrame(frame);
  }
  function boundsView(pts) {
    var xs = [], ys = [];
    pts.forEach(function (p) { var q = proj(p); xs.push(q[0]); ys.push(q[1]); });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var A = (svg.clientWidth || 600) / (svg.clientHeight || 300);
    var w = Math.max((x1 - x0) * 1.5, 150), h = Math.max((y1 - y0) * 1.5, 80);
    if (w / h < A) w = h * A; else h = w / A;
    if (w > 1000) { w = 1000; h = w / A; }
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return { x: cx - w / 2, y: cy - h / 2, w: w, h: h };
  }
  function camTo(target, dur, end) {
    var a = { x: view.x, y: view.y, w: view.w, h: view.h };
    tween(dur, function (t) {
      var e = ease(t);
      view.x = a.x + (target.x - a.x) * e; view.y = a.y + (target.y - a.y) * e;
      view.w = a.w + (target.w - a.w) * e; view.h = a.h + (target.h - a.h) * e;
      applyView();
    }, end);
  }

  /* ---------- Desen ---------- */
  function smooth(pts) {
    var P = pts.map(proj);
    function f(p) { return r2(p[0]) + "," + r2(p[1]); }
    if (P.length < 3) return "M" + P.map(f).join("L");
    var d = "M" + f(P[0]);
    for (var i = 1; i < P.length - 1; i++) {
      var m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2];
      d += "Q" + f(P[i]) + " " + f(m);
    }
    return d + "L" + f(P[P.length - 1]);
  }
  function buildScene(cap) {
    svg.innerHTML = "";
    scalers = [];
    svg.appendChild(sv("path", { d: window.LAND_PATH, "class": "land" }));
    layers.lines = sv("g"); layers.marks = sv("g"); layers.ring = sv("g"); layers.ship = sv("g");
    [layers.lines, layers.marks, layers.ring, layers.ship].forEach(function (g) { svg.appendChild(g); });
    // navă
    var ship = sv("g", { id: "ship" });
    var c = sv("circle", { fill: "var(--card)", stroke: cap.color, style: "stroke-width:3px;vector-effect:non-scaling-stroke" });
    var t = sv("text", { "text-anchor": "middle", "dominant-baseline": "central" });
    t.textContent = "⛵";
    ship.appendChild(c); ship.appendChild(t);
    scaled(function (k) { c.setAttribute("r", 17 * k); t.setAttribute("font-size", 22 * k); });
    layers.ship.appendChild(ship);
    layers.shipEl = ship;
  }
  function setShip(ll) {
    var q = proj(ll);
    layers.shipEl.setAttribute("transform", "translate(" + r2(q[0]) + "," + r2(q[1]) + ")");
  }
  function addMark(cap, name, ll, strong) {
    var q = proj(ll);
    var g = sv("g", { "class": "mark", transform: "translate(" + r2(q[0]) + "," + r2(q[1]) + ")" });
    var c = sv("circle", { fill: cap.color, stroke: "var(--card)", style: "stroke-width:2px;vector-effect:non-scaling-stroke" });
    var t = sv("text", { "text-anchor": "middle" });
    t.textContent = name;
    g.appendChild(c); g.appendChild(t);
    scaled(function (k) {
      c.setAttribute("r", (strong ? 8 : 6) * k);
      t.setAttribute("font-size", 13 * k); t.setAttribute("y", -24 * k); t.style.strokeWidth = (4 * k) + "px"; t.style.display = k > 1.6 ? "none" : "";
    });
    layers.marks.appendChild(g);
  }
  function showRing(cap, step, onTap) {
    layers.ring.innerHTML = "";
    var q = proj(step.at);
    var g = sv("g", { id: "ring", transform: "translate(" + r2(q[0]) + "," + r2(q[1]) + ")", tabindex: "0", role: "button", "aria-label": "Navighează spre " + step.name });
    var fill = sv("circle", { "class": "ringfill", fill: cap.color });
    var line = sv("circle", { "class": "ringline", stroke: cap.color });
    var hit = sv("circle", { fill: "transparent" });
    var t = sv("text", { "text-anchor": "middle", style: "font-family:Georgia,serif;font-weight:700;fill:var(--ink);paint-order:stroke;stroke:var(--sea);stroke-linejoin:round" });
    t.textContent = step.name;
    [fill, line, hit, t].forEach(function (n) { g.appendChild(n); });
    scaled(function (k) {
      fill.setAttribute("r", 30 * k); line.setAttribute("r", 30 * k); hit.setAttribute("r", 52 * k);
      t.setAttribute("font-size", 13 * k); t.setAttribute("y", -38 * k); t.style.strokeWidth = (4 * k) + "px";
    });
    g.addEventListener("click", onTap);
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(); } });
    layers.ring.appendChild(g);
  }
  function clearRing() { layers.ring.innerHTML = ""; }

  /* ---------- Ecrane ---------- */
  function showChoose() {
    G = null;
    $("choose").hidden = false; $("game").hidden = true;
    $("back").hidden = true; $("pages").hidden = true;
    $("title").textContent = "Pe urmele marilor navigatori";
    var box = $("cards"); box.innerHTML = "";
    CAPS.forEach(function (cap) {
      var b = el("button", { type: "button", "class": "cap", style: "border-color:" + cap.color });
      b.appendChild(el("div", { "class": "band", style: "background:" + cap.color }));
      var body = el("div", { "class": "body" });
      if (done[cap.id]) body.appendChild(el("span", { "class": "stars", "aria-label": done[cap.id] + " stele din 3" }, "★".repeat(done[cap.id]) + "☆".repeat(3 - done[cap.id])));
      body.appendChild(el("h2", null, cap.name));
      body.appendChild(el("p", { "class": "tag" }, cap.tag));
      body.appendChild(el("p", { "class": "go" }, cap.goal));
      body.appendChild(el("span", { "class": "cta" }, done[cap.id] ? "Joacă din nou" : "Pornește"));
      b.appendChild(body);
      b.addEventListener("click", function () { startGame(cap); });
      box.appendChild(b);
    });
    $("ticket").hidden = Object.keys(done).length === 0;
    window.scrollTo(0, 0);
  }

  function startGame(cap) {
    G = { cap: cap, i: 0, pos: cap.start.at, got: [], askTotal: 0, askFirst: 0, orderTries: 0, busy: false };
    $("choose").hidden = true; $("game").hidden = false;
    $("back").hidden = false; $("pages").hidden = false;
    $("title").textContent = cap.name;
    updatePages();
    buildScene(cap);
    addMark(cap, cap.start.name, cap.start.at, true);
    setShip(cap.start.at);
    view = { x: 0, y: 40, w: 1000, h: 380 };
    applyView();
    window.scrollTo(0, 0);
    nav();
  }
  function updatePages() { $("pages").textContent = "📜 " + G.got.length + "/" + G.cap.steps.length; }

  function legsFor(step) {
    var prev = G.pos;
    if (step.wrap) return [[prev].concat(step.wrap.before), step.wrap.after.concat([step.at])];
    return [[prev].concat(step.via || [], [step.at])];
  }
  function allPts(legs) { return legs.reduce(function (a, l) { return a.concat(l); }, []); }
  function fitFor(step) {
    var legs = legsFor(step);
    if (legs.length > 1) return { x: 0, y: 40, w: 1000, h: 380 };
    var v = boundsView(allPts(legs));
    return v;
  }

  function prog(i) {
    var p = el("div", { "class": "prog", "aria-hidden": "true" });
    G.cap.steps.forEach(function (s, j) { p.appendChild(el("i", j < i ? { "class": "on" } : null)); });
    return p;
  }

  /* ---------- Navigare ---------- */
  function nav() {
    var cap = G.cap, step = cap.steps[G.i];
    var sh = $("sheet"); sh.innerHTML = "";
    sh.appendChild(prog(G.i));
    if (G.i === 0) {
      sh.appendChild(el("h2", null, cap.start.name));
      sh.appendChild(el("p", { "class": "date" }, cap.start.date));
      sh.appendChild(el("p", null, cap.start.text));
    }
    var p = el("p", { "class": "q" });
    p.appendChild(document.createTextNode("Pune prora spre "));
    p.appendChild(el("span", { style: "color:" + cap.color }, step.name));
    p.appendChild(document.createTextNode(". Atinge zona marcată pe hartă."));
    sh.appendChild(p);
    var row = el("div", { "class": "row" });
    var btn = el("button", { type: "button", "class": "primary" }, "⛵ Navighează");
    row.appendChild(btn); sh.appendChild(row);
    var go = function () { if (G.busy) return; G.busy = true; sail(step); };
    btn.addEventListener("click", go);
    camTo(fitFor(step), 700, function () { showRing(cap, step, go); });
  }

  function sail(step) {
    var cap = G.cap;
    clearRing();
    $("sheet").innerHTML = "";
    $("sheet").appendChild(el("p", { "class": "muted" }, "Navigăm…"));
    var legs = legsFor(step);
    var els = legs.map(function (pts, idx) {
      var dashed = step.dashed && !step.wrap;
      var p = sv("path", { d: smooth(pts), "class": "line" + (dashed ? " dashed" : ""), stroke: cap.color });
      layers.lines.appendChild(p);
      return { p: p, len: p.getTotalLength(), dashed: dashed };
    });
    var total = els.reduce(function (a, o) { return a + o.len; }, 0) || 1;
    els.forEach(function (o) { if (!o.dashed) { o.p.style.strokeDasharray = o.len; o.p.style.strokeDashoffset = o.len; } else o.p.style.opacity = 0; });
    var dur = Math.min(3600, Math.max(1800, total * 6));
    tween(dur, function (t) {
      var d = ease(t) * total, acc = 0;
      for (var i = 0; i < els.length; i++) {
        var o = els[i], local = Math.min(Math.max(d - acc, 0), o.len);
        if (!o.dashed) o.p.style.strokeDashoffset = o.len - local; else o.p.style.opacity = local / o.len;
        if (d <= acc + o.len || i === els.length - 1) {
          var pt = o.p.getPointAtLength(local);
          layers.shipEl.setAttribute("transform", "translate(" + r2(pt.x) + "," + r2(pt.y) + ")");
          break;
        }
        acc += o.len;
      }
    }, function () {
      G.pos = step.at;
      G.busy = false;
      setShip(step.at);
      arrive(step);
    });
  }

  /* ---------- Sosire: info + întrebare/decizie ---------- */
  function arrive(step) {
    var cap = G.cap;
    if (step.name !== cap.start.name || G.i < cap.steps.length - 1) addMark(cap, step.name, step.at, false);
    G.got.push(step);
    updatePages();
    var sh = $("sheet"); sh.innerHTML = "";
    sh.appendChild(prog(G.i + 1));
    sh.appendChild(el("h2", null, step.name));
    sh.appendChild(el("p", { "class": "date" }, step.date));
    sh.appendChild(el("p", null, step.text));
    sh.appendChild(el("p", { "class": "q" }, step.q));
    var opts = el("div", { "class": "opts", role: "group", "aria-label": "Variante" });
    var after = el("div");
    sh.appendChild(opts); sh.appendChild(after);
    var wrong = 0, answered = false;
    if (step.kind === "ask") G.askTotal++;
    step.opts.forEach(function (o) {
      var b = el("button", { type: "button" }, o.t);
      b.addEventListener("click", function () {
        if (answered) return;
        if (step.kind === "decide") {
          answered = true; b.classList.add("picked");
          Array.prototype.forEach.call(opts.children, function (x) { if (x !== b) x.disabled = true; });
          reveal(after, "Ce s-a întâmplat în realitate: ", o.n);
        } else if (o.ok) {
          answered = true; b.classList.add("ok");
          if (wrong === 0) G.askFirst++;
          Array.prototype.forEach.call(opts.children, function (x) { if (x !== b) x.disabled = true; });
          reveal(after, "Corect! ", o.n);
        } else {
          wrong++; b.classList.add("no"); b.disabled = true;
          after.innerHTML = "";
          after.appendChild(el("p", { "class": "muted" }, "Nu chiar. Încearcă din nou!"));
        }
      });
      opts.appendChild(b);
    });
  }
  function reveal(box, lead, text) {
    box.innerHTML = "";
    var n = el("div", { "class": "note" });
    n.appendChild(el("strong", null, lead));
    n.appendChild(document.createTextNode(text));
    box.appendChild(n);
    var last = G.i >= G.cap.steps.length - 1;
    var b = el("button", { type: "button", "class": "primary" }, last ? "Jurnalul de bord →" : "Mai departe →");
    b.addEventListener("click", function () { G.i++; if (last) order(); else nav(); });
    box.appendChild(b);
    b.focus({ preventScroll: true });
  }

  /* ---------- Jurnalul de bord: ordonare ---------- */
  function lab(st) { return st.name + ": " + st.page; }
  function order() {
    clearRing();
    camTo({ x: 0, y: 40, w: 1000, h: 380 }, 700);
    var steps = G.cap.steps, n = steps.length;
    var s = (n % 2 === 0) ? 3 : 2;
    var pool = [];
    for (var i = 0; i < n; i++) pool.push(steps[(i * s + 1) % n]);
    var placed = [], hint = false;
    var sh = $("sheet");
    function draw(checked) {
      sh.innerHTML = "";
      sh.appendChild(el("h2", null, "📜 Jurnalul de bord"));
      sh.appendChild(el("p", null, "Paginile s-au amestecat. Atinge-le în ordinea în care au avut loc evenimentele."));
      var ul = el("ol", { "class": "slots" });
      for (var i = 0; i < n; i++) {
        var li = el("li");
        li.appendChild(el("span", { "class": "n" }, String(i + 1)));
        var st = placed[i];
        if (st) {
          li.classList.add("filled");
          if (checked) li.classList.add(st.ord === i + 1 ? "ok" : "no");
          var b = el("button", { type: "button", "aria-label": "Scoate: " + lab(st) }, lab(st) + (hint ? " (" + st.date + ")" : "") + (checked ? (st.ord === i + 1 ? "  ✓" : "  ✗") : ""));
          (function (s2) { b.addEventListener("click", function () { placed = placed.filter(function (x) { return x !== s2; }); draw(false); }); })(st);
          li.appendChild(b);
        } else li.appendChild(el("span", { "class": "muted" }, "…"));
        ul.appendChild(li);
      }
      sh.appendChild(ul);
      var pl = el("div", { "class": "pool" });
      pool.forEach(function (st) {
        if (placed.indexOf(st) !== -1) return;
        var b = el("button", { type: "button" }, lab(st) + (hint ? " (" + st.date + ")" : ""));
        b.addEventListener("click", function () { placed.push(st); draw(false); });
        pl.appendChild(b);
      });
      sh.appendChild(pl);
      var row = el("div", { "class": "row" });
      var chk = el("button", { type: "button", "class": "primary" }, "Verifică");
      chk.disabled = placed.length < n;
      chk.addEventListener("click", function () {
        G.orderTries++;
        var ok = placed.every(function (st, i) { return st.ord === i + 1; });
        if (ok) finish(); else { draw(true); sh.appendChild(el("p", { "class": "muted" }, "Unele pagini nu sunt la locul lor. Scoate paginile marcate cu ✗ și încearcă din nou.")); }
      });
      var hb = el("button", { type: "button" }, hint ? "Ascunde datele" : "💡 Arată datele");
      hb.addEventListener("click", function () { hint = !hint; draw(false); });
      row.appendChild(chk); row.appendChild(hb); sh.appendChild(row);
    }
    draw(false);
    sh.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }

  /* ---------- Final ---------- */
  function finish() {
    var cap = G.cap;
    var stars = 1 + (G.askTotal && G.askFirst / G.askTotal >= 0.75 ? 1 : 0) + (G.orderTries === 1 ? 1 : 0);
    done[cap.id] = Math.max(done[cap.id] || 0, stars);
    var sh = $("sheet"); sh.innerHTML = "";
    sh.appendChild(el("p", { "class": "big", "aria-label": stars + " stele din 3" }, "★".repeat(stars) + "☆".repeat(3 - stars)));
    sh.appendChild(el("h2", { style: "text-align:center" }, "Expediție încheiată!"));
    sh.appendChild(el("p", { "class": "muted", style: "text-align:center" }, "Răspunsuri corecte din prima: " + G.askFirst + " din " + G.askTotal + " · Ordonare: " + (G.orderTries === 1 ? "din prima încercare" : G.orderTries + " încercări")));
    var ol = el("ol", { "class": "log" });
    cap.steps.slice().sort(function (a, b) { return a.ord - b.ord; }).forEach(function (s) {
      var li = el("li"); li.appendChild(el("strong", null, s.date + " – ")); li.appendChild(document.createTextNode(lab(s))); ol.appendChild(li);
    });
    sh.appendChild(ol);
    var row = el("div", { "class": "row" });
    var other = el("button", { type: "button", "class": "primary" }, "Alt căpitan");
    other.addEventListener("click", showChoose);
    var again = el("button", { type: "button" }, "Joacă din nou");
    again.addEventListener("click", function () { startGame(cap); });
    row.appendChild(other); row.appendChild(again); sh.appendChild(row);
  }

  /* ---------- Pornire ---------- */
  $("back").addEventListener("click", showChoose);
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (G && !$("game").hidden) applyView(); }, 150);
  });
  showChoose();
})();
