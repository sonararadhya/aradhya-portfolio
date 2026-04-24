/* =====================
   MAGNETIC BUTTONS
===================== */
document.addEventListener("DOMContentLoaded", () => {
   document.querySelectorAll('button, .footerBtn, .navLinks a, .magBtn').forEach(btn => {
      btn.classList.add("magnetic-btn");
      btn.addEventListener("mousemove", (e) => {
         const rect = btn.getBoundingClientRect();
         const x = e.clientX - rect.left - rect.width / 2;
         const y = e.clientY - rect.top - rect.height / 2;
         btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => {
         btn.style.transform = `translate(0px, 0px)`;
      });
   });
});

/* =====================
   PRELOADER
===================== */
window.addEventListener("load", () => {
   const preloader = document.getElementById("preloader");
   if(preloader) {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      setTimeout(() => preloader.remove(), 800);
   }
});

/* =====================
   TYPING EFFECT
===================== */
const words = [
   { text: "Full Stack Developer", color: "#FFD700" },
   { text: "AI Engineer", color: "#FF8C00" },
   { text: "Cybersecurity Enthusiast", color: "#00FFFF" },
   { text: "Software Engineer", color: "#22c55e" }
];
let i = 0, j = 0, del = false;

function type() {
   let el = document.getElementById("typing");
   if(!el) return;
   let w = words[i].text;
   el.style.color = words[i].color;
   if (!del) {
      el.textContent = w.substring(0, j++);
      if (j > w.length) { del = true; setTimeout(type, 1000); return; }
   } else {
      el.textContent = w.substring(0, j--);
      if (j == 0) { del = false; i = (i + 1) % words.length; }
   }
   setTimeout(type, del ? 50 : 90);
}
type();

/* =====================
   GSAP SCROLL REVEAL & STATS
===================== */
gsap.registerPlugin(ScrollTrigger);



// Reveal Sections
document.querySelectorAll(".section, .card, .eduCard, .workCard").forEach(el => {
   gsap.fromTo(el, 
      { opacity: 0, y: 80, scale: 0.95, rotationX: 5 },
      { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
   el.classList.add("show");
});
document.querySelectorAll(".flipScene").forEach(el => {
   gsap.fromTo(el, 
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
   el.classList.add("show");
});

// Stat Counter Animation
const statsStrip = document.querySelector(".statsStrip");
if (statsStrip) {
   ScrollTrigger.create({
      trigger: statsStrip,
      start: "top 90%",
      once: true,
      onEnter: () => {
         document.querySelectorAll(".statNum").forEach(el => {
            const target = parseFloat(el.getAttribute("data-target"));
            const decimal = parseInt(el.getAttribute("data-decimal")) || 0;
            const duration = 1400;
            let start = 0;
            const step = target / (duration / 16);
            const timer = setInterval(() => {
               start = Math.min(start + step, target);
               el.textContent = decimal > 0 ? start.toFixed(decimal) : Math.floor(start);
               if (start >= target) clearInterval(timer);
            }, 16);
         });
      }
   });
}

/* =====================
   SCROLL BUTTON
===================== */
const btn = document.getElementById("topBtn");

btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* =====================
   THEME TOGGLE
===================== */
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
   document.body.classList.toggle("light");
   toggle.innerHTML = document.body.classList.contains("light")
      ? '<i class="ri-moon-line"></i>'
      : '<i class="ri-sun-line"></i>';
};

/* =====================
   MOBILE MENU TOGGLE
===================== */
const menuBtn = document.getElementById("menuBtn");
const navLinksContainer = document.querySelector(".navLinks");

if(menuBtn && navLinksContainer) {
   menuBtn.onclick = () => {
      navLinksContainer.classList.toggle("active");
      const icon = menuBtn.querySelector("i");
      if(navLinksContainer.classList.contains("active")) {
         icon.classList.remove("ri-menu-3-line");
         icon.classList.add("ri-close-line");
      } else {
         icon.classList.remove("ri-close-line");
         icon.classList.add("ri-menu-3-line");
      }
   };

   // Close menu when clicking a link
   navLinksContainer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
         navLinksContainer.classList.remove("active");
         const icon = menuBtn.querySelector("i");
         icon.classList.remove("ri-close-line");
         icon.classList.add("ri-menu-3-line");
      });
   });
}



