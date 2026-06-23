

gsap.registerPlugin(ScrollTrigger);


const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp  = (a, b, t) => a + (b - a) * t;



function setupIntro() {
  const intro = document.getElementById("intro");
  if (!intro) return;

  
  gsap.to(intro.children, {
    opacity: 1,
    y: 0,
    duration: 1.4,
    stagger: 0.18,
    ease: "power2.out",
    delay: 0.2,
  });
}



const MOTION_DATA = [
  {
    src: "https://cdn.midjourney.com/video/17fda181-5634-4717-b48d-79b43f72ba89/3.mp4",
    title: "Mars ID Card",
    sub: "Issued the moment you arrive, this card carries your new identity on Mars — yet etched on its back are the coordinates of the home you left, a quiet reminder of where you began.",
    speed: 2,
  },
  {
    src: "https://cdn.midjourney.com/video/98cd11aa-e8d9-4b50-b31e-95d88770e201/1.mp4",
    title: "Space Supplement",
    sub: "Mars's vertical farming facilities supply most dietary needs, but certain nutrients — such as omega-3s typically sourced from fish — remain difficult to produce locally. This daily capsule fills that gap.",
    startTime:0.2, endTime: 5.0,
  },
  {
    src: "https://cdn.midjourney.com/video/c1c58191-fe1c-488a-b8d9-1de755797aba/2.mp4",
    title: "Earthy Scent Diffuser Set",
    sub: "A compact diffuser cartridge releasing botanical scents — pine, sea salt, rain-soaked soil — formulated to ease adjustment to Mars's sealed-air environments.",
    startTime: 0.2, endTime: 3.95,
  },
  {
    src: "https://cdn.midjourney.com/video/85f66242-199a-4081-95a5-a51cda521560/0.mp4",
    title: "Terra Blue Projector",
    sub: "Projects a live scenery of Earth's blue — its oceans, clouds, and shifting light — rarely glimpsed against the red landscapes of Mars. Designed for habitation units without exterior viewports.",
  },
  {
    src: "https://cdn.midjourney.com/video/e58fc77c-aba0-47d5-83db-aad85d0f9074/2.mp4",
    title: "Heritage Seed Packet",   // ← placeholder 이름, 나중에 교체
    sub: "A small selection of seeds — vegetables and wildflowers — compatible with your unit's indoor growing pod. Includes basic planting instructions for low-gravity soil trays.",
  },
];



