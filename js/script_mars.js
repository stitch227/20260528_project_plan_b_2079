
(function () {
	const canvas = document.getElementById('starCanvas');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	let W, H, stars = [];
	const mouse  = { x: 0, y: 0 };
	const target = { x: 0, y: 0 };

	function resize() {
		W = canvas.width  = window.innerWidth;
		H = canvas.height = window.innerHeight;
	}

	function initStars() {
		stars = [];
		for (let i = 0; i < 300; i++) {
			stars.push({
				x:            Math.random() * W,
				y:            Math.random() * H,
				r:            Math.random() * 1.4 + 0.2,
				alpha:        Math.random() * 0.6 + 0.2,
				speed:        Math.random() * 0.4 + 0.05,
				twinkle:      Math.random() * Math.PI * 2,
				twinkleSpeed: Math.random() * 0.018 + 0.004,
			});
		}
	}

	resize();
	initStars();
	window.addEventListener('resize', () => { resize(); initStars(); });

	
	window.addEventListener('mousemove', e => {
		mouse.x = e.clientX / W - 0.5;
		mouse.y = e.clientY / H - 0.5;
	});
	document.addEventListener('mouseleave', () => {
		mouse.x = 0;
		mouse.y = 0;
	});

	function draw() {
		ctx.clearRect(0, 0, W, H);
		target.x += (mouse.x - target.x) * 0.05;
		target.y += (mouse.y - target.y) * 0.05;

		for (const s of stars) {
			s.twinkle += s.twinkleSpeed;
			const a  = s.alpha * (0.55 + 0.45 * Math.sin(s.twinkle));
			const px = ((s.x + target.x * s.speed * W * 0.5) % W + W) % W;
			const py = ((s.y + target.y * s.speed * H * 0.5) % H + H) % H;
			ctx.beginPath();
			ctx.arc(px, py, s.r, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 237, 237, ${a})`;
			ctx.fill();
		}
		requestAnimationFrame(draw);
	}
	draw();
})();



const marsHero    = document.getElementById('section01');
const marsNumbers = document.querySelectorAll('.mars__number');

const marsObserver = new IntersectionObserver((entries) => {
	entries.forEach(e => {
		if (e.isIntersecting) {
			marsNumbers.forEach(el => scrambleMars(el));
			marsObserver.disconnect();
		}
	});
}, { threshold: 0.3 });

if (marsHero) marsObserver.observe(marsHero);

function scrambleMars(el) {
	const target  = el.dataset.target;          
	const suffix  = el.dataset.suffix || '';
	const decimal = parseInt(el.dataset.decimal) || 0;
	const isTime  = el.dataset.time === '1';     
	const chars   = '0123456789';
	const duration = 1200;
	const interval = 40;
	let elapsed = 0;

	// 최종 출력 문자열
	const finalText = isTime
		? formatTime(target)
		: formatMarsNumber(target, decimal) + suffix;

	const timer = setInterval(() => {
		elapsed += interval;
		const progress = elapsed / duration;

		if (progress >= 1) {
			el.textContent = finalText;
			clearInterval(timer);
			return;
		}

		
		const scrambled = target.split('').map(char => {
			if (/[0-9]/.test(char)) return chars[Math.floor(Math.random() * chars.length)];
			return char; 
		}).join('');

		el.textContent = isTime
			? formatTime(scrambled)
			: scrambled + suffix;
	}, interval);
}

function formatMarsNumber(val, decimal) {
	const num = parseFloat(val);
	if (decimal > 0) return num.toFixed(decimal);
	return Math.round(num).toString();
}


function formatTime(val) {
	const parts = val.split(':');
	const h = parts[0] || '0';
	const m = parts[1] || '0';
	return `${h}H ${m}M`;
}














gsap.registerPlugin(ScrollTrigger);

(function () {
	const orbs = gsap.utils.toArray('.mars-gallery__orb');
	if (!orbs.length) return;

	const n = orbs.length;        
	const span = 0.45;            
	const lastStart = 1 - span;   

	ScrollTrigger.create({
		trigger: '#section015',
		start: 'top top',
		end: 'bottom bottom',
		pin: '.mars-gallery__sticky',  
		scrub: true,
		onUpdate: (self) => {
			const p = self.progress;
			orbs.forEach((orb, i) => {
				const dist = parseFloat(orb.dataset.dist);
				const dir  = parseFloat(orb.dataset.dir);
				
				const startAt = (i / (n - 1)) * lastStart;
				const local = gsap.utils.clamp(0, 1, (p - startAt) / span);
				const x = dir * dist * local;
				const scale = 0.2 + local * 0.8;
				const opacity = gsap.utils.clamp(0, 1, local * 2);
				gsap.set(orb, { x: x + 'vw', scale: scale, opacity: opacity });
			});
		}
	});
})();
