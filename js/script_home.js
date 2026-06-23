

(function () {
	'use strict';

    function lockScroll(e) { e.preventDefault(); }
    window.addEventListener('wheel', lockScroll, { passive: false });
    window.addEventListener('touchmove', lockScroll, { passive: false });


	const elEarth    = document.getElementById('bgEarth');      
	const elMars     = document.getElementById('bgMars');       
	//const elLabel    = document.getElementById('heroLabel');    
	const elHeadline = document.getElementById('heroHeadline'); 
	const elScroll   = document.getElementById('scrollHint');   
	const elStatus   = document.getElementById('statusTag');    

	
	const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

	
	gsap.set(elMars, { opacity: 0, rotation: -1, transformOrigin: '50% 1800%' });

	
	async function runSequence() {

		await wait(600);
		

		await wait(210);

		
		gsap.set(elHeadline, { opacity: 1 }); 
		const text = elHeadline.textContent;
		elHeadline.innerHTML = text.split('').map(char =>
			char === ' '
			? '<span style="display:inline-block">&nbsp;</span>'
			: `<span style="display:inline-block; opacity:0; filter:blur(8px); transform:translateY(20px)">${char}</span>`
		).join('');

		const spans = elHeadline.querySelectorAll('span');
		const spansA = Array.from(spans).slice(0, 7);   
        const spansB = Array.from(spans).slice(7, 10);  
        const spansC = Array.from(spans).slice(10, 14);   
		const spansD = Array.from(spans).slice(14);     

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
		}, '+=0.12') 
        .to(spansC, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			duration: 1.75,
			ease: 'power2.out',
			stagger: 0.05
		}, '-=1.3') 

        .to(spansD, {
			opacity: 1,
			filter: 'blur(0px)',
			y: 0,
			duration: 2.16,
			ease: 'power2.out',
			stagger: 0.05
		}, '+=0.8'); 




		await wait(1700);

        
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
			delay: 1  
		});

		await wait(2360); 

		
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
            ease: 'power1.out'  
        })

        await wait(2650-2200);  

        const alreadyRevealed = localStorage.getItem('marsRevealed') === 'true';

		if (!alreadyRevealed) {
			
			document.querySelector('.logo-dot').animate(
				[
					{ color: 'var(--white)' },
					{ color: 'var(--mars)' }
				],
				{
					duration: 950,
					easing: 'ease-out',
					fill: 'forwards'
				}
			);
			localStorage.setItem('marsRevealed', 'true');
		}


		await wait(2300);  

		elScroll.classList.add('visible'); 
        elScroll.style.animation = 'scrollBounce 1.5s ease-in-out infinite';
		elStatus.classList.add('visible'); 
        
        window.removeEventListener('wheel', lockScroll);
        window.removeEventListener('touchmove', lockScroll);
	}

	window.addEventListener('load', runSequence);

})();


window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollHint = document.getElementById('scrollHint');
    const spans = document.querySelectorAll('.hero__headline span');
    const content = document.querySelector('.hero__content');

    scrollHint.style.transition = 'opacity 0.3s ease';
    scrollHint.style.opacity = scrollY > 0 ? '0' : '1';

    const fadeEnd = window.innerHeight * 0.3;
    const progress = Math.min(scrollY / fadeEnd, 1);

    spans.forEach(span => {
        span.style.opacity = 1 - progress;
        span.style.filter = `blur(${progress * 32}px)`;
    });
    content.style.transform = `translateY(${-progress * 80}px)`;
});











const dialogBox = document.getElementById('dialogBox');
const dbInner   = document.querySelector('.db-inner');
const dbBody    = document.getElementById('dbBody');
const dbBtn     = document.getElementById('dbBtn');
const sec02     = document.getElementById('section02');
const sec03     = document.getElementById('section03');

const DIALOG_TEXT = 'ARE YOU READY TO LEAVE EARTH BEHIND?';

let dialogTriggered = false;
function lockScroll2(e) { e.preventDefault(); }

window.addEventListener('scroll', function checkDialog() {
    if (dialogTriggered) return;
    const rect = sec02.getBoundingClientRect();
    
    if (rect.top < window.innerHeight * 0.6) {
        dialogTriggered = true;
        
        window.addEventListener('wheel', lockScroll2, { passive: false });
        window.addEventListener('touchmove', lockScroll2, { passive: false });
        
        const snapY = sec02.offsetTop + sec02.offsetHeight / 2 - window.innerHeight / 2;
        window.scrollTo({ top: snapY, behavior: 'smooth' });
        
        setTimeout(() => runDialogAnimation(), 650);
    }
});