function setupMotion() {
  const groupEl = document.getElementById("text-group");
  const titleEl = document.getElementById("project-title");
  const subEl   = document.getElementById("project-subtitle");
  const pin     = document.getElementById("stack-pin");
  const spacer  = document.getElementById("stack-spacer");
  const total   = MOTION_DATA.length;

  const cardW = Math.min(innerWidth * 0.47, 700);
  const cardH = cardW * (2 / 3);

  spacer.style.height = `${(total + 3) * 100}vh`;

  
  const wraps = MOTION_DATA.map((data) => {
    const wrap = document.createElement("div");
    wrap.classList.add("motion-card-wrap");
    wrap.style.width  = cardW + "px";
    wrap.style.height = cardH + "px";

    let media;
    if (data.src.endsWith(".mp4")) {
      media              = document.createElement("video");
      media.src          = data.src;
      media.muted        = true;
      media.playsInline  = true;
      media.preload      = "auto";
      media.playbackRate = data.speed || 1.0;

      const hasRange = data.startTime !== undefined || data.endTime !== undefined;
      const st       = data.startTime ?? 0;
      const et       = data.endTime;
      media.loop = !hasRange;

      const tryPlay = () => {
        if (st > 0) media.currentTime = st;
        media.play().catch(() => {
          window.addEventListener("pointerdown", () => {
            if (st > 0) media.currentTime = st;
            media.play();
          }, { once: true });
        });
      };
      if (media.readyState >= 2) tryPlay();
      else media.addEventListener("canplay", tryPlay, { once: true });

      if (hasRange) {
        const loopGuard = () => {
          if (et !== undefined && media.currentTime >= et) {
            media.currentTime = st;
            if (media.paused) media.play().catch(() => {});
          }
          requestAnimationFrame(loopGuard);
        };
        requestAnimationFrame(loopGuard);
      }
    } else {
      media     = document.createElement("img");
      media.src = data.src;
      media.alt = data.title || "";
    }

    media.style.width     = "100%";
    media.style.height    = "100%";
    media.style.objectFit = "cover";

    wrap.appendChild(media);
    pin.appendChild(wrap);
    return { wrap, img: media, data };
  });

  /* ── ScrollTrigger ── */
  ScrollTrigger.create({
    trigger: "#stack-spacer",
    start:   "top top",
    end:     "bottom bottom",
    scrub:   true,
    pin:     "#stack-pin",

    onUpdate(self) {
      const raw    = self.progress * (total + 2) - 1;
      const active = clamp(raw, -1, total + 1);

      wraps.forEach(({ wrap, img }, i) => {
        const diff = i - active;
        let translateY, rotateX, scaleX, opacity;

        if (diff >= 0) {
          const t    = clamp(diff, 0, 1);
          translateY = lerp(0,   cardH * 1.1, t);
          rotateX    = lerp(0,  -35,           t);
          scaleX     = lerp(1,   0.88,          t);
          opacity    = lerp(1,   0.0, clamp(diff - 0.5, 0, 1));
          if (diff > 1.5) opacity = 0;
        } else {
          const t    = clamp(-diff, 0, 1);
          translateY = lerp(0, -cardH * 1.0, t);
          rotateX    = lerp(0,  42,           t);
          scaleX     = lerp(1,  0.82,          t);
          opacity    = lerp(1,  0, clamp(t - 0.3, 0, 1));
          if (-diff > 1.5) opacity = 0;
        }

        wrap.style.transform =
          `translateY(${translateY}px) rotateX(${rotateX}deg) scaleX(${scaleX})`;
        wrap.style.opacity = opacity;
        wrap.style.zIndex  = total - Math.abs(diff * 2 | 0);

        img.style.transform = `translateY(${clamp(diff * 8, -10, 10)}%)`;
      });

      /* ── 텍스트 그룹 ── */
      const textActive = clamp(raw, 0, total - 0.01);
      const showIdx    = clamp(Math.round(textActive), 0, total - 1);
      const showData   = MOTION_DATA[showIdx];

      if (showData) {
        titleEl.textContent = showData.title;
        subEl.textContent   = showData.sub;
      }

      const tDiff = showIdx - textActive;
      let tY, tRotX, tScaleX, tOpacity;

      if (tDiff >= 0) {
        const t  = clamp(tDiff, 0, 1);
        tY       = lerp(0,   cardH * 1.1, t);
        tRotX    = lerp(0,  -35,           t);
        tScaleX  = lerp(1,   0.88,          t);
        tOpacity = lerp(1,   0.0, clamp(tDiff - 0.1, 0, 1));
        if (tDiff > 1.5) tOpacity = 0;
      } else {
        const t  = clamp(-tDiff, 0, 1);
        tY       = lerp(0, -cardH * 1.0, t);
        tRotX    = lerp(0,  42,           t);
        tScaleX  = lerp(1,  0.82,          t);
        tOpacity = lerp(1,  0, clamp(t - 0.05, 0, 1));
        if (-tDiff > 1.5) tOpacity = 0;
      }

      gsap.set(groupEl, {
        y: tY, rotateX: tRotX, scaleX: tScaleX, opacity: tOpacity,
        transformPerspective: 800,
      });
    },
  });

  
  wraps.forEach(({ wrap }, i) => {
    const diff = i + 1;
    const t    = clamp(diff, 0, 1);
    wrap.style.transform =
      `translateY(${lerp(0, cardH * 1.1, t)}px) rotateX(${lerp(0, -35, t)}deg) scaleX(${lerp(1, 0.88, t)})`;
    wrap.style.opacity = diff > 1.5 ? 0 : lerp(1, 0.0, clamp(diff - 0.5, 0, 1));
    wrap.style.zIndex  = total - Math.abs(diff * 2 | 0);
  });

  if (MOTION_DATA[0]) {
    titleEl.textContent = MOTION_DATA[0].title;
    subEl.textContent   = MOTION_DATA[0].sub;
    gsap.set(groupEl, { y: cardH * 1.1, rotateX: -35, scaleX: 0.88, opacity: 0, transformPerspective: 800 });
  }
}



