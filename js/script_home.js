
/* ════════════════════════════════════
   PLAN B — Section 01 : Hero
   script_home.js

   시퀀스:
   0.6s  → heroLabel 페이드인
   0.5s  → 헤드라인 페이드인
   earth 회전 시작
   2.1s 후 → mars 오버랩 등장
   완료 후 → scrollHint + statusTag 등장
════════════════════════════════════ */

(function () {
	'use strict';
    

	/* ── 요소 참조 ─────────────────────── */
	const elEarth    = document.getElementById('bgEarth');      // 지구 배경
	const elMars     = document.getElementById('bgMars');       // 화성 배경
	//const elLabel    = document.getElementById('heroLabel');    // 상단 작은 라벨
	const elHeadline = document.getElementById('heroHeadline'); // 헤드라인
	const elScroll   = document.getElementById('scrollHint');   // 하단 SCROLL TO EXPLORE
	const elStatus   = document.getElementById('statusTag');    // 우하단 DESTINATION/MARS

	/* ── 딜레이 헬퍼 ─────────────────────── */
	const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

	/* ── 초기값 세팅 ─────────────────────── */
	gsap.set(elMars, { opacity: 0, rotation: -1, transformOrigin: '50% 1800%' });

	/* ── 메인 시퀀스 ────────────────────── */
	async function runSequence() {

		await wait(600);
		//elLabel.classList.add('visible'); // 라벨 페이드인

		await wait(210);

		// 헤드라인 글자 분리 + 애니메이션
		gsap.set(elHeadline, { opacity: 1 }); // 컨테이너 보이게
		const text = elHeadline.textContent;
		elHeadline.innerHTML = text.split('').map(char =>
			char === ' '
			? '<span style="display:inline-block">&nbsp;</span>'
			: `<span style="display:inline-block; opacity:0; filter:blur(8px); transform:translateY(20px)">${char}</span>`
		).join('');

		const spans = elHeadline.querySelectorAll('span');
		const spansA = Array.from(spans).slice(0, 7);   // WELCOME
        const spansB = Array.from(spans).slice(7, 10);  // TO
        const spansC = Array.from(spans).slice(10, 14);   // THE
		const spansD = Array.from(spans).slice(14);     // SECOND EARTH

		const tl = gsap.timeline();

		tl.to(spansA, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			duration: 0.9,
			ease: 'power2.out',
			stagger: 0.05
		})
		.to(spansB, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			duration: 1.35,
			ease: 'power3.out',
			stagger: 0.05
		}, '+=0.12') // 0.4초 텀 후 시작
        .to(spansC, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			duration: 1.75,
			ease: 'power2.out',
			stagger: 0.05
		}, '-=1.3') // 0.4초 텀 후 시작

        .to(spansD, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			duration: 2.16,
			ease: 'power2.out',
			stagger: 0.05
		}, '+=0.8'); // -초 텀 후 시작




		await wait(1700);

        // 지구 회전+페이드아웃
		gsap.to(elEarth, {
			rotation: 15,
			duration: 2.29,
			ease: 'back.in(0.3)',
			transformOrigin: '50% 500%'
		});

		gsap.to(elEarth, {
			opacity: 0,
			duration: 1.2,
			ease: 'power1.in',
			delay: 1  // 1.5초 후 어두워지기 시작
		});

		await wait(2360); // earth 끝나기 전

		// 화성 회전하며 등장
		gsap.to(elMars, {
			opacity: 1,
			rotation: 0,
			duration: 2.65,
			ease: 'back.out(0.42)',
			transformOrigin: '50% 1000%'
		});

        

        gsap.to(elMars, {
            opacity:1,
            duration: 2.65,
            ease: 'power1.out'  // 처음 느리게, 나중에 빠르게
        })

        await wait(2650-2200);  // Mars 애니 끝날 때까지 대기
        document.querySelector('.logo-dot').classList.add('mars');  // 그 후 색상 변경


        
		await wait(2500); // mars 애니메이션 완료 대기

		elScroll.classList.add('visible'); // SCROLL TO EXPLORE 등장
        elScroll.style.animation = 'scrollBounce 1.5s ease-in-out infinite';
		elStatus.classList.add('visible'); // DESTINATION/MARS 등장
        document.body.style.overflow = '';
        
	}

	window.addEventListener('load', runSequence);

})();










/* ════════════════════════════════════
   SECTION 02 — DIALOG
════════════════════════════════════ */
const dialogBox = document.getElementById('dialogBox');
const dbInner   = document.querySelector('.db-inner');
const dbBody    = document.getElementById('dbBody');
const dbBtn     = document.getElementById('dbBtn');
const sec02     = document.getElementById('section02');
const sec03     = document.getElementById('section03');

const DIALOG_TEXT = 'ARE YOU READY TO LEAVE EARTH BEHIND?';

const dialogObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            runDialogAnimation();
            dialogObserver.disconnect();
        }
    });
}, { threshold: 0.4  // 뷰포트 중앙 20% 구간에서만 발동
 });

dialogObserver.observe(sec02);

function runDialogAnimation() {
    document.body.style.overflow = 'hidden';
    gsap.to(dialogBox, {
        scaleX: 1, opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
            gsap.to(dbInner, { opacity: 1, duration: 0.3 });
            typeText(dbBody, DIALOG_TEXT, 40, () => {
                gsap.to(dbBtn, { opacity: 1, duration: 0.4 });
            });
        }
    });
}

function typeText(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

dbBtn.addEventListener('click', () => {
    document.body.style.overflow = '';
    gsap.to(dialogBox, {
        scaleX: 0, opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
            sec03.scrollIntoView({ behavior: 'smooth' });
        }
    });
});








/* ════════════════════════════════════
   SECTION 04 — MARS 숫자 애니
════════════════════════════════════ */
const marsSection = document.getElementById('section04');
const marsNumberEls = document.querySelectorAll('.mars__number');

const marsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            marsNumberEls.forEach(el => scrambleNumber(el));
            marsObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

marsObserver.observe(marsSection);














/* ════════════════════════════════════
   SECTION 03 — ABOUT US 숫자 애니
════════════════════════════════════ */
const aboutSection = document.getElementById('section03');
const numberEls    = document.querySelectorAll('.about__number');

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            numberEls.forEach(el => scrambleNumber(el));
            aboutObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

aboutObserver.observe(aboutSection);

function scrambleNumber(el) {
    const target  = el.dataset.target;
    const suffix  = el.dataset.suffix || '';
    const decimal = parseInt(el.dataset.decimal) || 0;
    const chars   = '0123456789';
    const duration = 1200;
    const interval = 40;
    let elapsed = 0;

    const timer = setInterval(() => {
        elapsed += interval;
        const progress = elapsed / duration;

        if (progress >= 1) {
            el.textContent = formatNumber(target, decimal) + suffix;
            clearInterval(timer);
            return;
        }

        // 랜덤 숫자로 스크램블
        const scrambled = target.split('').map(char => {
            if (char === '.' || char === ',') return char;
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        el.textContent = scrambled + suffix;
    }, interval);
}

function formatNumber(val, decimal) {
    const num = parseFloat(val);
    if (decimal > 0) return num.toFixed(decimal);
    return Math.round(num).toLocaleString();
}