/* =====================
   THREE.JS COSMIC BACKGROUND & HERO 3D
===================== */
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };
let mouseDidMove = false;
document.addEventListener("mousemove", e => {
   mouse.x = e.clientX;
   mouse.y = e.clientY;
   targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
   targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
   mouseDidMove = true;
});

// BACKGROUND SCENE
const isMobile = window.innerWidth < 768;
const canvasBg = document.getElementById("particles");
const rendererBg = new THREE.WebGLRenderer({ canvas: canvasBg, alpha: true, antialias: false });
rendererBg.setSize(window.innerWidth, window.innerHeight);
rendererBg.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));

const sceneBg = new THREE.Scene();
const cameraBg = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraBg.position.z = 50;

// Circular Particle Texture
const createCircleTexture = () => {
   const c = document.createElement("canvas");
   c.width = 64; c.height = 64;
   const ctx = c.getContext("2d");
   ctx.beginPath();
   ctx.arc(32, 32, 30, 0, Math.PI * 2);
   ctx.fillStyle = "#ffffff";
   ctx.fill();
   return new THREE.CanvasTexture(c);
};

// Stars as a Sphere
const starsGeometry = new THREE.BufferGeometry();
const starsCount = isMobile ? 300 : 800;
const posArray = new Float32Array(starsCount * 3);
const origPosArray = new Float32Array(starsCount * 3);
const radiusRadius = 250;

for(let i = 0; i < starsCount; i++) {
   const i3 = i * 3;
   const rho = Math.acos(Math.random() * 2 - 1);
   const theta = Math.random() * Math.PI * 2;
   const r = Math.pow(Math.random(), 1/3) * radiusRadius;
   const x = r * Math.sin(rho) * Math.cos(theta);
   const y = r * Math.sin(rho) * Math.sin(theta);
   const z = r * Math.cos(rho);
   
   posArray[i3] = x;
   posArray[i3+1] = y;
   posArray[i3+2] = z;
   origPosArray[i3] = x;
   origPosArray[i3+1] = y;
   origPosArray[i3+2] = z;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
   size: 1.5,
   color: 0xb874fe,
   map: createCircleTexture(),
   transparent: true,
   opacity: 0.9,
   blending: THREE.AdditiveBlending,
   depthWrite: false
});
const starMesh = new THREE.Points(starsGeometry, starsMaterial);
sceneBg.add(starMesh);

// HERO 3D CENTERPIECE
const heroContainer = document.getElementById("hero-3d-container");
const sceneObj = new THREE.Scene();
const cameraObj = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
cameraObj.position.z = 10;

const rendererObj = new THREE.WebGLRenderer({ alpha: true, antialias: false });
rendererObj.setSize(window.innerWidth, window.innerHeight);
rendererObj.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
if(heroContainer) heroContainer.appendChild(rendererObj.domElement);

const geometry = new THREE.IcosahedronGeometry(isMobile ? 1.6 : 2.5, 1);
const materialSolid = new THREE.MeshStandardMaterial({
   color: 0x6366f1,
   roughness: 0.2,
   metalness: 0.8,
   transparent: true,
   opacity: 0.8
});
const object3D = new THREE.Mesh(geometry, materialSolid);
const wireframe = new THREE.LineSegments(
   new THREE.WireframeGeometry(geometry),
   new THREE.LineBasicMaterial({ color: 0xb874fe, transparent: true, opacity: 0.6 })
);
object3D.add(wireframe);
sceneObj.add(object3D);

// Lights for Hero Object
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
sceneObj.add(ambientLight);
const pointLight = new THREE.PointLight(0xa855f7, 2, 50);
pointLight.position.set(5, 5, 5);
sceneObj.add(pointLight);