function showMotionUI(show) {
  ["motion-sidebar", "earth-hud", "btn-up"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("visible", show);
  });
  
  EARTH.setActive(show);
}

ScrollTrigger.create({
  trigger: "#section-motion",
  start: "top 60%",
  end: "bottom bottom",
  onEnter:     () => showMotionUI(true),
  onLeave:     () => showMotionUI(false),
  onLeaveBack: () => showMotionUI(false),
  onEnterBack: () => showMotionUI(true),
});



function scrollToTop() {
  if (window.lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(0, { duration: 2.0 });
  } else if (gsap.plugins && gsap.plugins.scrollTo) {
    gsap.to(window, { duration: 2.0, scrollTo: 0, ease: "power2.inOut" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}



const EARTH = (() => {
  const COLOR = 0x13fbf7;
  let renderer, scene, camera, globe, ring1, ring2, dots, raf, active = false;

  function init() {
    const canvas = document.getElementById("earth-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    const size = canvas.clientWidth || 280;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size, false);

    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    
    const geo = new THREE.SphereGeometry(1.5, 32, 24);
    const wire = new THREE.WireframeGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: COLOR, transparent: true, opacity: 0.55 });
    globe = new THREE.LineSegments(wire, mat);
    scene.add(globe);

    
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x021014, transparent: true, opacity: 0.85 });
    const inner = new THREE.Mesh(new THREE.SphereGeometry(1.46, 32, 24), innerMat);
    scene.add(inner);

    
    const glowMat = new THREE.MeshBasicMaterial({
      color: COLOR, transparent: true, opacity: 0.06, side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.85, 32, 24), glowMat);
    scene.add(glow);

    
    ring1 = makeRing(2.0, 2.05);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 1.1;
    scene.add(ring1);

    ring2 = makeRing(2.0, 2.05);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -1.1;
    scene.add(ring2);

    
    const dotGeo = new THREE.BufferGeometry();
    const N = 60, arr = [];
    for (let i = 0; i < N; i++) {
      const r = 2.4 + Math.random() * 0.6;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3;
      arr.push(Math.cos(a) * r, y, Math.sin(a) * r);
    }
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({
      color: COLOR, size: 0.03, transparent: true, opacity: 0.5,
    }));
    scene.add(dots);

    window.addEventListener("resize", onResize);
    onResize();
    animate();
  }

  function makeRing(inner, outer) {
    const g = new THREE.RingGeometry(inner, outer, 64);
    const m = new THREE.MeshBasicMaterial({
      color: COLOR, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
    });
    return new THREE.Mesh(g, m);
  }

  function onResize() {
    const canvas = document.getElementById("earth-canvas");
    if (!canvas || !renderer) return;
    const size = canvas.clientWidth || 280;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    if (!active) return;
    if (globe) globe.rotation.y += 0.004;
    if (dots)  dots.rotation.y  -= 0.0015;
    if (ring1) ring1.rotation.z += 0.006;
    if (ring2) ring2.rotation.z -= 0.006;
    renderer.render(scene, camera);
  }

  return {
    init,
    setActive(v) { active = v; if (v && renderer) renderer.render(scene, camera); },
  };
})();



let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});




const lenis = new Lenis({
  lerp: 0.1,          
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


setupIntro();
setupMotion();
EARTH.init();
