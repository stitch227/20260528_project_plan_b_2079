
document.body.insertAdjacentHTML('afterbegin', `
	<nav class="nav" id="nav">
		<a href="index.html" class="nav__logo">PLAN<span class="logo-dot">●</span>B</a>
		<ul class="nav__links">
			<li><a href="migration.html">MIGRATION</a></li>
			<li><a href="mars.html">MARS</a></li>
			<li><a href="welcomekit.html">WELCOME KIT</a></li>
			<li><a href="apply.html">APPLY</a></li>
			<li><a href="about.html">ABOUT</a></li>
			<li><a href="#l">SIGN IN</a></li>
		</ul>
	</nav>
	<div class="cursor" id="cursor"></div>
	<div class="cursor-ring" id="cursorRing"></div>
`);

if (localStorage.getItem('marsRevealed') === 'true') {
	document.querySelector('.logo-dot').style.color = 'var(--mars)';
}


const elCursor = document.getElementById('cursor');
const elRing   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
	mx = e.clientX;
	my = e.clientY;
});

(function tickCursor() {
	
	rx += (mx - rx) * 0.13;
	ry += (my - ry) * 0.13;
	elCursor.style.left = mx + 'px'; 
	elCursor.style.top  = my + 'px';
	elRing.style.left   = rx + 'px';
	elRing.style.top    = ry + 'px';
	requestAnimationFrame(tickCursor); 
})();