// Setup GSAP scroll tied to 3D object rotation
if (typeof gsap !== 'undefined') {
   gsap.to(object3D.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
         trigger: ".hero",
         start: "top top",
         end: "bottom top",
         scrub: 1
      }
   });
}

const clock = new THREE.Clock();
let heroVisible = true;
let skillsVisible = false;
let skillsInitialized = false;

new IntersectionObserver(e => heroVisible = e[0].isIntersecting)
  .observe(document.querySelector('.hero'));

const skillsSectionObs = new IntersectionObserver(e => skillsVisible = e[0].isIntersecting);
skillsSectionObs.observe(document.getElementById('skills'));

let heroSpinning = false;
let skillsSpinning = false;
const globalRaycaster = new THREE.Raycaster();

window.addEventListener("click", (e) => {
   const nx = (e.clientX / window.innerWidth) * 2 - 1;
   const ny = -(e.clientY / window.innerHeight) * 2 + 1;
   
   if (heroVisible && typeof object3D !== 'undefined') {
      globalRaycaster.setFromCamera(new THREE.Vector2(nx, ny), cameraObj);
      const intersects = globalRaycaster.intersectObject(object3D, true);
      if (intersects.length > 0 && !heroSpinning) {
         heroSpinning = true;
         gsap.to(object3D.rotation, {
            x: object3D.rotation.x + Math.PI,
            y: object3D.rotation.y + Math.PI,
            duration: 1.2,
            ease: "power2.out",
            onComplete: () => heroSpinning = false
         });
         gsap.to(object3D.scale, {
            x: isMobile ? 1.4 : 1.3, y: isMobile ? 1.4 : 1.3, z: isMobile ? 1.4 : 1.3, duration: 0.3, yoyo: true, repeat: 1
         });
      }
   }
   
   if (skillsVisible && typeof window.skillsRenderer !== 'undefined' && window.skillsCamera) {
      const rect = document.getElementById("skills-3d-container").getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
         const stX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
         const stY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
         globalRaycaster.setFromCamera(new THREE.Vector2(stX, stY), window.skillsCamera);
         const sIntersects = globalRaycaster.intersectObject(window.skillsRenderer.gyroGroup, true);
         if (sIntersects.length > 0 && !skillsSpinning) {
            skillsSpinning = true;
            const grp = window.skillsRenderer.gyroGroup;
            gsap.to(grp.rotation, {
               x: grp.rotation.x + Math.PI,
               y: grp.rotation.y + Math.PI,
               duration: 1.2,
               ease: "power2.out",
               onComplete: () => skillsSpinning = false
            });
            const baseScale = isMobile ? 0.6 : 1;
            gsap.to(grp.scale, {
               x: baseScale * 1.4, y: baseScale * 1.4, z: baseScale * 1.4, duration: 0.3, yoyo: true, repeat: 1
            });
         }
      }
   }
});

let rafId;