function runDialogAnimation() {
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
    window.removeEventListener('wheel', lockScroll2);
    window.removeEventListener('touchmove', lockScroll2);
    gsap.to(dialogBox, {
        scaleX: 0, opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        transformOrigin: "center center",
        onComplete: () => {
            sec03.scrollIntoView({ behavior: 'smooth' });
        }
    });
});












const aboutSection = document.getElementById('section03');
const numberEls    = document.querySelectorAll('.about__number');

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            numberEls.forEach(el => {
                if (el.id === 'yearNumber') scrambleYear(el);
                else scrambleNumber(el);
            });
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

function scrambleYear(el) {
    const target = el.dataset.target;
    const chars = '0123456789';
    const duration = 1200;
    const interval = 40;
    let elapsed = 0;

    const timer = setInterval(() => {
        elapsed += interval;
        const progress = elapsed / duration;

        if (progress >= 1) {
            el.textContent = target;  
            clearInterval(timer);
            return;
        }

        el.textContent = target.split('').map(char => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }, interval);
}











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








(function () {
	const SLIDES = [
		{ num:'01', label:'APPLY',                  step:'STEP 01 / 05' },
		{ num:'02', label:'BIOMETRIC SCAN',         step:'STEP 02 / 05' },
		{ num:'03', label:'VR ISOLATION SIM',       step:'STEP 03 / 05' },
		{ num:'04', label:'VISA & ASSET CLEARANCE', step:'STEP 04 / 05' },
		{ num:'05', label:'FINAL BOARDING',         step:'STEP 05 / 05' },
	];

	const section    = document.getElementById('section05');
	const wheel      = document.getElementById('migrationWheel');
	const slides     = document.querySelectorAll('.wheel-slide');
	const slideNum   = document.getElementById('slideNum');
	const slideLabel = document.getElementById('slideLabel');
	const slideStep  = document.getElementById('slideStep');

	if (!section || !wheel) return;

	const TOTAL     = SLIDES.length;
	const ANGLE_GAP = 360 / TOTAL;
	const RADIUS    = 600;

	let current  = 0;
	let rotation = 0;
	let isLocked = false;
	let animating = false;

	
	slides.forEach((slide, i) => {
		slide.style.transformOrigin = 'center center';
	});

	
	function render(rot) {
		slides.forEach((slide, i) => {
			const angle  = i * ANGLE_GAP + rot;
			const rad    = (angle * Math.PI) / 180;
			const x      = Math.sin(rad) * RADIUS;
			const z      = Math.cos(rad) * RADIUS - RADIUS;
			const cosVal = Math.cos(rad);
			const scale  = Math.max(0.55, cosVal * 0.35 + 0.65);
			const opacity= Math.max(0.15, cosVal * 0.55 + 0.45);

			slide.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
			slide.style.opacity   = opacity;
			slide.style.zIndex    = Math.round(cosVal * 10 + 10);

			
			const circle = slide.querySelector('.orbit-circle');
			const dark   = Math.max(0, (1 - cosVal) * 0.6);
			circle.style.boxShadow = `inset 0 0 0 1000px rgba(0,0,0,${dark.toFixed(2)}), 0 0 40px rgba(255,255,255,${(0.2 * cosVal).toFixed(2)})`;
		});

		const s = SLIDES[current];
		slideNum.textContent    = s.num;
		slideLabel.textContent  = s.label;
		slideStep.textContent   = s.step;
	}

	
	function go(dir) {
		if (animating) return;
		const next = current + dir;

		if (next < 0 || next >= TOTAL) {
			unlock();
			const target = dir > 0
				? document.getElementById('section06')
				: document.getElementById('section04');
			if (target) target.scrollIntoView({ behavior: 'smooth' });
			return;
		}

		animating = true;
		current   = next;
		rotation -= dir * ANGLE_GAP;

		wheel.style.transition = 'none';
		
		gsap.to({ r: rotation + dir * ANGLE_GAP }, {
			r: rotation,
			duration: 0.75,
			ease: 'power2.inOut',
			onUpdate: function () {
				render(this.targets()[0].r);
			},
			onComplete: () => { animating = false; }
		});
	}

	
	function lockScroll(e) {
		e.preventDefault();
		go(e.deltaY > 0 ? 1 : -1);
	}
	function lock() {
		if (isLocked) return;
		isLocked = true;
		window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
		window.addEventListener('wheel', lockScroll, { passive: false });
	}
	function unlock() {
		isLocked = false;
		window.removeEventListener('wheel', lockScroll);
	}

	new IntersectionObserver((entries) => {
		entries.forEach(e => e.isIntersecting ? lock() : unlock());
	}, { threshold: 0.6 }).observe(section);

	render(0);
})();















(function () {

    const STEPS = [
        { num: "01", label: "APPLICATION" },
        { num: "02", label: "SPACE MEDICAL SELECTION" },
        { num: "03", label: "PSYCHOLOGICAL EVALUATION" },
        { num: "04", label: "MARS VISA & OFF-WORLD ASSET TRANSITION" },
        { num: "05", label: "FINAL APPROVAL & LAUNCH" },
    ];

    const section   = document.getElementById("section05");
    const orbit     = document.getElementById("processOrbit");
    const items     = Array.from(orbit ? orbit.querySelectorAll(".process__item") : []);
    const stepNumEl = document.getElementById("stepNumDisplay");
    const stepLblEl = document.getElementById("processStepLabel");

    if (!section || !orbit || !items.length) return;

    let current     = 0;
    let isLocked    = false;
    let animating   = false;
    let angleOffset = 0;

    const TOTAL = STEPS.length;

   
    const getR    = () => section.offsetWidth  * 0.35;  
    const BIG_SZ  = () => section.offsetWidth  * 0.2;  
    const SIDE_SZ = () => BIG_SZ() * 0.55;              

    const baseAngle = (i) => (360 / TOTAL) * i;
    const realAngle = (i) => baseAngle(i) - angleOffset;

    
    const angleToXY = (deg, R) => {
        const rad = (deg - 90) * (Math.PI / 180);
        return {
            x: section.offsetWidth  / 2 + R * Math.cos(rad),            
            y: section.offsetHeight *1.1 + R *  0.8 * Math.sin(rad)

        };
    };

    function render() {
        const big  = BIG_SZ();
        const R    = getR();

        items.forEach((item, i) => {
            const deg = realAngle(i);
            let norm  = ((deg % 360) + 360) % 360;
            if (norm > 180) norm -= 360;   /* -180 ~ 180 */

            const isCenter = Math.abs(norm) < 36;
            const isTop    = norm > -110 && norm < 110;

            const { x, y } = angleToXY(deg, R);
            const minScale = 0.55;
            const maxScale = 1.0;
            const t     = Math.max(0, 1 - Math.abs(norm) / 110);
            const scale = minScale + (maxScale - minScale) * t;
            const sz    = isTop ? big * scale : 0;
            item.style.opacity = isTop ? Math.min(1, t * 3) : 0;  



            const half = sz / 2;

            item.style.width     = sz + "px";
            item.style.height    = sz + "px";
            item.style.transform = `translate(${x - half}px, ${y - half}px)`;

            item.classList.remove("is-active", "is-side", "is-hidden");
            if      (isCenter) { item.classList.add("is-active"); item.style.zIndex = 10; }
            else if (isTop)    { item.classList.add("is-side");   item.style.zIndex = 5;  }
            else               { item.classList.add("is-hidden"); item.style.zIndex = 1;  }
        });
    }

    function updateText(isInit = false) {
		const el = stepLblEl;


		if (isInit) {  
	        el.style.transition = 'none';
    	    el.style.opacity = '0';
	        el.style.transform = 'translateY(15px)';
	        stepNumEl.textContent = STEPS[current].num;
    	    el.textContent = STEPS[current].label;
       	
			void el.offsetWidth;
       	
			el.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
	        el.style.opacity = '1';
    	    el.style.transform = 'translateY(0)';
        	return;
    	}
		


        el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    	el.style.opacity = '0';
    	el.style.transform = 'translateY(15px)';

        setTimeout(() => {
            
	        el.style.transition = 'none';
    	    el.style.transform = 'translateY(15px)';
        	stepNumEl.textContent = STEPS[current].num;
        	el.textContent = STEPS[current].label;

			void el.offsetWidth; 

	        
        	el.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
    	    el.style.opacity = '1';
        	el.style.transform = 'translateY(0)';
        }, 370);
    }

    function slide(dir) {
        if (animating) return;
        animating = true;
        current = ((current + dir) % TOTAL + TOTAL) % TOTAL;  
        updateText();  

        const step   = 360 / TOTAL;
        const target = angleOffset + dir * step;
        const start  = angleOffset;
        const startT = performance.now();
        const dur    = 1200;

        function ease(t) {
            return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        }

        function tick(now) {
            const t = Math.min((now - startT) / dur, 1);
            angleOffset = start + (target - start) * ease(t);
            render();
            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                angleOffset = target;
        
                render();
               
                animating = false;
            }
        }
        requestAnimationFrame(tick);
    }

  
    requestAnimationFrame(() => {
    	requestAnimationFrame(() => {
        	render();

        	
        	stepLblEl.style.transition = 'none';
        	stepLblEl.style.opacity = '0';
        	stepLblEl.style.transform = 'translateY(15px)';
        	stepNumEl.textContent = STEPS[current].num;
        	stepLblEl.textContent = STEPS[current].label;

       		
        	requestAnimationFrame(() => {
        	    stepLblEl.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        	    stepLblEl.style.opacity = '1';
        	    stepLblEl.style.transform = 'translateY(0)';
        	});
    	});
	});

    window.addEventListener("resize", render);

    
    section.addEventListener("mousemove", (e) => {
        const rect  = section.getBoundingClientRect();
        const relX  = (e.clientX - rect.left)  / rect.width;
        const relY  = (e.clientY - rect.top)   / rect.height;
        const inZone = relX > 0.125 && relX < 0.875 && relY > 0.125 && relY < 0.875;

        if (inZone && !isLocked) {
            isLocked = true;
            section.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (!inZone) {
            isLocked = false;
        }
    });

   
    window.addEventListener("wheel", (e) => {
        if (!isLocked) return;
        e.preventDefault();
        slide(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });
    
    window.addEventListener('scroll', () => {
		const rect05 = section.getBoundingClientRect();
		if (rect05.bottom <= window.innerHeight * 0.3) {
			isLocked = false;
		}
	});

})();



(function () {
	const section = document.getElementById('section05');
	const items = document.querySelectorAll('.process__item');
	const label = document.getElementById('processStepLabel');
	const stepNum = document.getElementById('processStepNumber');
	const header = document.querySelector('.process__header');

	if (!section) return;

	const targets = [...items, label, stepNum, header].filter(Boolean);
	targets.forEach(el => el.style.transition = 'opacity 0.4s ease');

	window.addEventListener('scroll', () => {
		const rect = section.getBoundingClientRect();
		if (rect.bottom <= window.innerHeight * 0.85) {
			targets.forEach(el => el.style.opacity = '0');
		} else {
			targets.forEach(el => el.style.opacity = '');
		}
	});
})();



















(function () {
    const section   = document.getElementById('section06');
    const hint      = document.getElementById('scrollHint06');
    const section07 = document.getElementById('section07');

    if (!section || !hint) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                hint.classList.add('visible');
                hint.style.animation = 'scrollBounce 1.5s ease-in-out infinite';
            } else {
                hint.classList.remove('visible');
                hint.style.opacity = '';
            }
        });
    }, { threshold: 0.4 });

    io.observe(section);

    window.addEventListener('scroll', () => {
        if (!section07) return;

        const rect07    = section07.getBoundingClientRect();
        const fadeStart = window.innerHeight * 0.8;
        const fadeEnd   = window.innerHeight * 0.3;
        const progress  = Math.min(Math.max((fadeStart - rect07.top) / (fadeStart - fadeEnd), 0), 1);

        hint.style.opacity = 1 - progress;
    });
})();



