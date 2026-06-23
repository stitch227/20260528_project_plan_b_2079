gsap.registerPlugin(CustomEase, ScrollToPlugin);
gsap.registerPlugin(CustomEase, ScrollToPlugin, ScrollTrigger);


(() => {
	"use strict";

	CustomEase.create("smoothLand", "M0,0 C0.2,0.0 0.3,1.06 0.5,1.04 0.7,1.02 0.85,1 1,1");
	CustomEase.create("spinFastMid", "M0,0 C0.22,0.03 0.4,0.1 0.5,0.5 0.6,0.82 0.78,0.97 1,1");

	
	const SUB = "Online application&nbsp;&nbsp;·&nbsp;&nbsp;self-assessment form";
	const STEPS = [
		{ eyebrow:"STEP 01", title:"APPLICATION",       sub:SUB, body:"Submit your online application and complete a baseline physical and psychological self-assessment. PLAN B's selection team reviews every applicant individually.", img:"https://res.cloudinary.com/dzayipaad/image/upload/v1781726339/process_apply_ojtdri.png" },
		{ eyebrow:"STEP 02", title:"MEDICAL SELECTION",  sub:SUB, body:"Undergo a full medical screening with PLAN B's flight surgeons. Cardiovascular, bone-density and radiation-tolerance baselines are recorded for your migration profile.", img:"https://cdn.midjourney.com/86b27506-824d-49d1-b0b1-f934b2fdce79/0_3.png" },
		{ eyebrow:"STEP 03", title:"PSYCH EVALUATION",   sub:SUB, body:"Complete the psychological readiness battery. We assess isolation tolerance, team dynamics and long-duration stress response for the journey ahead.", img:"https://cdn.midjourney.com/c5a53208-b932-4464-8437-a2b52df07348/0_1.png" },
		{ eyebrow:"STEP 04", title:"VISA CLEARANCE",     sub:SUB, body:"Finalise interplanetary documentation and legal clearance. PLAN B handles treaty compliance, identity transfer and your off-world residency status.", img:"https://cdn.midjourney.com/9ff54d26-7dcb-4b6f-a213-619a226ba425/0_1.png" },
		{ eyebrow:"STEP 05", title:"LAUNCH",             sub:SUB, body:"Report to the departure terminal for final fit checks and boarding. Your seat aboard the next Mars transit window is confirmed. Welcome to PLAN B.", img:"https://cdn.midjourney.com/2a789aa9-4da1-41f4-829f-207e89fdd6d8/0_0.png" },
	];

	
	const STEP_ANGLE = 12;
	const angleFor   = i => 180 - (2 - i) * STEP_ANGLE;
	const R = 50;
	const pointAt = deg => {
		const r = deg * Math.PI / 180;
		return { x: 50 + R * Math.cos(r), y: 50 - R * Math.sin(r) };
	};

	
	const orbit     = document.getElementById("orbit");
	const intro     = document.getElementById("intro");
	const procText  = document.getElementById("processText");
	const navImg    = document.getElementById("navImageImg");
	const navRing   = document.querySelector(".nav-image__ring");
	const navSpin   = document.getElementById("navSpin");
	const btnBox    = document.getElementById("navButtons");
	const elEyebrow = document.getElementById("stepEyebrow");
	const elTitle   = document.getElementById("stepTitle");
	const elSub     = document.getElementById("stepSub");
	const elBody    = document.getElementById("stepBody");

	
	let phase = "intro";
	let busyReveal = false;
	let current = 0;
	let busy = false;

	
	const buttons = [];
	STEPS.forEach((s, i) => {
		const p = pointAt(95);
		const b = document.createElement("button");
		b.className = "nav-btn";
		b.dataset.index = i;
		b.innerHTML = `<span class="nav-btn__num">${String(i+1).padStart(2,"0")}</span>`;
		b.style.left = p.x + "%";
		b.style.top  = p.y + "%";
		b.style.opacity = "0";
		b.addEventListener("click", () => goToStep(i));
		btnBox.appendChild(b);
		buttons.push(b);
	});

	
	function applyText(i) {
		const s = STEPS[i];
		elEyebrow.innerHTML = s.eyebrow;
		elTitle.textContent = s.title;
		elSub.innerHTML     = s.sub;
		elBody.textContent  = s.body;
	}
	function showProcessText(i, animateOut = true) {
		const bringIn = () => {
			applyText(i);
			gsap.fromTo(procText.children,
				{ opacity: 0, y: 18 },
				{ opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
		};
		gsap.set(procText, { pointerEvents: "auto", opacity: 1 });
		if (animateOut) {
			gsap.to(procText.children, {
				opacity: 0, y: -16, duration: 0.3, stagger: 0.04, ease: "power2.in",
				onComplete: bringIn
			});
		} else {
			bringIn();
		}
	}
	function activate(i) {
		buttons.forEach((b, k) => b.classList.toggle("is-active", k === i));
	}

	
	function introIn() {
		const path = orbit.querySelector(".orbit__path");
		const len  = path.getTotalLength();
		gsap.set(path, { opacity: 1, strokeDasharray: len, strokeDashoffset: -len });
		gsap.set(intro, { opacity: 1 });   
		gsap.set(intro.children, { opacity: 0, y: 18 });
		gsap.set(btnBox, { opacity: 1 });
		gsap.set(navImg, { opacity: 0 });

		const tl = gsap.timeline();
		tl.to(path, { strokeDashoffset: 0, duration: 3, ease: "power1.out" })
		  .to(intro.children, { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, ease: "power2.out" }, "-=2");
	}

	
	function toProcess() {
		if (phase !== "intro" || busyReveal) return;
		busyReveal = true;
		phase = "process";

		gsap.to(intro, { opacity: 0, y: -20, duration: 0.72, ease: "smoothLand",
			onComplete: () => { intro.style.pointerEvents = "none"; } });

		gsap.delayedCall(1, () => { showProcessText(0, false); current = 0; });

		gsap.set(btnBox, { opacity: 1 });
		const order = [4, 3, 2, 1, 0];
		const tl = gsap.timeline({ delay: 0.343 });

		order.forEach((idx, k) => {
			const btn  = buttons[idx];
			const num  = btn.querySelector(".nav-btn__num");
			const home = angleFor(idx);
			const proxy = { a: 95 };
			const startT = k * 0.15;
			gsap.set(num, { opacity: 0 });
			tl.set(btn, { opacity: 1 }, startT);

			tl.to(proxy, {
				a: home, duration: 0.65, ease: "back.out(0.5)",
				onUpdate: () => {
					const p = pointAt(proxy.a);
					btn.style.left = p.x + "%";
					btn.style.top  = p.y + "%";
				},
				onComplete: () => {
					gsap.to(num, { opacity: 1, duration: 0.4 });
					if (idx === 0) {
						activate(0);
						current = 0;
						busyReveal = false;
					}
				}
			}, startT);

			if (idx === 0) {
				const imgStart = startT - 0.2;
				gsap.set(navSpin, { rotation: -90, transformOrigin: "50% 50%" });
				tl.to(navSpin, { rotation: 0, duration: 1, ease: "power2.out" }, imgStart);
				tl.to([navImg, navRing], { opacity: 1, duration: 1.1, ease: "power1.out" }, imgStart);
			}
		});
	}

	
	function toIntro() {
		if (phase !== "process" || busyReveal) return;
		busyReveal = true;
		phase = "intro";
		busy = false;

		gsap.to(procText.children, { 
			opacity: 0, y: -16, duration: 0.4, stagger: 0.05, ease: "power2.in",
			onComplete: ()=>{
				gsap.set(procText, { opacity: 0 });
			}});
		gsap.set(procText, { pointerEvents: "none" });
		buttons.forEach(b => b.classList.remove("is-active"));

		gsap.to([navImg, navRing], { opacity: 0, duration: 0.67, ease: "power1.in" });
		gsap.to(navSpin, { rotation: -90, duration: 0.72, ease: "power2.in" });

		const order = [0, 1, 2, 3, 4];
		const tl = gsap.timeline({ delay: 0.2 });
		order.forEach((idx, k) => {
			const btn  = buttons[idx];
			const num  = btn.querySelector(".nav-btn__num");
			const proxy = { a: angleFor(idx) };
			const startT = k * 0.12;
			tl.to(num, { opacity: 0, duration: 0.25 }, startT);
			tl.to(proxy, {
				a: 95, duration: 0.55, ease: "power2.in",
				onUpdate: () => {
					const p = pointAt(proxy.a);
					btn.style.left = p.x + "%";
					btn.style.top  = p.y + "%";
				},
				onComplete: () => {
					gsap.set(btn, { opacity: 0 });
					if (idx === 4) {
						gsap.set(intro, { pointerEvents: "auto" });
						gsap.fromTo(intro.children,
							{ opacity: 0, y: 18 },
							{ opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
							  onComplete: () => { busyReveal = false; } });
						gsap.set(intro, { opacity: 1, y: 0 });
						current = 0;
					}
				}
			}, startT);
		});
	}

	
	function goToStep(i) {
		if (busy || phase !== "process") return;
		if (i === current) return;
		busy = true;
		activate(i);

		const DUR = 1.1;
		const tl = gsap.timeline({ onComplete: () => { busy = false; current = i; } });

		gsap.set(navSpin, { transformOrigin: "50% 50%" });
		tl.fromTo(navSpin, { rotation: 0 }, { rotation: 360, duration: DUR, ease: "spinFastMid" }, 0);

		tl.to([navImg, navRing], { opacity: 0, duration: DUR * 0.5, ease: "sine.inOut" }, 0);
		tl.add(() => { showProcessText(i); }, DUR * 0.12);
		tl.add(() => { navImg.src = STEPS[i].img; }, DUR * 0.62);
		tl.to([navImg, navRing], { opacity: 0.85, duration: DUR * 0.42, ease: "sine.inOut" }, DUR * 0.58);
		tl.to([navImg, navRing], { opacity: 1, duration: 0.5, ease: "sine.out" }, DUR);
		tl.set(navSpin, { rotation: 0 });
	}


	
	function toNextSection() {
		if (phase !== "process" || busyReveal) return;
		busyReveal = true;
		phase = "exit";
		busy = false;

		gsap.to(procText.children, { opacity: 0, y: -16, duration: 0.4, stagger: 0.05, ease: "power2.in" });
		gsap.set(procText, { pointerEvents: "none" });
		buttons.forEach(b => b.classList.remove("is-active"));

		gsap.to(navImg,  { opacity: 0, duration: 0.5, ease: "power1.in" });
		gsap.to(navSpin, { rotation: -90, duration: 0.6, ease: "power2.in" });

		const path = orbit.querySelector(".orbit__path");
		const len  = path.getTotalLength();
		gsap.to(path, { strokeDashoffset: -len, duration: 1.2, ease: "power2.inOut" });

		const order = [0, 1, 2, 3, 4];
		const tl = gsap.timeline({ delay: 0.1 });
		order.forEach((idx, k) => {
			const btn  = buttons[idx];
			const num  = btn.querySelector(".nav-btn__num");
			const proxy = { a: angleFor(idx) };
			const startT = k * 0.1;
			tl.to(num, { opacity: 0, duration: 0.25 }, startT);
			tl.to(proxy, {
				a: 95, duration: 0.5, ease: "power2.in",
				onUpdate: () => {
					const p = pointAt(proxy.a);
					btn.style.left = p.x + "%";
					btn.style.top  = p.y + "%";
				},
				onComplete: () => {
					gsap.set(btn, { opacity: 0 });
					if (idx === 4) {
						document.body.classList.remove("lock-scroll");
						document.documentElement.classList.remove("lock-scroll");
						ScrollTrigger.refresh();
						phase = "done";
						busyReveal = false;
						gsap.to(window, { duration: 0.8, scrollTo: window.innerHeight, ease: "power2.inOut" });
					}
				}
			}, startT);
		});
	}

	
	function backToProcess() {
		if (phase !== "done" || busyReveal) return;
		busyReveal = true;
		phase = "process";
		document.body.classList.add("lock-scroll");
		document.documentElement.classList.add("lock-scroll");
		window.scrollTo(0, 0);

		const path = orbit.querySelector(".orbit__path");
		const len  = path.getTotalLength();
		gsap.set(path, { strokeDasharray: len, strokeDashoffset: -len });
		gsap.to(path, { strokeDashoffset: 0, duration: 1, ease: "power2.out" });

		gsap.set(navSpin, { rotation: -90, transformOrigin: "50% 50%" });
		gsap.to(navSpin, { rotation: 0, duration: 0.9, ease: "power2.out" });
		gsap.to([navImg, navRing], { opacity: 1, duration: 0.9, ease: "power1.out" });

		const order = [4, 3, 2, 1, 0];
		const tl = gsap.timeline({ delay: 0.2 });
		order.forEach((idx, k) => {
			const btn  = buttons[idx];
			const num  = btn.querySelector(".nav-btn__num");
			const home = angleFor(idx);
			const proxy = { a: 95 };
			const startT = k * 0.12;
			gsap.set(num, { opacity: 0 });
			tl.set(btn, { opacity: 1 }, startT);
			tl.to(proxy, {
				a: home, duration: 0.6, ease: "back.out(0.5)",
				onUpdate: () => {
					const p = pointAt(proxy.a);
					btn.style.left = p.x + "%";
					btn.style.top  = p.y + "%";
				},
				onComplete: () => {
					gsap.to(num, { opacity: 1, duration: 0.4 });
					if (idx === 0) {
						activate(current);
						showProcessText(current, false);
						busyReveal = false;
					}
				}
			}, startT);
		});
	}

	
	window.addEventListener("wheel", (e) => {
		if (phase === "intro"   && e.deltaY > 0) toProcess();
		else if (phase === "process" && e.deltaY > 0) toNextSection();
		else if (phase === "process" && e.deltaY < 0) toIntro();
		else if (phase === "done" && e.deltaY < 0 && window.scrollY <= 0) backToProcess();
	}, { passive: true });

	let touchStartY = null;
	window.addEventListener("touchstart", e => { touchStartY = e.touches[0].clientY; }, { passive: true });
	window.addEventListener("touchmove",  e => {
		if (touchStartY === null) return;
		const dy = touchStartY - e.touches[0].clientY;
		if (phase === "intro"   && dy > 30) toProcess();
		else if (phase === "process" && dy > 30) toNextSection();
		else if (phase === "process" && dy < -30) toIntro();
		else if (phase === "done" && dy < -30 && window.scrollY <= 0) backToProcess();
	}, { passive: true });

	
	function createParticleNetwork(container, opts = {}) {
		if (typeof THREE === "undefined") { console.warn("THREE not loaded"); return; }
		const COUNT    = opts.count    || 120;
		const MAX_DIST = opts.maxDist  || 50;
		const COLOR    = opts.color    || 0xff3c28;
		const RR       = opts.range    || 160;

		const w = container.clientWidth, h = container.clientHeight;
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, w / h, 1, 4000);
		camera.position.z = 480;
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(w, h);
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		const group = new THREE.Group();
		scene.add(group);

		const positions = new Float32Array(COUNT * 3);
		const velocities = [];
		for (let i = 0; i < COUNT; i++) {
			positions[i*3]   = (Math.random()*2-1)*RR;
			positions[i*3+1] = (Math.random()*2-1)*RR;
			positions[i*3+2] = (Math.random()*2-1)*RR;
			velocities.push(new THREE.Vector3((Math.random()-0.5)*0.6,(Math.random()-0.5)*0.6,(Math.random()-0.5)*0.6));
		}

		const pGeo = new THREE.BufferGeometry();
		pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		const pMat = new THREE.PointsMaterial({ color: COLOR, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.9 });
		group.add(new THREE.Points(pGeo, pMat));

		const linePositions = new Float32Array(COUNT * COUNT * 6);
		const lGeo = new THREE.BufferGeometry();
		lGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
		const lMat = new THREE.LineBasicMaterial({ color: COLOR, transparent: true, opacity: 0.25 });
		group.add(new THREE.LineSegments(lGeo, lMat));

		function animate() {
			requestAnimationFrame(animate);
			for (let i = 0; i < COUNT; i++) {
				const v = velocities[i];
				positions[i*3]   += v.x;
				positions[i*3+1] += v.y;
				positions[i*3+2] += v.z;
				for (let a = 0; a < 3; a++) {
					if (positions[i*3+a] < -RR || positions[i*3+a] > RR) v.setComponent(a, -v.getComponent(a));
				}
			}
			pGeo.attributes.position.needsUpdate = true;

			let lp = 0;
			for (let i = 0; i < COUNT; i++) {
				for (let j = i + 1; j < COUNT; j++) {
					const dx = positions[i*3]-positions[j*3];
					const dy = positions[i*3+1]-positions[j*3+1];
					const dz = positions[i*3+2]-positions[j*3+2];
					if (Math.sqrt(dx*dx+dy*dy+dz*dz) < MAX_DIST) {
						linePositions[lp++]=positions[i*3];   linePositions[lp++]=positions[i*3+1]; linePositions[lp++]=positions[i*3+2];
						linePositions[lp++]=positions[j*3];   linePositions[lp++]=positions[j*3+1]; linePositions[lp++]=positions[j*3+2];
					}
				}
			}
			lGeo.setDrawRange(0, lp / 3);
			lGeo.attributes.position.needsUpdate = true;

			group.rotation.y += 0.002;
			group.rotation.x += 0.0008;
			renderer.render(scene, camera);
		}
		animate();

		window.addEventListener("resize", () => {
			const w = container.clientWidth, h = container.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		});
	}

	
	function createWaveLattice(container, opts = {}) {
		if (typeof THREE === "undefined") { console.warn("THREE not loaded"); return; }
		const COLOR = opts.color || 0x00e0ff;
		const N     = opts.grid  || 32;        
		const GAP   = opts.gap   || 10;        
		const AMP   = opts.amp   || 18;        
		const SPEED = opts.speed || 2.0;       

		const w = container.clientWidth, h = container.clientHeight;
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, w / h, 1, 4000);
		camera.position.set(0, 185, 380);
		camera.lookAt(0, 0, 0);

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(w, h);
		renderer.setClearColor(0x000000, 0);
		container.appendChild(renderer.domElement);

		const group = new THREE.Group();
		scene.add(group);

		const count = N * N;
		const positions = new Float32Array(count * 3);
		const baseX = [], baseZ = [];
		let p = 0;
		const half = (N - 1) / 2;
		for (let ix = 0; ix < N; ix++) {
			for (let iz = 0; iz < N; iz++) {
				const x = (ix - half) * GAP;
				const z = (iz - half) * GAP;
				baseX.push(x); baseZ.push(z);
				positions[p++] = x;
				positions[p++] = 0;
				positions[p++] = z;
			}
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		const mat = new THREE.PointsMaterial({ color: COLOR, size: 2.5, sizeAttenuation: true, transparent: true, opacity: 0.95 });
		group.add(new THREE.Points(geo, mat));

		const clock = new THREE.Clock();
		function animate() {
			requestAnimationFrame(animate);
			const t = clock.getElapsedTime() * SPEED;
			let i = 0;
			for (let n = 0; n < count; n++) {
				const x = baseX[n], z = baseZ[n];
				
				positions[i*3+1] = Math.sin((x + z) * 0.05 + t) * AMP;
				i++;
			}
			geo.attributes.position.needsUpdate = true;
			group.rotation.y += 0.002;
			renderer.render(scene, camera);
		}
		animate();

		window.addEventListener("resize", () => {
			const w = container.clientWidth, h = container.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		});
	}



		
	function initNextSectionReveal() {
		gsap.utils.toArray(".elig__title, .faq__title").forEach(el => {
			gsap.from(el, {
				scrollTrigger: { trigger: el, start: "top 85%" },
				opacity: 0, x: -30, duration: 0.5, ease: "power2.out"
			});
		});
		gsap.utils.toArray(".elig__list, .faq__list").forEach(list => {
			const items = list.querySelectorAll("li");
			gsap.from(items, {
				scrollTrigger: { trigger: list, start: "top 80%" },
				opacity: 0, x: -24, duration: 0.25, stagger: 0.05, ease: "steps(3)"
			});
		});
	}









	
	function init() {


		

		applyText(0);
		navImg.src = STEPS[0].img;
		introIn();

		const box1 = document.getElementById("gfxBox1");
		const box2 = document.getElementById("gfxBox2");
		if (box1) createParticleNetwork(box1, { color: 0xffffff, count: 120,  });
		if (box2) createWaveLattice(box2, { color: 0xffffff, grid: 32 });


		initNextSectionReveal();


	}
	if (document.readyState !== "loading") init();
	else document.addEventListener("DOMContentLoaded", init);


	

})();