function masterLoop() {
   rafId = requestAnimationFrame(masterLoop);
   const elapsedTime = clock.getElapsedTime();

   starMesh.rotation.y = elapsedTime * 0.03;
   starMesh.rotation.x = elapsedTime * 0.01;
   
   cameraBg.position.x += (targetMouse.x * 5 - cameraBg.position.x) * 0.05;
   cameraBg.position.y += (targetMouse.y * 5 - cameraBg.position.y) * 0.05;
   cameraBg.lookAt(0, 0, 0);

   if (mouseDidMove) {
      const mw = targetMouse.x * 250; 
      const mh = targetMouse.y * 250;
      const positions = starsGeometry.attributes.position.array;
      for(let i=0; i<starsCount; i++) {
           const i3 = i * 3;
           const ox = origPosArray[i3];
           const oy = origPosArray[i3+1];
           const dx = ox - mw;
           const dy = oy - mh;
           const distSq = dx*dx + dy*dy;
           if(distSq < 15000 && distSq > 0.1) {
               const dist = Math.sqrt(distSq);
               const force = (120 - dist) * 0.15;
               positions[i3] = ox + (dx/dist) * force;
               positions[i3+1] = oy + (dy/dist) * force;
           } else {
               positions[i3] += (ox - positions[i3]) * 0.1;
               positions[i3+1] += (oy - positions[i3+1]) * 0.1;
           }
      }
      starsGeometry.attributes.position.needsUpdate = true;
      mouseDidMove = false;
   }

   rendererBg.render(sceneBg, cameraBg);

   if (heroVisible && typeof heroContainer !== "undefined" && heroContainer) {
      if (!heroSpinning) {
         object3D.rotation.y += (targetMouse.x * 4 - object3D.rotation.y) * 0.1;
         object3D.rotation.x += (targetMouse.y * 4 - object3D.rotation.x) * 0.1;
         object3D.scale.setScalar(1 + Math.abs(targetMouse.x) * 0.3 + Math.abs(targetMouse.y) * 0.3);
      }
      rendererObj.render(sceneObj, cameraObj);
   }

   if (skillsVisible && typeof window.skillsRenderer !== 'undefined' && window.skillsScene && window.skillsCamera) {
      const { ring1, ring2, ring3, core, gyroGroup, rendererSk, sceneSk, cameraSk } = window.skillsRenderer;
      ring1.rotation.x += 0.01; ring1.rotation.y += 0.02;
      ring2.rotation.x -= 0.02; ring2.rotation.y += 0.01;
      ring3.rotation.z += 0.03; core.rotation.y -= 0.05;
      
      gyroGroup.position.x += (targetMouse.x * 1.5 - gyroGroup.position.x) * 0.1;
      gyroGroup.position.y += (targetMouse.y * 1.5 - gyroGroup.position.y) * 0.1;
      rendererSk.render(sceneSk, cameraSk);
   }
}

masterLoop();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(rafId);
  else masterLoop();
});


window.addEventListener("resize", () => {
   cameraBg.aspect = window.innerWidth / window.innerHeight;
   cameraBg.updateProjectionMatrix();
   rendererBg.setSize(window.innerWidth, window.innerHeight);

   cameraObj.aspect = window.innerWidth / window.innerHeight;
   cameraObj.updateProjectionMatrix();
   rendererObj.setSize(window.innerWidth, window.innerHeight);
});

/* =====================
   PROFILE TILT
===================== */
const profile = document.querySelector(".profile");
profile.addEventListener("mousemove", e => {
   const r = profile.getBoundingClientRect();
   const x = e.clientX - r.left;
   const y = e.clientY - r.top;
   profile.style.transform = `rotateX(${-(y - r.height / 2) / 12}deg) rotateY(${(x - r.width / 2) / 12}deg) scale(1.05)`;
});
profile.addEventListener("mouseleave", () => profile.style.transform = "rotateX(0) rotateY(0)");