(function () {
	const section = document.getElementById('section06');
	const section05 = document.getElementById('section05');
	if (!section) return;

	let snapped = false;

	window.addEventListener('scroll', () => {
		const rect = section.getBoundingClientRect();
		const rect05 = section05 ? section05.getBoundingClientRect() : null;

		const s05done = !rect05 || rect05.bottom <= window.innerHeight * 0.3;
		const entered = rect.top < window.innerHeight * 0.8;
		const notPassed = rect.bottom > window.innerHeight * 0.2;

		if (s05done && entered && notPassed && !snapped) {
			snapped = true;
			section.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}

		if (!entered || !notPassed) {
			snapped = false;
		}
	});
})();









(function () {
	const section = document.getElementById('section07');
	const stage   = document.getElementById('kitStage');
	const slides  = document.querySelectorAll('.kit__slide');
	if (!section || !slides.length) return;

	const total     = slides.length;
	let current     = 0;
	let isAnimating = false;

	function getCardW() { return window.innerWidth * 0.33; }
	function getGap()   { return window.innerWidth * 0.005; }
	function getUnitW() { return getCardW() + getGap(); }
	function getCX()    { return (window.innerWidth - getCardW()) / 2; }

	const TRANS = 'left 0.65s cubic-bezier(0.77,0,0.175,1), transform 0.65s cubic-bezier(0.77,0,0.175,1), opacity 0.65s ease, filter 0.65s ease';

	function applyLayout(animated) {
		const cardW = getCardW();
		const unitW = getUnitW();
		const cx    = getCX();

		slides.forEach((slide, i) => {
			let rel = i - current;
			if (rel > total / 2)  rel -= total;
			if (rel < -total / 2) rel += total;

			const absRel = Math.abs(rel);
			const tx     = cx + rel * unitW;

			slide.style.width      = cardW + 'px';
			slide.style.transition = animated ? TRANS : 'none';

			if (absRel > 1) {
				slide.style.left      = tx + 'px';
				slide.style.opacity   = '0';
				slide.style.transform = rel < 0 ? 'rotateY(42deg)' : 'rotateY(-42deg)';
				slide.style.filter    = 'brightness(0.62)';
				slide.style.zIndex    = '1';
				return;
			}

			slide.style.left            = tx + 'px';
			slide.style.opacity         = '1';
			slide.style.zIndex          = absRel === 0 ? '10' : '5';
			slide.style.transformOrigin = '50% 50%';

			if (rel === 0) {
				slide.style.transform = 'rotateY(0deg)';
				slide.style.filter    = 'brightness(1)';
			} else if (rel === -1) {
				slide.style.transform = 'rotateY(42deg)';
				slide.style.filter    = 'brightness(0.62)';
			} else {
				slide.style.transform = 'rotateY(-42deg)';
				slide.style.filter    = 'brightness(0.62)';
			}
		});
	}

	function applyClipPath() {
		const W = stage.offsetWidth;
		const H = stage.offsetHeight;
		const c = H * 0.18;
		stage.style.clipPath = `path('M 0,0 Q ${W*0.5},${c} ${W},0 L ${W},${H} Q ${W*0.5},${H-c} 0,${H} Z')`;
	}

	applyClipPath();
	applyLayout(false);
	window.addEventListener('resize', () => { applyClipPath(); applyLayout(false); });

	function goNext() {
		if (isAnimating) return;
		isAnimating = true;
		current = (current + 1) % total;
		applyLayout(true);
		setTimeout(() => { isAnimating = false; }, 650);
	}

	function goPrev() {
		if (isAnimating) return;
		isAnimating = true;
		current = (current - 1 + total) % total;
		applyLayout(true);
		setTimeout(() => { isAnimating = false; }, 650);
	}


	let scrollAccum = 0;



    
	window.addEventListener('wheel', (e) => {
		const r = stage.getBoundingClientRect();
		const inside = e.clientX >= r.left && e.clientX <= r.right &&
		               e.clientY >= r.top  && e.clientY <= r.bottom;
		if (!inside) return;
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

		e.preventDefault();
		scrollAccum += e.deltaY;
		if (scrollAccum > 80)  { scrollAccum = 0; goNext(); }
		if (scrollAccum < -80) { scrollAccum = 0; goPrev(); }
	}, { passive: false });

	slides.forEach(slide => {
		slide.addEventListener('mouseenter', () => {
			section.scrollIntoView({ behavior: 'smooth', block: 'center' });
		});
	});




	let touchStartY = 0;
	section.addEventListener('touchstart', (e) => {
		touchStartY = e.touches[0].clientY;
	}, { passive: true });
	section.addEventListener('touchend', (e) => {
		const dy = touchStartY - e.changedTouches[0].clientY;
		if (dy > 40) goNext();
		else if (dy < -40) goPrev();
	}, { passive: true });

	let snapped07 = false;
	window.addEventListener('scroll', () => {
		const rect = section.getBoundingClientRect();
		const entered   = rect.top < window.innerHeight * 0.6;
		const notPassed = rect.bottom > window.innerHeight * 0.4;
		if (entered && notPassed && !snapped07) {
			snapped07 = true;
			section.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
		if (!entered || !notPassed) snapped07 = false;
	});

})();












(function () {
	const section = document.getElementById('section08');
	const section07 = document.getElementById('section07');
	if (!section) return;

	let snapped = false;

	window.addEventListener('scroll', () => {
		const rect = section.getBoundingClientRect();
		const rect07 = section07 ? section07.getBoundingClientRect() : null;

		const s07done = !rect07 || rect07.bottom <= window.innerHeight * 0.3;
		const entered = rect.top < window.innerHeight * 0.8;
		const notPassed = rect.bottom > window.innerHeight * 0.2;

		if (s07done && entered && notPassed && !snapped) {
			snapped = true;
			section.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}

		if (!entered || !notPassed) {
			snapped = false;
		}
	});
})();

