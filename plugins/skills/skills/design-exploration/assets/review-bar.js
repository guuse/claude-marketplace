/*
 * Review bar for design mocks. It's a small fixed bar of switches that set data-* attributes
 * on <html>, so one mock can show several variants (palette, copy voice, heading style).
 * Each switch reads ?param= first, then localStorage, then its first value, and writes back
 * to both. This is review tooling only and must not ship to production.
 *
 * Usage: set window.REVIEW_BAR before loading this script, e.g.
 *   window.REVIEW_BAR = {
 *     id: "direction-a",                      // localStorage namespace
 *     groups: {
 *       option: { label: "Colour",   values: ["light", "night"] },   // → data-option
 *       voice:  { label: "Copy",     values: ["plain", "playful"] }, // → data-voice
 *       type:   { label: "Headings", values: ["serif", "sans"] }     // → data-type
 *     }
 *   };
 * Style variants in CSS with [data-option="night"] { … } etc. For copy variants, mark
 * elements with data-voice-plain / data-voice-playful and hide the inactive ones in CSS.
 */
(function () {
  "use strict";
  var cfg = window.REVIEW_BAR;
  if (!cfg || !cfg.groups) return;
  var html = document.documentElement;

  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&#]+)").exec(location.search);
    return m && decodeURIComponent(m[1]);
  }
  function key(name) { return (cfg.id || "review") + ":" + name; }
  function read(name, values) {
    var p = param(name);
    if (values.indexOf(p) > -1) return p;
    try { var s = localStorage.getItem(key(name)); if (values.indexOf(s) > -1) return s; } catch (e) {}
    return values[0];
  }
  function write(name, value) {
    html.setAttribute("data-" + name, value);
    try { localStorage.setItem(key(name), value); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set(name, value);
    history.replaceState(null, "", url);
  }

  var bar = document.createElement("div");
  bar.setAttribute("role", "toolbar");
  bar.setAttribute("aria-label", "Design review options");
  bar.style.cssText = "position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:9999;" +
    "display:flex;gap:12px;flex-wrap:wrap;padding:8px 12px;border-radius:10px;" +
    "background:rgba(20,20,24,.88);color:#fff;font:13px/1.2 system-ui,sans-serif;max-width:calc(100vw - 24px)";

  Object.keys(cfg.groups).forEach(function (name) {
    var g = cfg.groups[name];
    var current = read(name, g.values);
    write(name, current);
    var wrap = document.createElement("span");
    wrap.textContent = (g.label || name) + ": ";
    g.values.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = v;
      b.setAttribute("aria-pressed", String(v === current));
      b.style.cssText = "margin-left:4px;padding:4px 8px;border-radius:6px;border:1px solid #666;cursor:pointer;" +
        "background:" + (v === current ? "#fff" : "transparent") + ";color:" + (v === current ? "#111" : "#fff");
      b.addEventListener("click", function () {
        write(name, v);
        Array.prototype.forEach.call(wrap.querySelectorAll("button"), function (o) {
          var on = o === b;
          o.setAttribute("aria-pressed", String(on));
          o.style.background = on ? "#fff" : "transparent";
          o.style.color = on ? "#111" : "#fff";
        });
      });
      wrap.appendChild(b);
    });
    bar.appendChild(wrap);
  });

  if (document.body) document.body.appendChild(bar);
  else document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(bar); });
})();