/* =====================
   SKILLS 3D CENTERPIECE
===================== */
const skillsContainer = document.getElementById("skills-3d-container");
function initSkillsScene() {
   if(!skillsContainer) return;
   const sceneSk = new THREE.Scene();
   const cameraSk = new THREE.PerspectiveCamera(45, skillsContainer.clientWidth / skillsContainer.clientHeight, 0.1, 100);
   cameraSk.position.z = 10;
   
   const rendererSk = new THREE.WebGLRenderer({ alpha: true, antialias: false });
   rendererSk.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
   rendererSk.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
   skillsContainer.appendChild(rendererSk.domElement);
   
   const gyroGroup = new THREE.Group();
   const mat = new THREE.MeshStandardMaterial({ color: 0xec4899, wireframe: true, transparent: true, opacity: 0.8 });
   
   const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.1, 16, 100), mat);
   const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.1, 16, 100), mat);
   const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 100), mat);
   const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 0), new THREE.MeshStandardMaterial({color: 0x6366f1, metalness: 0.9}));
   
   ring2.rotation.x = Math.PI / 2;
   ring3.rotation.y = Math.PI / 2;
   
   gyroGroup.add(ring1);
   gyroGroup.add(ring2);
   gyroGroup.add(ring3);
   gyroGroup.add(core);

   if(isMobile) gyroGroup.scale.set(0.6, 0.6, 0.6);

   sceneSk.add(gyroGroup);
   
   const light2 = new THREE.PointLight(0xa855f7, 2, 50);
   light2.position.set(5, 5, 5);
   sceneSk.add(light2);

   window.skillsRenderer = { ring1, ring2, ring3, core, gyroGroup, rendererSk, sceneSk, cameraSk };
   window.skillsScene = sceneSk;
   window.skillsCamera = cameraSk;

   window.addEventListener("resize", () => {
      cameraSk.aspect = skillsContainer.clientWidth / skillsContainer.clientHeight;
      cameraSk.updateProjectionMatrix();
      rendererSk.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
   });
}

const lazySkillsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !skillsInitialized) {
    initSkillsScene();
    skillsInitialized = true;
    lazySkillsObserver.disconnect();
  }
}, { threshold: 0.1 });
if(document.getElementById('skills')) lazySkillsObserver.observe(document.getElementById('skills'));

/* =====================
   CUSTOM CURSOR & TILT
===================== */
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const cursorGlow = document.querySelector(".cursor-glow");
const spotlight = document.getElementById("spotlight");

if(cursorDot && cursorOutline && !isMobile) {
   window.addEventListener("mousemove", (e) => {
      cursorDot.style.left = e.clientX + "px";
      cursorDot.style.top = e.clientY + "px";
      
      if(spotlight) {
         spotlight.style.left = e.clientX + "px";
         spotlight.style.top = e.clientY + "px";
      }

      document.documentElement.style.setProperty('--cx', e.clientX + 'px');
      document.documentElement.style.setProperty('--cy', e.clientY + 'px');
   });

   document.body.addEventListener("mouseover", e => {
      const el = e.target.closest("a, button, .card, .flipScene, .projectCard, .workCard");
      if (el) {
         cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
         cursorOutline.style.backgroundColor = "rgba(168, 85, 247, 0.1)";
         cursorDot.style.transform = "translate(-50%, -50%) scale(0.5)";
      }
   });

   document.body.addEventListener("mouseout", e => {
      const el = e.target.closest("a, button, .card, .flipScene, .projectCard, .workCard");
      if (el) {
         cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
         cursorOutline.style.backgroundColor = "transparent";
         cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      }
   });
}

// Universal 3D Tilt
function apply3DTilt(selector) {
   if(isMobile) return;
   document.querySelectorAll(selector).forEach(card => {
      card.addEventListener("mousemove", e => {
         const r = card.getBoundingClientRect();
         const x = e.clientX - r.left;
         const y = e.clientY - r.top;
         const rotateX = -((y - r.height / 2) / r.height) * 15;
         const rotateY = ((x - r.width / 2) / r.width) * 15;
         card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
      });
      card.addEventListener("mouseleave", () => {
         card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      });
   });
}
apply3DTilt(".card, .eduCard, .workCard");

/* =====================
   NAV ACTIVE LINK ON SCROLL
===================== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navLinks a");

let scrollTicking = false;
window.addEventListener("scroll", () => {
   if (scrollTicking) return;
   scrollTicking = true;
   requestAnimationFrame(() => {
      if(btn) btn.style.display = window.scrollY > 300 ? "flex" : "none";
      
      let current = "";
      sections.forEach(section => {
         const sectionTop = section.offsetTop - 150;
         if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
         }
      });
      navLinks.forEach(link => {
         link.classList.remove("active");
         if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
         }
      });
      scrollTicking = false;
   });
});

/* =====================
   SUPABASE VISITOR TRACKING
===================== */
const SUPABASE_URL = "https://lqkzhyoqkjnumwqbiqyk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxa3poeW9xa2pudW13cWJpcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTYwMTQsImV4cCI6MjA4OTQ3MjAxNH0.ZUkFn9xAMMctNfNa8Lmv0XXAXAIxwRLxz1Nltf-Y-sk";

