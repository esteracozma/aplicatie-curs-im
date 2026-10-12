(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var ROUTES = window.ROUTES, EVENTS = window.EVENTS, JOURNAL = window.JOURNAL, DILEMMAS = window.DILEMMAS;

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
  function announce(msg) { $("live").textContent = ""; setTimeout(function () { $("live").textContent = msg; }, 30); }
  function proj(p) { return [(p[0] + 180) / 360 * 1000, (90 - p[1]) * 500 / 180]; }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* ---------- Stare ---------- */
  var state = {
    visited: {},          // "routeId:index" -> true
    timeDone: false, timeBest: 0,
    jDone: false, jBest: 0,
    chosen: {},           // dilema -> opțiune
    selRoute: "toate", selStop: null
  };

  /* ---------- Navigare ---------- */
  var TABS = [
    { id: "p-map", label: "1. Harta" },
    { id: "p-time", label: "2. Axa timpului" },
    { id: "p-journal", label: "3. Jurnalul de bord" },
    { id: "p-captain", label: "4. Sunt căpitanul" },
    { id: "p-final", label: "Biletul de ieșire" }
  ];
  function totalStops() { return ROUTES.reduce(function (a, r) { return a + r.stops.length; }, 0); }
  function visitedCount() { return Object.keys(state.visited).length; }
  function mapDone() {
    return ROUTES.every(function (r) {
      return r.stops.some(function (s, i) { return state.visited[r.id + ":" + i]; });
    });
  }
  function isDone(id) {
    if (id === "p-map") return mapDone();
    if (id === "p-time") return state.timeDone;
    if (id === "p-journal") return state.jDone;
    if (id === "p-captain") return Object.keys(state.chosen).length === DILEMMAS.length;
    return false;
  }
  function renderTabs(active) {
    var nav = $("tabs");
    nav.innerHTML = "";
    TABS.forEach(function (t) {
      var b = el("button", { type: "button", "data-t": t.id }, t.label);
      if (t.id === active) b.setAttribute("aria-current", "true");
      if (isDone(t.id)) b.classList.add("done");
      b.addEventListener("click", function () { show(t.id); });
      nav.appendChild(b);
    });
  }
  var current = "p-map";
  function show(id) {
    current = id;
    Array.prototype.forEach.call(document.querySelectorAll("section.panel"), function (s) {
      s.classList.toggle("active", s.id === id);
    });
    if (id === "p-final") renderSummary();
    renderTabs(id);
    window.scrollTo(0, 0);
  }
  function refreshTabs() { renderTabs(current); }

  /* ---------- 1. Harta ---------- */
  var svg = $("map");
  var routeEls = {};   // id -> {g, paths[], stops[]}

  function smooth(pts) {
    var P = pts.map(proj);
    if (P.length < 3) return "M" + P.map(function (p) { return r1(p[0]) + "," + r1(p[1]); }).join("L");
    var d = "M" + r1(P[0][0]) + "," + r1(P[0][1]);
    for (var i = 1; i < P.length - 1; i++) {
      var mx = (P[i][0] + P[i + 1][0]) / 2, my = (P[i][1] + P[i + 1][1]) / 2;
      d += "Q" + r1(P[i][0]) + "," + r1(P[i][1]) + " " + r1(mx) + "," + r1(my);
    }
    d += "L" + r1(P[P.length - 1][0]) + "," + r1(P[P.length - 1][1]);
    return d;
  }

  function buildMap() {
    var land = sv("path", { d: window.LAND_PATH, "class": "land" });
    svg.appendChild(land);
    ROUTES.forEach(function (r) {
      var g = sv("g", { "data-route": r.id });
      var paths = r.legs.map(function (leg) {
        var p = sv("path", { d: smooth(leg.pts), "class": "route" + (leg.dashed ? " dashed" : ""), stroke: r.color });
        g.appendChild(p);
        return p;
      });
      var stops = r.stops.map(function (s, i) {
        var xy = proj(s.at);
        var gs = sv("g", { "class": "stop", tabindex: "0", role: "button", "aria-label": s.name + ", " + s.date });
        gs.appendChild(sv("circle", { "class": "hit", cx: r1(xy[0]), cy: r1(xy[1]), r: 14 }));
        gs.appendChild(sv("circle", { "class": "dot", cx: r1(xy[0]), cy: r1(xy[1]), r: 7, fill: r.color }));
        gs.appendChild(sv("circle", { "class": "inner", cx: r1(xy[0]), cy: r1(xy[1]), r: 2.6, fill: "none" }));
        gs.addEventListener("click", function () { selectStop(r.id, i); });
        gs.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectStop(r.id, i); }
        });
        g.appendChild(gs);
        return gs;
      });
      svg.appendChild(g);
      routeEls[r.id] = { g: g, paths: paths, stops: stops };
    });
    // eticheta oprirei selectate
    var lab = sv("text", { id: "stopLabel", "text-anchor": "middle", "class": "stop" });
    lab.style.pointerEvents = "none";
    svg.appendChild(lab);
  }

  function buildRouteButtons() {
    var box = $("routeBtns");
    var all = [{ id: "toate", label: "Toate" }].concat(ROUTES.map(function (r) { return { id: r.id, label: r.short + " (" + r.years + ")" }; }));
    box.innerHTML = "";
    all.forEach(function (o) {
      var b = el("button", { type: "button", "data-r": o.id, "aria-pressed": String(o.id === state.selRoute) }, o.label);
      b.addEventListener("click", function () { selectRoute(o.id); });
      box.appendChild(b);
    });
    var lg = $("legend");
    lg.innerHTML = "";
    ROUTES.forEach(function (r) { lg.appendChild(el("span", { "class": "l-" + r.id }, r.name)); });
    var dashed = el("span", { style: "color:var(--muted);font-weight:400" }, "linia punctată = întoarcere");
    lg.appendChild(dashed);
  }

  function selectRoute(id) {
    state.selRoute = id;
    state.selStop = null;
    Array.prototype.forEach.call($("routeBtns").children, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-r") === id));
    });
    ROUTES.forEach(function (r) {
      var on = id === "toate" || id === r.id;
      routeEls[r.id].g.classList.toggle("dim", !on);
      routeEls[r.id].stops.forEach(function (s) { s.setAttribute("tabindex", on ? "0" : "-1"); s.classList.remove("selected"); });
    });
    $("stopLabel").textContent = "";
    renderChips();
    animateRoutes();
    $("info").innerHTML = "";
    $("info").appendChild(el("p", { "class": "muted" }, id === "toate"
      ? "Apasă pe o oprire ca să afli mai multe."
      : (ROUTES.filter(function (r) { return r.id === id; })[0].summary)));
  }

  function renderChips() {
    var box = $("stopChips");
    box.innerHTML = "";
    ROUTES.forEach(function (r) {
      if (state.selRoute !== "toate" && state.selRoute !== r.id) return;
      r.stops.forEach(function (s, i) {
        var b = el("button", { type: "button" }, (state.selRoute === "toate" ? r.short + ": " : "") + s.name.split(" (")[0]);
        if (state.visited[r.id + ":" + i]) b.classList.add("visited");
        b.addEventListener("click", function () { selectStop(r.id, i); });
        box.appendChild(b);
      });
    });
  }

  function selectStop(rid, i) {
    var r = ROUTES.filter(function (x) { return x.id === rid; })[0];
    var s = r.stops[i];
    state.visited[rid + ":" + i] = true;
    state.selStop = rid + ":" + i;
    ROUTES.forEach(function (rr) {
      routeEls[rr.id].stops.forEach(function (g, j) {
        g.classList.toggle("visited", !!state.visited[rr.id + ":" + j]);
        g.classList.toggle("selected", rr.id === rid && j === i);
      });
    });
    var xy = proj(s.at);
    var lab = $("stopLabel");
    lab.textContent = s.name.split(" (")[0];
    var x = Math.min(900, Math.max(100, xy[0]));
    lab.setAttribute("x", r1(x));
    lab.setAttribute("y", r1(xy[1] - 14));
    var info = $("info");
    info.innerHTML = "";
    info.appendChild(el("h3", null, s.name));
    info.appendChild(el("p", { "class": "muted" }, r.name + " · " + s.date));
    info.appendChild(el("p", null, s.text));
    info.appendChild(el("p", { "class": "fact" }, "Știai că? " + s.fact));
    $("mapProgress").textContent = "Opriri explorate: " + visitedCount() + " din " + totalStops();
    renderChips();
    refreshTabs();
    announce(s.name + ". " + s.date);
  }

  function animateRoutes() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ROUTES.forEach(function (r) {
      var paths = routeEls[r.id].paths;
      var lens = paths.map(function (p) { return p.getTotalLength(); });
      var total = lens.reduce(function (a, b) { return a + b; }, 0) || 1;
      var delay = 0;
      paths.forEach(function (p, k) {
        var dashed = r.legs[k].dashed;
        p.style.transition = "none";
        if (reduce) { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; return; }
        if (dashed) {
          // linia punctată apare treptat prin opacitate
          p.style.opacity = "0";
          void p.getBoundingClientRect();
          p.style.transition = "opacity .6s ease " + delay + "s";
          p.style.opacity = "1";
          return;
        }
        p.style.strokeDasharray = lens[k];
        p.style.strokeDashoffset = lens[k];
        void p.getBoundingClientRect();
        var dur = Math.max(0.6, lens[k] / total * 4.5);
        p.style.transition = "stroke-dashoffset " + dur + "s ease-in-out " + delay + "s";
        p.style.strokeDashoffset = "0";
        delay += dur;
      });
    });
  }

  /* ---------- 2. Axa timpului ---------- */
  var tl = { order: [], years: false, items: [] };
  function shuffled(arr) {
    // amestec fix, determinist (același pentru toți elevii): 1522, 1488, 1519, 1492, 1521, 1498
    return [5, 0, 3, 1, 4, 2].map(function (i) { return arr[i]; });
  }
  function initTime() {
    tl.items = shuffled(EVENTS);
    tl.order = [];
    renderTime();
    $("timeMsg").hidden = true;
  }
  function renderTime() {
    var slots = $("slots"), pool = $("pool");
    slots.innerHTML = ""; pool.innerHTML = "";
    for (var i = 0; i < EVENTS.length; i++) {
      var li = el("li", { "class": "slot" });
      li.appendChild(el("span", { "class": "n" }, String(i + 1)));
      var ev = tl.order[i];
      if (ev) {
        li.classList.add("filled");
        var b = el("button", { type: "button", "aria-label": "Scoate evenimentul: " + ev.text }, ev.text + (tl.years ? " (" + ev.year + ")" : ""));
        b.style.border = "none"; b.style.background = "transparent"; b.style.textAlign = "left"; b.style.flex = "1";
        (function (e) { b.addEventListener("click", function () { removeEv(e); }); })(ev);
        li.appendChild(b);
        li.appendChild(el("span", { "class": "res", "data-res": i }));
      } else {
        li.appendChild(el("span", { "class": "muted" }, "Alege un eveniment de mai jos"));
      }
      slots.appendChild(li);
    }
    tl.items.forEach(function (ev) {
      if (tl.order.indexOf(ev) !== -1) return;
      var b = el("button", { type: "button" });
      if (tl.years) { var y = el("span", { "class": "y" }, ev.year + " · "); b.appendChild(y); }
      b.appendChild(document.createTextNode(ev.text));
      b.addEventListener("click", function () { addEv(ev); });
      pool.appendChild(b);
    });
  }
  function addEv(ev) { if (tl.order.indexOf(ev) === -1) { tl.order.push(ev); $("timeMsg").hidden = true; renderTime(); } }
  function removeEv(ev) { tl.order = tl.order.filter(function (e) { return e !== ev; }); $("timeMsg").hidden = true; renderTime(); }
  function checkTime() {
    var msg = $("timeMsg");
    msg.hidden = false;
    if (tl.order.length < EVENTS.length) {
      msg.textContent = "Mai ai de așezat " + (EVENTS.length - tl.order.length) + " evenimente. Apasă pe ele ca să le adaugi pe axă.";
      return;
    }
    var ok = 0;
    tl.order.forEach(function (ev, i) {
      var good = ev.year === EVENTS[i].year;
      if (good) ok++;
      var slot = $("slots").children[i];
      slot.classList.remove("right", "wrong");
      slot.classList.add(good ? "right" : "wrong");
      slot.querySelector(".res").textContent = good ? "✓ corect" : "✗ reia";
    });
    state.timeBest = Math.max(state.timeBest, ok);
    if (ok === EVENTS.length) {
      state.timeDone = true;
      msg.textContent = "Excelent! Toate evenimentele sunt în ordinea corectă: " + EVENTS.map(function (e) { return e.year; }).join(" → ") + ".";
    } else {
      msg.textContent = ok + " din " + EVENTS.length + " sunt la locul lor. Scoate evenimentele marcate cu ✗ și încearcă din nou. Te poate ajuta harta sau butonul „Arată anii”.";
    }
    refreshTabs();
    announce(msg.textContent);
  }

  /* ---------- 3. Jurnalul de bord ---------- */
  var jSelects = [], jShown = false;
  function buildJournal() {
    var box = $("journal");
    box.innerHTML = "";
    jSelects = [];
    JOURNAL.parts.forEach(function (p, idx) {
      if (typeof p === "string") { box.appendChild(document.createTextNode(p)); return; }
      var n = jSelects.length + 1;
      var sel = el("select", { "aria-label": "Spațiul " + n });
      sel.appendChild(el("option", { value: "" }, "— alege —"));
      JOURNAL.bank.forEach(function (w) { sel.appendChild(el("option", { value: w }, w)); });
      sel.dataset.answer = p.answer;
      sel.addEventListener("change", function () { sel.classList.remove("right", "wrong"); var m = sel.nextSibling; if (m && m.className && m.className.indexOf("mark") === 0) m.textContent = ""; });
      box.appendChild(sel);
      box.appendChild(el("span", { "class": "mark" }));
      jSelects.push(sel);
    });
  }
  function checkJournal() {
    var ok = 0, empty = 0;
    jSelects.forEach(function (s) {
      var mark = s.nextSibling;
      s.classList.remove("right", "wrong");
      if (!s.value) { empty++; mark.className = "mark"; mark.textContent = ""; return; }
      var good = s.value === s.dataset.answer;
      if (good) ok++;
      s.classList.add(good ? "right" : "wrong");
      mark.className = "mark " + (good ? "right" : "wrong");
      mark.textContent = good ? " ✓" : " ✗";
    });
    var msg = $("jMsg");
    msg.hidden = false;
    if (jShown) {
      msg.textContent = "Ai folosit răspunsurile afișate, așa că această verificare nu se punctează. Apasă „O iau de la capăt” ca să încerci singur.";
      announce(msg.textContent);
      return;
    }
    state.jBest = Math.max(state.jBest, ok);
    if (empty) msg.textContent = "Mai ai " + empty + " spații necompletate. Alege un cuvânt în fiecare listă.";
    else if (ok === jSelects.length) { state.jDone = true; msg.textContent = "Bravo! Jurnalul este complet și corect."; }
    else msg.textContent = ok + " din " + jSelects.length + " spații sunt corecte. Schimbă răspunsurile marcate cu ✗ și verifică din nou.";
    $("showJ").hidden = empty > 0 || ok === jSelects.length;
    refreshTabs();
    announce(msg.textContent);
  }
  function resetJournal() {
    jShown = false;
    buildJournal();
    $("jMsg").hidden = true;
    $("showJ").hidden = true;
  }
  function showJournal() {
    jShown = true;
    jSelects.forEach(function (s) { s.value = s.dataset.answer; s.classList.remove("wrong"); s.classList.add("right"); s.nextSibling.className = "mark right"; s.nextSibling.textContent = " ✓"; });
    $("jMsg").hidden = false;
    $("jMsg").textContent = "Acestea sunt răspunsurile corecte. Poți relua sarcina mai târziu, ca să verifici ce ai reținut.";
  }

  /* ---------- 4. Sunt căpitanul ---------- */
  function buildDilemmas() {
    var box = $("dilemmas");
    box.innerHTML = "";
    DILEMMAS.forEach(function (d, di) {
      var c = el("div", { "class": "card" });
      c.appendChild(el("h3", null, d.who));
      c.appendChild(el("p", null, d.q));
      var opts = el("div", { "class": "opts", role: "group", "aria-label": "Variante de răspuns" });
      var note = el("div", { "class": "note", hidden: "", "aria-live": "polite" });
      d.options.forEach(function (o, oi) {
        var b = el("button", { type: "button" }, o.t);
        b.addEventListener("click", function () {
          state.chosen[di] = oi;
          Array.prototype.forEach.call(opts.children, function (x, k) { x.classList.toggle("chosen", k === oi); });
          note.hidden = false;
          note.innerHTML = "";
          note.appendChild(el("strong", null, "Ce s-a întâmplat în realitate: "));
          note.appendChild(document.createTextNode(o.n));
          refreshTabs();
        });
        opts.appendChild(b);
      });
      c.appendChild(opts);
      c.appendChild(note);
      box.appendChild(c);
    });
  }

  /* ---------- Final ---------- */
  function renderSummary() {
    var s = $("summary");
    s.innerHTML = "";
    function tile(v, l) { var d = el("div"); d.appendChild(el("b", null, v)); d.appendChild(document.createTextNode(l)); s.appendChild(d); }
    tile(visitedCount() + "/" + totalStops(), "opriri explorate pe hartă");
    tile(state.timeBest + "/" + EVENTS.length, "evenimente la locul lor (axa timpului)");
    tile(state.jBest + "/" + jSelects.length, "spații corecte în jurnal");
    tile(Object.keys(state.chosen).length + "/" + DILEMMAS.length, "decizii luate ca și căpitan");
  }

  /* ---------- Pornire ---------- */
  function init() {
    $("rhyme").innerHTML = "";
    window.RHYME.forEach(function (l) { $("rhyme").appendChild(el("span", null, l)); });
    buildMap();
    buildRouteButtons();
    buildJournal();
    buildDilemmas();
    initTime();
    $("showYears").addEventListener("click", function () {
      tl.years = !tl.years;
      this.setAttribute("aria-pressed", String(tl.years));
      this.textContent = tl.years ? "Ascunde anii" : "Arată anii";
      renderTime();
    });
    $("checkTime").addEventListener("click", checkTime);
    $("resetTime").addEventListener("click", initTime);
    $("checkJ").addEventListener("click", checkJournal);
    $("showJ").addEventListener("click", showJournal);
    $("resetJ").addEventListener("click", resetJournal);
    $("replay").addEventListener("click", animateRoutes);
    $("mapProgress").textContent = "Opriri explorate: 0 din " + totalStops();
    renderTabs("p-map");
    selectRoute("toate");
  }
  init();
})();
