/* ════════════════════════════════════
   PLAN B — component.js
   전체 페이지 공통 컴포넌트
════════════════════════════════════ • */

/* ── 공통 HTML 자동 삽입 ── */
// 모든 페이지 최상단에 nav + cursor 삽입
document.body.insertAdjacentHTML('afterbegin', `
	<nav class="nav" id="nav">
		<div class="nav__logo">PLAN<span class="logo-dot">●</span>B</div>
		<ul class="nav__links">
			<li><a href="#">MIGRATION</a></li>
			<li><a href="#">MARS</a></li>
			<li><a href="#">WELCOME KIT</a></li>
			<li><a href="#">APPLY</a></li>
			<li><a href="#">ABOUT</a></li>
			<li><a href="#">SIGN IN</a></li>
		</ul>
	</nav>
	<div class="cursor" id="cursor"></div>
	<div class="cursor-ring" id="cursorRing"></div>
`);

/* ── 커서 동작 ── */
// elCursor = 즉시 따라오는 점, elRing = 지연되며 따라오는 링
const elCursor = document.getElementById('cursor');
const elRing   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
	mx = e.clientX;
	my = e.clientY;
});

(function tickCursor() {
	// 0.13 = 링이 실제 위치로 13%씩만 이동 — 작을수록 느리게 따라옴
	rx += (mx - rx) * 0.13;
	ry += (my - ry) * 0.13;
	elCursor.style.left = mx + 'px'; // 점은 즉시 이동
	elCursor.style.top  = my + 'px';
	elRing.style.left   = rx + 'px'; // 링은 지연되며 이동
	elRing.style.top    = ry + 'px';
	requestAnimationFrame(tickCursor); // 매 프레임마다 반복 (60fps)
})();