async function sendVisitorData() {
   try {
      let country = "Unknown";
      try {
         const geo = await fetch("https://ipapi.co/json/").then(res => res.json());
         country = geo.country_name;
      } catch (e) {
         console.log("Geo failed");
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Prefer": "return=minimal"
         },
         body: JSON.stringify({
            device: getDeviceType(),
            browser: await getBrowser(),
            os: navigator.userAgentData?.platform || navigator.platform || "Unknown",
            page: window.location.pathname,
            country: country,
            created_at: new Date().toISOString()
         })
      });
      if (res.ok) {
         console.log("Visitor stored ✅");
      } else {
         console.error(await res.text());
      }
   } catch (err) {
      console.error("Supabase Error:", err);
   }
}

window.addEventListener("load", () => {
   console.log("Page loaded 🚀");
   sendVisitorData();
/* =====================
   CONTACT WATER RIPPLE EFFECT 
===================== */
// Real-world water surface tension shader using jquery.ripples
if (typeof jQuery !== 'undefined' && $.fn.ripples) {
   $('#contact').ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
      interactive: true,
      crossOrigin: "anonymous"
   });
   
   // Keep ripples contained smoothly within the dark space backdrop
   $('#contact').css('background-image', 'url("https://images.unsplash.com/photo-1534796636912-3652f50411a5?q=80&w=2000&auto=format&fit=crop")');
}
});

/* =====================
   DEVICE + BROWSER DETECTION
===================== */
function getDeviceType() {
   const ua = navigator.userAgent;
   if (/android/i.test(ua)) return "Android Phone";
   if (/iPhone|iPad|iPod/i.test(ua)) return "iOS Device";
   if (/Windows/i.test(ua)) return "Windows Laptop/Desktop";
   if (/Mac/i.test(ua)) return "MacBook / iMac";
   if (/Linux/i.test(ua)) return "Linux Laptop/Desktop";
   return "Unknown Device";
}

async function getBrowser() {
   const ua = navigator.userAgent;
   if (navigator.brave && await navigator.brave.isBrave()) { return "Brave"; }
   if (ua.includes("Edg")) return "Microsoft Edge";
   if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
   if (ua.includes("Firefox")) return "Firefox";
   if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
   if (ua.includes("Chrome")) return "Chrome";
   return "Unknown Browser";
}

/* =====================
   GITHUB PROJECTS LOADER
===================== */
const githubUser = "sonararadhya";
const projectsGrid = document.getElementById("projectsGrid");

