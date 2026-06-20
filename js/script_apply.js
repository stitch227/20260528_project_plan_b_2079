/* ==============================================
   
   ============================================== */


/* ==============================================
   1) DIALOG GATE
   ============================================== */

(function () {

	const dialogBox = document.getElementById('applyDialogBox');
	const dbInner   = dialogBox ? dialogBox.querySelector('.db-inner') : null;
	const dbBody    = document.getElementById('applyDbBody');
	const dbBtn     = document.getElementById('applyDbBtn');
	const dialogSec = document.getElementById('applyDialogSection');
	const stepper   = document.getElementById('migrationStepper');

	if (!dialogBox) return; // 이 페이지에 다이얼로그가 없으면 그냥 종료

	const DIALOG_TEXT = 'SHALL WE LEAVE FOR THE RED EARTH?';

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

	function runDialogAnimation() {
		gsap.to(dialogBox, {
			scaleX: 1,
			opacity: 1,
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

	/* 페이지 로드 즉시 실행 (스크롤 트리거 없음) */
	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', runDialogAnimation);
	} else {
		runDialogAnimation();
	}

	dbBtn.addEventListener('click', () => {
		gsap.to(dialogBox, {
			scaleX: 0,
			opacity: 0,
			duration: 0.5,
			ease: 'power3.in',
			transformOrigin: 'center center',
			onComplete: () => {
				gsap.to(dialogSec, {
					height: 0,
					duration: 0.4,
					ease: 'power2.inOut',
					onComplete: () => {
						dialogSec.style.display = 'none';
						stepper.style.display = 'block';
						stepper.classList.add('ms-revealed');
						stepper.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				});
			}
		});
	});

})();


/* ==============================================
   2) MIGRATION PROCESS STEPPER
   ============================================== */

(function () {

	/* ---- inline SVG icon set (no external icon font needed) ---- */
	/* each icon is a 24x24 outline svg, stroke="currentColor" so it inherits --mars / text color */

	const ICON = {
		file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
		idcard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M5 17c.5-1.8 1.8-3 3.5-3s3 1.2 3.5 3"/><path d="M15 9h4"/><path d="M15 13h4"/></svg>',
		clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 12l2 2 4-4"/></svg>',
		clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
		heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-10-9.3C.6 8.2 2.4 4.5 6 4c2-.3 3.7.8 6 3.2C14.3 4.8 16 3.7 18 4c3.6.5 5.4 4.2 4 7.7C19.5 16.4 12 21 12 21z"/></svg>',
		bone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l10-10"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="5.5" r="2"/></svg>',
		radiation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 3v5"/><path d="M5.6 18.5l4.3-2.6"/><path d="M18.4 18.5l-4.3-2.6"/></svg>',
		balance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 8l-3 5a4 4 0 0 0 6 0z"/><path d="M19 8l-3 5a4 4 0 0 0 6 0z"/><path d="M5 8h14"/></svg>',
		clipboard2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>',
		mood: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 15h6"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>',
		message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
		pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2 7 4-14 2 7h6"/></svg>',
		exchange: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/></svg>',
		home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/></svg>',
		signature: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c2-1 3.5-3 4-5 .4 2 1.5 4 3 4s2-2 2.5-4c.5 2 2 4.5 4 4.5s3-2 3.5-4"/><path d="M3 21h18"/></svg>',
		check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
		megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M14 8a3 3 0 0 1 0 7"/><path d="M17 4a8 8 0 0 1 0 15"/></svg>',
		seat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v9a2 2 0 0 0 2 2h8"/><path d="M6 13H4v6h16v-6h-2"/><path d="M9 19v2"/><path d="M15 19v2"/></svg>',
		list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>'
	};

	/* ---- step data : 행정 절차 톤으로 재작성 ---- */

	const STEPS = [
		{
			title: "APPLICATION & ELIGIBILITY REVIEW",
			duration: "~30 min online · review 14 business days",
			desc: "Submit your application and supporting documents for eligibility review. Applicants are evaluated against baseline criteria — age, health history, and professional background — before advancing to medical screening.",
			items: [
				[ICON.file, "Application form"],
				[ICON.idcard, "Citizenship documentation"],
				[ICON.clipboard, "Eligibility questionnaire"],
				[ICON.clock, "Review: 14 business days"]
			]
		},
		{
			title: "MEDICAL CERTIFICATION",
			duration: "2–3 days · on-site",
			desc: "A comprehensive medical evaluation to determine fitness for spaceflight and extended low-gravity habitation, following the same physical standard required for long-duration orbital missions.",
			items: [
				[ICON.heart, "Cardiovascular assessment"],
				[ICON.bone, "Bone density scan"],
				[ICON.radiation, "Radiation exposure review"],
				[ICON.balance, "Vestibular &amp; motion tolerance"]
			]
		},
		{
			title: "PSYCHOLOGICAL EVALUATION",
			duration: "1–2 days",
			desc: "Standardized psychological and psychiatric screening to assess suitability for long-duration isolation and confined-environment living, including structured interviews and stress-response testing.",
			items: [
				[ICON.mood, "Psychiatric screening"],
				[ICON.clipboard2, "Isolation tolerance assessment"],
				[ICON.message, "Structured interview"],
				[ICON.pulse, "Stress-response evaluation"]
			]
		},
		{
			title: "VISA, MANIFEST & ASSET DECLARATION",
			duration: "3–6 weeks",
			desc: "Issuance of Mars residency authorization and processing of your transit manifest. Earth-based financial holdings are declared and processed for transfer in accordance with off-Earth settlement regulations.",
			items: [
				[ICON.idcard, "Residency authorization issued"],
				[ICON.exchange, "Asset declaration &amp; transfer"],
				[ICON.home, "Housing allocation confirmed"],
				[ICON.signature, "Transit agreement signed"]
			]
		},
		{
			title: "FINAL CLEARANCE & LAUNCH ASSIGNMENT",
			duration: "launch window confirmed 60 days prior",
			desc: "Final medical and administrative clearance. Seat allocation and launch manifest are confirmed. Departure briefing covers mission timeline, safety procedures, and arrival protocol.",
			items: [
				[ICON.check, "Final medical clearance"],
				[ICON.megaphone, "Pre-launch briefing"],
				[ICON.seat, "Seat allocation confirmed"],
				[ICON.list, "Launch manifest finalized"]
			]
		}
	];

	let current = 0;

	const railEl = document.getElementById("msRail");
	const detailEl = document.getElementById("msDetail");
	const fillEl = document.getElementById("msFill");
	const pctEl = document.getElementById("msPct");
	const prevBtn = document.getElementById("msPrev");
	const nextBtn = document.getElementById("msNext");

	if (!railEl || !detailEl) return; // stepper not on this page

	function renderRail() {
		railEl.innerHTML = STEPS.map((s, i) => {
			const state = i < current ? "done" : (i === current ? "active" : "");
			const num = String(i + 1).padStart(2, "0");
			const bubble = i < current ? ICON.check : num;
			return (
				'<div class="ms-node ' + state + '" data-i="' + i + '">' +
					'<div class="ms-line"></div>' +
					'<div class="ms-bub">' + bubble + '</div>' +
					'<div class="ms-nlabel">' + s.title.replace(/&amp;/g, "&") + '</div>' +
				'</div>'
			);
		}).join("");

		railEl.querySelectorAll(".ms-node").forEach((node) => {
			node.addEventListener("click", () => {
				current = parseInt(node.dataset.i, 10);
				render();
			});
		});
	}

	function renderDetail() {
		const s = STEPS[current];
		const itemsHTML = s.items.map(
			(it) => '<div class="ms-it"><span class="ms-it-icon">' + it[0] + '</span>' + it[1].replace(/&amp;/g, "&") + '</div>'
		).join("");

		detailEl.innerHTML =
			'<div class="ms-dnum">' + String(current + 1).padStart(2, "0") + '</div>' +
			'<div class="ms-dtag">STEP ' + (current + 1) + ' OF ' + STEPS.length + '</div>' +
			'<h3 class="ms-dtitle">' + s.title.replace(/&amp;/g, "&") + '</h3>' +
			'<span class="ms-ddur">' + ICON.clock + s.duration + '</span>' +
			'<p class="ms-dp">' + s.desc + '</p>' +
			'<div class="ms-items">' + itemsHTML + '</div>' +
			'<div class="ms-ph">[ image &middot; ' + s.title.toLowerCase().replace(/&amp;/g, "&") + ' ]</div>';
	}

	function render() {
		renderRail();
		renderDetail();

		const pct = Math.round((current / (STEPS.length - 1)) * 100);
		fillEl.style.width = pct + "%";
		pctEl.textContent = "STEP " + (current + 1) + " / " + STEPS.length;

		prevBtn.disabled = current === 0;
		nextBtn.textContent = current === STEPS.length - 1 ? "APPLY →" : "NEXT STEP →";
	}

	prevBtn.addEventListener("click", () => {
		if (current > 0) {
			current--;
			render();
		}
	});

	nextBtn.addEventListener("click", () => {
		if (current === STEPS.length - 1) {
			goToFarewell();
		} else {
			current++;
			render();
		}
	});

	function goToFarewell() {
		const stepperEl = document.getElementById("migrationStepper");
		const farewellEl = document.getElementById("farewellSection");

		gsap.to(stepperEl, {
			opacity: 0,
			y: -16,
			duration: 0.4,
			ease: "power2.inOut",
			onComplete: () => {
				stepperEl.style.display = "none";
				farewellEl.style.display = "block";
				gsap.fromTo(
					farewellEl,
					{ opacity: 0, y: 16 },
					{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
				);
				farewellEl.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	}

	const saveBtn = document.getElementById("msSaveBtn");

	function saveDraft() {
		try {
			const payload = {
				stepIndex: current,
				savedAt: new Date().toISOString()
			};
			localStorage.setItem("planb_application_draft", JSON.stringify(payload));

			saveBtn.textContent = "SAVED";
			saveBtn.classList.add("ms-saved");
			setTimeout(() => {
				saveBtn.textContent = "SAVE";
				saveBtn.classList.remove("ms-saved");
			}, 1500);
		} catch (e) {}
	}

	saveBtn.addEventListener("click", saveDraft);

	try {
		const draft = localStorage.getItem("planb_application_draft");
		if (draft) {
			const parsed = JSON.parse(draft);
			if (typeof parsed.stepIndex === "number") {
				current = parsed.stepIndex;
			}
		}
	} catch (e) {}

	render();

})();







(function () {

	const farewellEl = document.getElementById("farewellSection");
	const successEl  = document.getElementById("successSection");
	const textareaEl = document.getElementById("farewellText");
	const submitBtn  = document.getElementById("farewellSubmitBtn");
	const skipBtn    = document.getElementById("farewellSkipBtn");

	if (!farewellEl || !successEl) return;

	function saveFarewellMessage(message) {
		try {
			const payload = {
				message: message || "",
				submittedAt: new Date().toISOString()
			};
			localStorage.setItem("planb_farewell_message", JSON.stringify(payload));
		} catch (e) {}
	}

	function goToSuccess() {
		gsap.to(farewellEl, {
			opacity: 0,
			y: -16,
			duration: 0.4,
			ease: "power2.inOut",
			onComplete: () => {
				farewellEl.style.display = "none";
				successEl.style.display = "block";
				gsap.fromTo(
					successEl,
					{ opacity: 0, y: 16 },
					{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
				);
				successEl.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	}

	submitBtn.addEventListener("click", () => {
		saveFarewellMessage(textareaEl.value.trim());
		goToSuccess();
	});

	skipBtn.addEventListener("click", () => {
		saveFarewellMessage("");
		goToSuccess();
	});

})();
