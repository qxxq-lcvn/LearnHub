/* LearnHub — Phase 3: tsunami physics + animated SVG ocean cross-section */
window.LH = window.LH || {};

(function () {
  'use strict';

  var G = 9.81;

  /*
   * Physics (educational simplification):
   *  - speed: shallow-water wave equation v = sqrt(g * d)
   *  - arrival: t = distance / v
   *  - height: deep-water amplitude from magnitude, geometric spreading with distance,
   *    then shoaling to ~10 m depth via Green's law  H2 = H1 * (d1 / d2)^(1/4)
   */
  function compute(p) {
    var v = Math.sqrt(G * p.depth);
    var kmh = v * 3.6;
    var tSec = (p.dist * 1000) / v;
    var h0 = Math.pow(10, 0.5 * p.m - 4);
    var hs = (h0 / Math.sqrt(1 + p.dist / 200)) * Math.pow(p.depth / 10, 0.25);
    var level;
    if (p.m < 6.5) level = 'none';
    else if (hs < 0.3) level = 'low';
    else if (hs < 1) level = 'moderate';
    else if (hs < 3) level = 'high';
    else level = 'extreme';
    return { v: v, kmh: kmh, tSec: tSec, h0: h0, hs: hs, level: level };
  }

  // Scene geometry (SVG units)
  var W = 800, H = 320, SEA = 120, EPI = 60, SHELF = 520, SHORE = 690;

  function landY(x) {
    // land surface right of the shoreline: rises from sea level toward a small hill
    if (x <= SHORE) return SEA;
    if (x <= 745) return SEA - (x - SHORE) * (20 / 55);
    return 100 - (x - 745) * (8 / 55);
  }

  function mount(el, labels, onTick) {
    el.innerHTML =
      '<svg class="sim-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + labels.aria + '">' +
      '<defs>' +
      '<linearGradient id="simSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9f1"/><stop offset="1" stop-color="#eef6ef"/></linearGradient>' +
      '<linearGradient id="simWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb3c6"/><stop offset=".45" stop-color="#1f6f8b"/><stop offset="1" stop-color="#123f52"/></linearGradient>' +
      '<linearGradient id="simGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ad7a"/><stop offset="1" stop-color="#6b4a2f"/></linearGradient>' +
      '</defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#simSky)"/>' +
      '<circle cx="735" cy="42" r="20" fill="#f2b544"/><circle cx="735" cy="42" r="30" fill="#f2b544" opacity=".2"/>' +
      '<g fill="#fff" opacity=".85"><ellipse cx="170" cy="46" rx="34" ry="11"/><ellipse cx="195" cy="38" rx="22" ry="11"/><ellipse cx="470" cy="60" rx="28" ry="9"/><ellipse cx="490" cy="53" rx="18" ry="9"/></g>' +
      '<path class="s-water" fill="url(#simWater)"/>' +
      '<path class="s-ground" fill="url(#simGround)"/>' +
      '<path class="s-grass" fill="none" stroke="#6b9a47" stroke-width="6" stroke-linecap="round"/>' +
      '<g class="s-town">' +
        '<path d="M752 101 l6 -14 6 14z" fill="#2d5a3d"/><rect x="757" y="100" width="2" height="5" fill="#6b4a2f"/>' +
        '<rect x="712" y="98" width="16" height="12" fill="#fbf8ef" stroke="#6b4a2f" stroke-width="1.5"/><path d="M709 99 l11 -9 11 9z" fill="#c8643b"/>' +
        '<rect x="770" y="88" width="18" height="12" fill="#fbf8ef" stroke="#6b4a2f" stroke-width="1.5"/><path d="M767 89 l12 -9 12 9z" fill="#c8643b"/>' +
        '<path d="M793 92 l4 -11 4 11z" fill="#2d5a3d"/>' +
      '</g>' +
      '<path class="s-flood" fill="#3aa3b8" opacity=".75"/>' +
      '<g class="s-depth" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 4" opacity=".85"><line class="s-depth-line" x1="300" x2="300" y1="' + SEA + '"/></g>' +
      '<text class="s-depth-text" x="308" fill="#fff" font-size="13" font-weight="700"></text>' +
      '<g class="s-dist" stroke="#2d5a3d" stroke-width="1.5" fill="#2d5a3d">' +
        '<line x1="' + EPI + '" x2="' + SHORE + '" y1="22" y2="22"/><path d="M' + EPI + ' 22 l8 -5 v10z M' + SHORE + ' 22 l-8 -5 v10z" stroke="none"/>' +
      '</g>' +
      '<text class="s-dist-text" x="' + ((EPI + SHORE) / 2) + '" y="15" text-anchor="middle" fill="#1f4029" font-size="13" font-weight="700"></text>' +
      '<g class="s-rings" fill="none" stroke="#f2b544" stroke-width="2"></g>' +
      '<path class="s-epi" fill="#f2b544" stroke="#6b4a2f" stroke-width="1.5"/>' +
      '<text class="s-epi-text" x="' + EPI + '" text-anchor="middle" fill="#fbf8ef" font-size="12" font-weight="700">' + labels.epicenter + '</text>' +
      '<text x="' + SHORE + '" y="' + (SEA + 18) + '" text-anchor="middle" fill="#3a2a1c" font-size="12" font-weight="700">' + labels.coast + '</text>' +
      '<text x="10" y="' + (H - 8) + '" fill="#fbf8ef" font-size="11" opacity=".85">' + labels.notToScale + '</text>' +
      '</svg>';

    var q = function (s) { return el.querySelector(s); };
    var water = q('.s-water'), ground = q('.s-ground'), grass = q('.s-grass'), flood = q('.s-flood');
    var depthLine = q('.s-depth-line'), depthText = q('.s-depth-text'), distText = q('.s-dist-text');
    var epi = q('.s-epi'), epiText = q('.s-epi-text'), rings = q('.s-rings');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var params = null, res = null;
    var state = 'idle'; // idle | travel | runup | done
    var px = EPI, runT = 0, ringT = 0, clock = 0, last = 0, raf = 0;

    function deepPx() { return 30 + (Math.min(params.depth, 8000) / 8000) * 160; }
    function floorY(x) {
      var d = SEA + deepPx();
      if (x <= SHELF) return d;
      if (x >= SHORE) return SEA;
      return d + (SEA - d) * ((x - SHELF) / (SHORE - SHELF));
    }
    function ampDeep() { return 5 + Math.min(9, res.h0 * 4); }
    function ampShore() { return res.level === 'none' ? 5 : Math.min(62, 6 + res.hs * 7); }
    function runupPx() { return res.level === 'none' ? 2 : Math.min(40, 3 + res.hs * 5); }

    function waveAt(pos) {
      var f = pos <= SHELF ? 0 : Math.min(1, (pos - SHELF) / (SHORE - SHELF));
      return {
        a: ampDeep() + (ampShore() - ampDeep()) * Math.pow(f, 1.6),
        w: 55 - 30 * f
      };
    }

    function surfaceY(x, time) {
      var y = SEA - (reduce ? 0 : 1.3 * Math.sin(x / 18 + time * 1.6));
      if (state === 'travel') {
        var wv = waveAt(px);
        var k = (x - px) / wv.w;
        y -= wv.a * Math.exp(-k * k);
        // leading trough: the sea draws back before the crest arrives
        var k2 = (x - (px + wv.w * 1.3)) / (wv.w * 0.9);
        y += wv.a * 0.35 * Math.exp(-k2 * k2);
      } else if (state === 'runup' || state === 'done') {
        var hr = runupPx() * (state === 'done' ? 0.55 : 1 - runT * 0.45);
        var k3 = (x - SHORE) / 70;
        y -= hr * Math.exp(-k3 * k3);
      }
      return y;
    }

    function drawStatic() {
      var d = SEA + deepPx();
      ground.setAttribute('d',
        'M0 ' + d + ' L' + SHELF + ' ' + d + ' L' + SHORE + ' ' + SEA +
        ' L745 100 L800 92 L800 ' + H + ' L0 ' + H + 'Z');
      grass.setAttribute('d', 'M' + (SHORE - 2) + ' ' + SEA + ' L745 100 L800 92');
      depthLine.setAttribute('y2', d);
      depthText.setAttribute('y', (SEA + d) / 2 + 4);
      depthText.textContent = labels.fmtDepth(params.depth);
      distText.textContent = labels.fmtDist(params.dist);
      var ey = d;
      epi.setAttribute('d', starPath(EPI, ey - 2, 9, 4));
      epiText.setAttribute('y', Math.min(H - 22, ey + 22));
    }

    function starPath(cx, cy, r1, r2) {
      var s = '';
      for (var i = 0; i < 10; i++) {
        var r = i % 2 ? r2 : r1, ang = -Math.PI / 2 + (i * Math.PI) / 5;
        s += (i ? 'L' : 'M') + (cx + r * Math.cos(ang)).toFixed(1) + ' ' + (cy + r * Math.sin(ang)).toFixed(1);
      }
      return s + 'Z';
    }

    function drawDynamic(time) {
      var pts = [];
      for (var x = 0; x <= SHORE; x += 5) pts.push(x + ' ' + surfaceY(x, time).toFixed(2));
      var d = SEA + deepPx();
      water.setAttribute('d', 'M' + pts.join(' L') + ' L' + SHORE + ' ' + SEA + ' L' + SHELF + ' ' + d + ' L0 ' + d + 'Z');

      // run-up flooding over the land
      if (state === 'runup' || state === 'done') {
        var e = state === 'done' ? 1 : 1 - Math.pow(1 - runT, 3);
        var hr = runupPx();
        var reach = SHORE + Math.min(110, hr * 4.2) * e;
        var topStart = SEA - hr * (state === 'done' ? 0.55 : 1 - runT * 0.45);
        var fd = 'M' + (SHORE - 30) + ' ' + SEA + ' L' + (SHORE - 30) + ' ' + topStart.toFixed(1);
        var steps = 12;
        for (var i = 0; i <= steps; i++) {
          var xx = SHORE + ((reach - SHORE) * i) / steps;
          var top = topStart + (landY(reach) - topStart) * (i / steps);
          fd += ' L' + xx.toFixed(1) + ' ' + Math.min(top, landY(xx)).toFixed(1);
        }
        for (var j = steps; j >= 0; j--) {
          var xb = SHORE + ((reach - SHORE) * j) / steps;
          fd += ' L' + xb.toFixed(1) + ' ' + landY(xb).toFixed(1);
        }
        flood.setAttribute('d', fd + 'Z');
      } else {
        flood.setAttribute('d', '');
      }

      // shock rings at the epicentre
      if (ringT > 0) {
        var html = '', ey = SEA + deepPx();
        for (var r = 0; r < 3; r++) {
          var tt = (ringT + r * 0.33) % 1;
          html += '<circle cx="' + EPI + '" cy="' + ey + '" r="' + (6 + tt * 40).toFixed(1) + '" opacity="' + (1 - tt).toFixed(2) + '"/>';
        }
        rings.innerHTML = html;
      } else if (rings.innerHTML) {
        rings.innerHTML = '';
      }
    }

    function frame(now) {
      // real elapsed time (capped) so slow or throttled devices keep the same pace
      var dt = last ? Math.min(0.25, (now - last) / 1000) : 0;
      last = now;
      clock += dt;

      if (state === 'travel') {
        var local = floorY(px) - SEA;
        var ratio = Math.max(0.28, Math.sqrt(local / deepPx()));
        px += ((SHELF - EPI) / 2.6) * ratio * dt;
        ringT = ringT > 0 ? ringT + dt * 0.9 : 0;
        if (ringT > 2.2) ringT = 0;
        if (px >= SHORE) { px = SHORE; state = 'runup'; runT = 0; }
        onTick && onTick(((px - EPI) / (SHORE - EPI)) * res.tSec, state);
      } else if (state === 'runup') {
        runT += dt / 1.6;
        if (runT >= 1) { runT = 1; state = 'done'; onTick && onTick(res.tSec, 'done'); }
      }
      drawDynamic(clock);
      raf = requestAnimationFrame(frame);
    }

    function setParams(p, r) {
      params = p; res = r;
      if (state !== 'idle') { state = 'idle'; ringT = 0; onTick && onTick(0, 'idle'); }
      drawStatic();
      drawDynamic(clock);
    }

    function launch() {
      state = 'travel'; px = EPI; runT = 0; ringT = 0.001;
      onTick && onTick(0, 'travel');
    }

    raf = requestAnimationFrame(frame);

    return {
      setParams: setParams,
      launch: launch,
      destroy: function () { cancelAnimationFrame(raf); }
    };
  }

  LH.Sim = { compute: compute, mount: mount };
})();