async function loadProjects() {
   try {
      const res = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated`);
      const repos = await res.json();

      repos
         .filter(repo => !repo.fork && !['sonararadhya', 'Laptop-settings'].includes(repo.name))
         .sort((a, b) => b.stargazers_count - a.stargazers_count)
         .slice(0, 8)
         .forEach(repo => {
            const card = document.createElement("div");
            card.className = "projectCard";
            card.innerHTML = `
<img class="projectImage" src="https://opengraph.githubassets.com/1/${githubUser}/${repo.name}" onerror="this.src='Images/profile1.jpg'" alt="Preview" loading="lazy">
<h3>${repo.name}</h3>
<p>${repo.description || "Project repository"}</p>
<div class="tech">
${repo.language || ""}
⭐ ${repo.stargazers_count}
</div>`;
            card.onclick = () => window.open(repo.html_url, "_blank");
            projectsGrid.appendChild(card);
            
            gsap.fromTo(card,
               { opacity: 0, y: 50, scale: 0.95, rotationX: 10 },
               { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, ease: "power3.out",
                 scrollTrigger: { trigger: card, start: "top 85%", once: true } 
               }
            );
            card.classList.add("show");
         });

         // Apply universal tilt to newly injected project cards
         setTimeout(() => apply3DTilt(".projectCard"), 100);
   } catch (err) {
      projectsGrid.innerHTML = "<p>Failed to load projects</p>";
   }
}
loadProjects();


/* =====================
   UNIVERSAL TEXT HOVER REACT
===================== */
document.addEventListener("DOMContentLoaded", () => {
   if (isMobile) return;
   const texts = document.querySelectorAll('h1, h2, h3, p, li, span');
   texts.forEach(el => {
      // Don't apply to icons, buttons, or extremely large containers
      if(el.closest('button') || el.closest('a') || el.classList.contains('devicon') || el.classList.contains('ri')) return;
      if(el.children.length > 1) return; // Only process leaf elements mostly
      
      el.classList.add('text-react');
      
      let rect, isInside;
      el.addEventListener('mouseenter', (e) => {
         isInside = true;
         rect = el.getBoundingClientRect();
      });
      el.addEventListener('mousemove', (e) => {
         if(!isInside) return;
         const x = e.clientX - rect.left - rect.width / 2;
         const y = e.clientY - rect.top - rect.height / 2;
         
         // Subtle shift & tiny scale
         el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) scale(1.02)`;
         el.style.textShadow = `${-x * 0.15}px ${-y * 0.15}px 10px var(--cursor-glow)`;
      });
      el.addEventListener('mouseleave', () => {
         isInside = false;
         el.style.transform = 'translate(0px, 0px) scale(1)';
         el.style.textShadow = 'none';
      });
   });
});

/* =====================
   CERTIFICATES RENDERING (PDF.JS + VANILLA TILT)
===================== */
const certData = {
   "CORE TECHNICAL CERTIFICATIONS": [
      "Android using Kotlin.pdf", "Bootstrap.pdf", "C & CPP.pdf", 
      "C LANG.pdf", "CPP ADVANCE.pdf", "CPP_TEST.pdf", 
      "CYBER SANSKAR WORKSHOP.pdf", "LINUX Programme.pdf", "LINUX TEST.pdf", 
      "NodeJS Bootcamp.pdf", "PHP MYSQL.pdf", "R Programming.pdf"
   ],
   "SUPPORTING TECHNICAL CERTIFICATIONS": [
      "Android.pdf", "CSS, JAVASCRIPT AND PYTHON.pdf", "Cyber Crime Analyst.pdf", 
      "Cyber Forensics Investigator.pdf", "FULL STACK.pdf", "Hackerrank javascript.pdf", 
      "JAVA.pdf", "Javascript.pdf", "PHP.pdf", "Python and Flask.pdf", "ReactJS.pdf"
   ],
   "EXTRACURRICULAR AND NON-TECHNICAL CERTIFICATIONS": [
      "ARTICLE WRITING RANK 3.pdf", "CQUIZ.pdf", "PHOTOGRAPHY RANK 1.pdf", 
      "POEM WRITING.pdf", "POSTER PRESENTATION.pdf", "Photography.pdf", 
      "QUIZ.pdf", "QuizSci.pdf", "Speech.pdf"
   ]
};

const certGrid = document.getElementById("certificatesGrid");
const certLoader = document.getElementById("certLoader");
const certTabs = document.querySelectorAll(".certTab");

// Setup PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
   pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

