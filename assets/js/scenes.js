/* LearnHub — illustrated scenes for the "virtual tour" lessons.
 * Each scene is an 800×420 SVG drawing (no words, so it works in every language)
 * plus hotspot positions in viewBox units. Stop text lives in the lesson content. */
window.LH = window.LH || {};

(function () {
  'use strict';

  var defs =
    '<defs>' +
    '<linearGradient id="scSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9f1"/><stop offset="1" stop-color="#f1f5e6"/></linearGradient>' +
    '<linearGradient id="scSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb3c6"/><stop offset="1" stop-color="#1f6f8b"/></linearGradient>' +
    '<pattern id="scGrid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#b9ad8f" stroke-width="1"/></pattern>' +
    '</defs>';

  function pine(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-2" y="-4" width="4" height="14" fill="#6b4a2f"/><path d="M0 -34 L-12 -10 H12Z M0 -24 L-14 0 H14Z" fill="#2d5a3d"/></g>';
  }
  function person(x, y, c) {
    return '<g fill="' + (c || '#3a2a1c') + '"><circle cx="' + x + '" cy="' + (y - 11) + '" r="3.2"/><rect x="' + (x - 3) + '" y="' + (y - 8) + '" width="6" height="9" rx="2"/></g>';
  }

  /* Arahama Elementary School — exterior cross-section with the tsunami level */
  var arahamaA = '<svg viewBox="0 0 800 420" class="scene-svg" aria-hidden="true">' + defs +
    '<rect width="800" height="420" fill="url(#scSky)"/>' +
    '<circle cx="90" cy="60" r="26" fill="#f2b544" opacity=".9"/>' +
    // sea on the left
    '<path d="M0 300 Q40 292 80 300 T160 300 V420 H0Z" fill="url(#scSea)"/>' +
    '<rect x="150" y="296" width="18" height="16" fill="#9a9a8a"/>' +
    // ground
    '<path d="M150 312 H800 V420 H150Z" fill="#c9ad7a"/><path d="M150 312 H800" stroke="#6b9a47" stroke-width="5"/>' +
    // coastal pines
    pine(200, 300, 1) + pine(228, 302, .9) + pine(256, 300, 1.05) + pine(284, 303, .85) +
    // houses (before) as foundations
    '<g fill="#b39d74"><rect x="330" y="306" width="30" height="6"/><rect x="372" y="306" width="30" height="6"/><rect x="414" y="306" width="30" height="6"/></g>' +
    // distance arrow 700 m
    '<g stroke="#1f4029" stroke-width="2" fill="#1f4029"><line x1="165" y1="345" x2="520" y2="345"/><path d="M165 345l9-5v10zM520 345l-9-5v10z" stroke="none"/></g>' +
    '<rect x="306" y="332" width="74" height="24" rx="12" fill="#fbf8ef"/><text x="343" y="349" text-anchor="middle" font-size="14" font-weight="700" fill="#1f4029" font-family="Nunito, sans-serif">700 m</text>' +
    // school building (4 floors)
    '<g stroke="#6b4a2f" stroke-width="2">' +
      '<rect x="520" y="132" width="200" height="180" fill="#fbf8ef"/>' +
      '<line x1="520" y1="177" x2="720" y2="177"/><line x1="520" y1="222" x2="720" y2="222"/><line x1="520" y1="267" x2="720" y2="267"/>' +
      '<rect x="514" y="124" width="212" height="10" fill="#e4dcc6"/>' +
    '</g>' +
    '<g fill="#bfe0e7">' +
      [145, 190, 235, 280].map(function (y) {
        return [540, 580, 620, 660, 690].map(function (x) { return '<rect x="' + x + '" y="' + y + '" width="22" height="20" rx="2"/>'; }).join('');
      }).join('') +
    '</g>' +
    // broken ground floor windows
    '<g stroke="#6b4a2f" stroke-width="1.5"><path d="M540 280l22 20M580 300l22-20M620 282l20 16"/></g>' +
    // tsunami level up to the 2nd floor
    '<rect x="150" y="238" width="650" height="74" fill="#3aa3b8" opacity=".35"/>' +
    '<path d="M150 238 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#1f6f8b" stroke-width="3" stroke-dasharray="8 6"/>' +
    // floor numbers
    '<g font-family="Fredoka, sans-serif" font-size="15" font-weight="600" fill="#6b4a2f"><text x="730" y="298">1F</text><text x="730" y="253">2F</text><text x="730" y="208">3F</text><text x="730" y="163">4F</text></g>' +
    // people on the roof
    person(545, 124) + person(565, 124, '#c8643b') + person(585, 124) + person(605, 124, '#1f6f8b') + person(625, 124) + person(645, 124, '#c8643b') + person(665, 124) + person(690, 124, '#1f6f8b') +
    // helicopter
    '<g transform="translate(660 48)" fill="#4f5d52"><ellipse cx="0" cy="0" rx="26" ry="11"/><rect x="20" y="-3" width="42" height="5"/><rect x="58" y="-10" width="4" height="14"/><rect x="-40" y="-17" width="80" height="3"/><rect x="-2" y="-16" width="4" height="6"/><path d="M-14 11v6M14 11v6M-22 17h44" stroke="#4f5d52" stroke-width="2.5"/></g>' +
    '</svg>';

  /* Arahama — 4th-floor exhibition (left) and rooftop panorama (right) */
  var arahamaB = '<svg viewBox="0 0 800 420" class="scene-svg" aria-hidden="true">' + defs +
    '<rect width="800" height="420" fill="url(#scSky)"/>' +
    // exhibition room
    '<rect x="0" y="0" width="290" height="420" fill="#f4ecdb"/>' +
    '<rect x="0" y="330" width="290" height="90" fill="#d9c9a3"/>' +
    '<g fill="#fffdf7" stroke="#b9ad8f" stroke-width="2"><rect x="24" y="70" width="70" height="90"/><rect x="108" y="70" width="70" height="90"/><rect x="192" y="70" width="70" height="90"/></g>' +
    '<g fill="#bfe0e7"><rect x="32" y="80" width="54" height="36"/><rect x="116" y="80" width="54" height="36"/><rect x="200" y="80" width="54" height="36"/></g>' +
    '<g stroke="#b9ad8f" stroke-width="3"><path d="M34 128h50M34 138h40M118 128h50M118 138h36M202 128h50M202 138h44"/></g>' +
    '<rect x="40" y="190" width="120" height="80" rx="6" fill="#233326"/><rect x="48" y="198" width="104" height="64" fill="#3aa3b8" opacity=".8"/>' +
    '<path d="M92 216v28l22-14z" fill="#fff"/>' +
    '<rect x="180" y="250" width="90" height="60" fill="#c9ad7a"/><g fill="#8a6a45"><rect x="188" y="262" width="12" height="10"/><rect x="206" y="266" width="12" height="10"/><rect x="226" y="260" width="12" height="10"/><rect x="246" y="268" width="12" height="10"/></g>' +
    person(210, 330, '#1f6f8b') + person(236, 332, '#c8643b') +
    '<rect x="290" y="0" width="8" height="420" fill="#6b4a2f"/>' +
    // rooftop panorama
    '<path d="M298 150 H800 V190 H298Z" fill="url(#scSea)"/>' +
    '<rect x="298" y="186" width="502" height="8" fill="#9a9a8a"/>' +
    '<path d="M298 194 H800 V330 H298Z" fill="#cfe0a9"/>' +
    pine(360, 206, .7) + pine(420, 208, .6) + pine(560, 206, .7) + pine(650, 208, .55) + pine(720, 207, .65) +
    '<rect x="330" y="232" width="300" height="80" fill="url(#scGrid)" opacity=".9"/>' +
    '<path d="M640 330 L700 230 H800 V330Z" fill="#b39d74"/><path d="M700 230 H800" stroke="#6b4a2f" stroke-width="4"/>' +
    '<g fill="#4f5d52"><rect x="720" y="220" width="18" height="8" rx="2"/><rect x="760" y="220" width="18" height="8" rx="2"/></g>' +
    // roof parapet in the foreground
    '<rect x="298" y="330" width="502" height="90" fill="#e4dcc6"/><rect x="298" y="322" width="502" height="12" fill="#cfc4a6"/>' +
    person(420, 362) + person(446, 364, '#c8643b') + person(470, 362, '#1f6f8b') +
    '</svg>';

  /* Okawa Elementary School — site map (top-down) */
  var okawaA = '<svg viewBox="0 0 800 420" class="scene-svg" aria-hidden="true">' + defs +
    '<rect width="800" height="420" fill="#e9f0d8"/>' +
    // river along the top, flowing to the sea on the right
    '<path d="M0 40 C200 70 420 20 800 60 V150 C430 110 220 150 0 120Z" fill="url(#scSea)"/>' +
    // tsunami moving up the river
    '<g stroke="#fbf8ef" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"><path d="M720 80 l-30 12 30 12"/><path d="M640 76 l-30 12 30 12"/><path d="M560 78 l-30 12 30 12"/></g>' +
    '<g stroke="#1f4029" stroke-width="2" fill="#1f4029"><line x1="660" y1="22" x2="790" y2="22"/><path d="M790 22l-9-5v10z" stroke="none"/></g>' +
    '<rect x="664" y="8" width="84" height="26" rx="13" fill="#fbf8ef"/><text x="706" y="26" text-anchor="middle" font-size="14" font-weight="700" fill="#1f4029" font-family="Nunito, sans-serif">3.7 km</text>' +
    // levee road and bridge
    '<path d="M0 150 C220 160 430 132 800 160" stroke="#b39d74" stroke-width="16" fill="none"/>' +
    '<rect x="540" y="40" width="26" height="130" fill="#9a9a8a" transform="rotate(8 553 105)"/>' +
    // the "triangle" area at the bridge
    '<path d="M520 168 L585 168 L552 204Z" fill="#f2b544" opacity=".85"/>' +
    // back hill
    '<path d="M0 420 V300 C120 250 260 262 380 300 C470 330 520 360 560 420Z" fill="#8fb86a"/>' +
    '<g fill="none" stroke="#6b9a47" stroke-width="2"><path d="M40 420 C120 300 260 300 360 340"/><path d="M100 420 C160 340 250 340 320 370"/></g>' +
    pine(90, 320, .8) + pine(150, 300, .8) + pine(220, 300, .8) + pine(300, 320, .8) +
    // schoolyard and curved school building
    '<rect x="300" y="200" width="200" height="90" rx="10" fill="#e4d5b0"/>' +
    '<path d="M320 196 C360 170 440 170 480 196" stroke="#fbf8ef" stroke-width="26" fill="none"/>' +
    '<path d="M320 196 C360 170 440 170 480 196" stroke="#6b4a2f" stroke-width="2" fill="none"/>' +
    '<g>' + person(360, 250, '#1f6f8b') + person(376, 252, '#c8643b') + person(392, 250) + person(408, 252, '#1f6f8b') + person(424, 250, '#c8643b') + person(440, 252) + '</g>' +
    // the route taken (towards the bridge) and the route up the hill
    '<path d="M470 240 C510 220 530 205 548 190" stroke="#c8643b" stroke-width="4" stroke-dasharray="9 7" fill="none"/>' +
    '<path d="M380 290 C360 310 330 320 300 330" stroke="#2d5a3d" stroke-width="4" stroke-dasharray="3 7" stroke-linecap="round" fill="none"/>' +
    '</svg>';

  /* Okawa — memorial site today */
  var okawaB = '<svg viewBox="0 0 800 420" class="scene-svg" aria-hidden="true">' + defs +
    '<rect width="800" height="420" fill="url(#scSky)"/>' +
    '<path d="M0 230 C140 150 300 150 420 210 V420 H0Z" fill="#8fb86a"/>' +
    pine(60, 200, .9) + pine(130, 180, .9) + pine(200, 176, .9) + pine(270, 186, .9) +
    '<rect x="0" y="330" width="800" height="90" fill="#d9ccaa"/>' +
    // ruined curved school building
    '<path d="M250 330 V240 C330 210 450 210 530 240 V330Z" fill="#e4dcc6" stroke="#6b4a2f" stroke-width="2"/>' +
    '<g fill="#6f7a70">' + [270, 310, 350, 390, 430, 470, 505].map(function (x) { return '<rect x="' + x + '" y="262" width="22" height="26"/>'; }).join('') + '</g>' +
    '<path d="M300 300 l30 30M420 300 l-20 30M470 296 l26 34" stroke="#6b4a2f" stroke-width="2"/>' +
    // clock
    '<circle cx="390" cy="226" r="14" fill="#fbf8ef" stroke="#6b4a2f" stroke-width="2"/><path d="M390 226 L390 216 M390 226 L382 232" stroke="#233326" stroke-width="2" stroke-linecap="round"/>' +
    // outdoor stage with mural
    '<rect x="560" y="270" width="150" height="60" fill="#e4dcc6" stroke="#6b4a2f" stroke-width="2"/>' +
    '<rect x="572" y="280" width="126" height="40" fill="#bfe0e7"/><circle cx="600" cy="300" r="10" fill="#f2b544"/><path d="M620 316 l14-20 14 20z M650 316 l12-16 12 16z" fill="#6b9a47"/>' +
    // memorial monument and flowers
    '<rect x="140" y="300" width="36" height="46" fill="#9a9a8a"/><path d="M134 346 h48" stroke="#6b4a2f" stroke-width="4"/>' +
    '<g fill="#c8643b"><circle cx="146" cy="352" r="4"/><circle cx="158" cy="354" r="4"/><circle cx="170" cy="352" r="4"/></g>' +
    // memorial hall
    '<rect x="620" y="170" width="150" height="70" fill="#fbf8ef" stroke="#6b4a2f" stroke-width="2"/><path d="M612 172 L695 140 L778 172Z" fill="#2d5a3d"/><rect x="684" y="204" width="22" height="36" fill="#6b4a2f"/>' +
    // storyteller with visitors
    person(450, 380, '#2d5a3d') + person(480, 384) + person(500, 382, '#1f6f8b') + person(520, 384, '#c8643b') +
    '</svg>';

  LH.SCENES = {
    arahamaA: { svg: arahamaA, spots: [[80, 330], [240, 262], [343, 370], [600, 290], [600, 238], [620, 150], [660, 48]] },
    arahamaB: { svg: arahamaB, spots: [[145, 115], [100, 230], [225, 280], [550, 168], [480, 272], [420, 210], [750, 240]] },
    okawaA: { svg: okawaA, spots: [[400, 185], [400, 245], [520, 200], [340, 305], [640, 95], [706, 21]] },
    okawaB: { svg: okawaB, spots: [[390, 226], [390, 300], [635, 300], [158, 316], [695, 205], [485, 370]] }
  };
})();