async function renderCertificates(category) {
   if (!certGrid || typeof pdfjsLib === 'undefined') return;
   
   // Clear grid and show loader
   certGrid.innerHTML = '';
   certLoader.style.display = 'block';
   
   const files = certData[category] || [];
   const basePath = `CERTIFICATES/${category}/`;

   // Create an IntersectionObserver for lazy rendering PDFs
   const pdfObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            const canvas = entry.target;
            const file = canvas.getAttribute("data-file");
            const basePath = canvas.getAttribute("data-basepath");
            
            // Stop observing once we start rendering
            observer.unobserve(canvas);
            
            // Render the PDF
            (async () => {
               try {
                  const loadingTask = pdfjsLib.getDocument(basePath + file);
                  const pdf = await loadingTask.promise;
                  const page = await pdf.getPage(1);
                  
                  // Reduced scale from 1.5 to 0.8 for massive memory/CPU savings
                  const viewport = page.getViewport({ scale: 0.8 });
                  const context = canvas.getContext("2d");
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;

                  const renderContext = {
                     canvasContext: context,
                     viewport: viewport
                  };
                  await page.render(renderContext).promise;
                  
                  // CRITICAL: Cleanup memory after rendering!
                  page.cleanup();
                  pdf.destroy();
               } catch (err) {
                  console.error("Error rendering PDF:", file, err);
                  const wrap = canvas.parentElement;
                  if(wrap) wrap.innerHTML = "<p style='color: #888; font-size: 12px; text-align: center;'>Preview not available</p>";
               }
            })();
         }
      });
   }, { rootMargin: "200px 0px", threshold: 0.01 });

   for (const file of files) {
      try {
         // Create DOM elements
         const card = document.createElement("div");
         card.className = "certCard";
         card.setAttribute("data-tilt", "");
         card.setAttribute("data-tilt-max", "10");
         card.setAttribute("data-tilt-speed", "400");
         card.setAttribute("data-tilt-glare", "true");
         card.setAttribute("data-tilt-max-glare", "0.3");

         const canvasWrap = document.createElement("div");
         canvasWrap.className = "certCanvasWrap";
         
         const canvas = document.createElement("canvas");
         // SEO / Accessibility
         canvas.setAttribute("aria-label", `Aradhya Sonar Certificate: ${file.replace(".pdf", "")}`);
         canvas.setAttribute("title", `Aradhya Sonar Certificate: ${file.replace(".pdf", "")}`);
         canvas.setAttribute("data-file", file);
         canvas.setAttribute("data-basepath", basePath);
         
         canvasWrap.appendChild(canvas);

         const title = document.createElement("div");
         title.className = "certTitle";
         title.textContent = file.replace(".pdf", "");

         const overlay = document.createElement("div");
         overlay.className = "certViewOverlay";
         const viewBtn = document.createElement("a");
         viewBtn.href = basePath + file;
         viewBtn.target = "_blank";
         viewBtn.textContent = "View Full PDF";
         viewBtn.setAttribute("aria-label", `View full PDF of ${file.replace(".pdf", "")}`);
         overlay.appendChild(viewBtn);

         card.appendChild(canvasWrap);
         card.appendChild(title);
         card.appendChild(overlay);
         
         certGrid.appendChild(card);

         // Observe canvas for lazy loading
         pdfObserver.observe(canvas);

      } catch (err) {
         console.error("Error setting up card:", err);
      }
   }
   
   // Hide loader once setup is done
   certLoader.style.display = 'none';

   // Initialize VanillaTilt if available
   if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".certCard"));
   }
   
   // Animate cards entry using GSAP
   if (typeof gsap !== 'undefined') {
      gsap.fromTo(".certCard", 
         { opacity: 0, y: 40, scale: 0.95 },
         { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
   }
}

// Tab Switching Logic
certTabs.forEach(tab => {
   tab.addEventListener("click", () => {
      // Remove active class from all tabs
      certTabs.forEach(t => t.classList.remove("active"));
      // Add active to clicked
      tab.classList.add("active");
      
      const category = tab.getAttribute("data-category");
      renderCertificates(category);
   });
});

// Load default category using IntersectionObserver
let certsInitialized = false;
const certSectionObs = new IntersectionObserver((entries) => {
   if (entries[0].isIntersecting && !certsInitialized) {
      certsInitialized = true;
      renderCertificates("CORE TECHNICAL CERTIFICATIONS");
      certSectionObs.disconnect();
   }
}, { threshold: 0.1 });

const certSection = document.getElementById("certificates");
if (certSection) {
   certSectionObs.observe(certSection);
}
