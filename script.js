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
   { text: "Data Analyst", color: "#a855f7" },
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
   THEME TOGGLE WITH LOCALSTORAGE PERSISTENCE
===================== */
const toggle = document.getElementById("themeToggle");
if (toggle) {
   const savedTheme = localStorage.getItem("theme");
   if (savedTheme === "light") {
      document.body.classList.add("light");
      toggle.innerHTML = '<i class="ri-moon-line"></i>';
   }
   toggle.onclick = () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      toggle.innerHTML = isLight
         ? '<i class="ri-moon-line"></i>'
         : '<i class="ri-sun-line"></i>';
   };
}

/* =====================
   MOBILE MENU TOGGLE
===================== */
const menuBtn = document.getElementById("menuBtn");
const navLinksContainer = document.querySelector(".navLinks");

if(menuBtn && navLinksContainer) {
   const closeMenuBtn = document.getElementById("closeMenuBtn");
   const menuOverlay = document.getElementById("menuOverlay");
   
   const toggleMenu = () => {
      navLinksContainer.classList.toggle("active");
      if(menuOverlay) menuOverlay.classList.toggle("active");
      
      const isActive = navLinksContainer.classList.contains("active");
      menuBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
      
      const icon = menuBtn.querySelector("i");
      if(isActive) {
         icon.classList.remove("ri-menu-3-line");
         icon.classList.add("ri-close-line");
      } else {
         icon.classList.remove("ri-close-line");
         icon.classList.add("ri-menu-3-line");
      }
   };

   menuBtn.onclick = toggleMenu;
   if(closeMenuBtn) closeMenuBtn.onclick = toggleMenu;
   if(menuOverlay) menuOverlay.onclick = toggleMenu;

   // Close menu when clicking a link
   navLinksContainer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
         navLinksContainer.classList.remove("active");
         if(menuOverlay) menuOverlay.classList.remove("active");
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

/* =====================
   SKILLS FILTER & TOUCH FLIP
===================== */
document.addEventListener("DOMContentLoaded", () => {
   const skillTabs = document.querySelectorAll(".skillTabBtn");
   const skillCards = document.querySelectorAll(".flipScene");

   skillTabs.forEach(tab => {
      tab.addEventListener("click", () => {
         skillTabs.forEach(t => t.classList.remove("active"));
         tab.classList.add("active");
         
         const cat = tab.getAttribute("data-category");
         
         skillCards.forEach(card => {
            const cardCat = card.getAttribute("data-category");
            if (cat === "all" || cardCat === cat) {
               card.style.display = "block";
               if (typeof gsap !== 'undefined') {
                  gsap.fromTo(card, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
               }
            } else {
               card.style.display = "none";
            }
         });
      });
   });

   // Touch / Click flip toggle for mobile friendliness
   skillCards.forEach(card => {
      card.addEventListener("click", (e) => {
         // Avoid double-triggering if user clicks inside back link
         if (e.target.tagName !== 'A') {
            card.classList.toggle("flipped");
         }
      });
   });
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

if(cursorDot && cursorOutline) {
   const moveCursor = (x, y) => {
      cursorDot.style.left = x + "px";
      cursorDot.style.top = y + "px";
      
      if(spotlight) {
         spotlight.style.left = x + "px";
         spotlight.style.top = y + "px";
      }

      document.documentElement.style.setProperty('--cx', x + 'px');
      document.documentElement.style.setProperty('--cy', y + 'px');
   };

   window.addEventListener("mousemove", (e) => moveCursor(e.clientX, e.clientY));
   window.addEventListener("touchmove", (e) => moveCursor(e.touches[0].clientX, e.touches[0].clientY));

   document.body.addEventListener("mouseover", e => {
      const el = e.target.closest("a, button, .card, .flipScene, .projectCard, .workCard");
      if (el) {
         cursorOutline.classList.add("hover-rhombus");
         cursorOutline.style.transform = "translate(-50%, -50%) rotate(45deg) scale(1)";
         cursorOutline.style.backgroundColor = ""; // handled by css
         cursorDot.style.opacity = "0";
      }
   });

   document.body.addEventListener("mouseout", e => {
      const el = e.target.closest("a, button, .card, .flipScene, .projectCard, .workCard");
      if (el) {
         cursorOutline.classList.remove("hover-rhombus");
         cursorOutline.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
         cursorOutline.style.backgroundColor = "transparent";
         cursorDot.style.opacity = "1";
         cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      }
   });

   window.addEventListener("mousedown", () => {
      if(cursorOutline) cursorOutline.classList.add("click-neon");
   });
   window.addEventListener("touchstart", () => {
      if(cursorOutline) cursorOutline.classList.add("click-neon");
   });

   window.addEventListener("mouseup", () => {
      if(cursorOutline) cursorOutline.classList.remove("click-neon");
   });
   window.addEventListener("touchend", () => {
      if(cursorOutline) cursorOutline.classList.remove("click-neon");
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
         const sectionTop = section.offsetTop - 250;
         if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
         }
      });
      
      // If we are at the very bottom of the page, force highlight the last section
      if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
          if (sections.length > 0) {
             current = sections[sections.length - 1].getAttribute("id");
          }
      }
      
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
         const geo = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) }).then(res => res.json());
         country = geo.country_name || "Unknown";
      } catch (e1) {
         try {
            const geo2 = await fetch("https://ip-api.com/json/", { signal: AbortSignal.timeout(3000) }).then(res => res.json());
            country = geo2.country || "Unknown";
         } catch (e2) {
            try {
               const geo3 = await fetch("https://api.country.is/", { signal: AbortSignal.timeout(3000) }).then(res => res.json());
               country = geo3.country || "Unknown";
            } catch (e3) {
               country = "Unknown";
            }
         }
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
   if (!projectsGrid) return;
   try {
      projectsGrid.innerHTML = '';

      // Fetch GitHub Repos
      const res = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated`);
      const repos = await res.json();

      if (Array.isArray(repos)) {
         repos
            .filter(repo => !repo.fork && !['sonararadhya', 'Laptop-settings'].includes(repo.name))
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 8)
            .forEach(repo => {
               const card = document.createElement("div");
               card.className = "projectCard";
               card.innerHTML = `
   <img class="projectImage" src="https://opengraph.githubassets.com/1/${githubUser}/${repo.name}" onerror="this.src='Images/profile.webp'" alt="Preview" loading="lazy">
   <h3>${repo.name}</h3>
   <p>${repo.description || "Project repository"}</p>
   <div class="tech">
   ${repo.language || ""}
   ⭐ ${repo.stargazers_count}
   </div>`;
               card.onclick = () => window.open(repo.html_url, "_blank");
               projectsGrid.appendChild(card);
               
               if (typeof gsap !== 'undefined') {
                  gsap.fromTo(card,
                     { opacity: 0, y: 50, scale: 0.95, rotationX: 10 },
                     { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, ease: "power3.out",
                       scrollTrigger: { trigger: card, start: "top 85%", once: true } 
                     }
                  );
               }
               card.classList.add("show");
            });
      }

      // Apply universal tilt to newly injected project cards
      setTimeout(() => apply3DTilt(".projectCard"), 100);
   } catch (err) {
      console.error("Failed to load projects:", err);
   }
}
loadProjects();


/* =====================
   OPTIMIZED TEXT HOVER EFFECT
===================== */
document.addEventListener("DOMContentLoaded", () => {
   if (isMobile) return;
   const texts = document.querySelectorAll('h1, h2.sectionTitle, .heroSubtitle');
   texts.forEach(el => {
      if (el.closest('button') || el.closest('a')) return;
      el.classList.add('text-react');
      let rect, isInside;
      el.addEventListener('mouseenter', () => {
         isInside = true;
         rect = el.getBoundingClientRect();
      });
      el.addEventListener('mousemove', (e) => {
         if (!isInside || !rect) return;
         const x = e.clientX - rect.left - rect.width / 2;
         const y = e.clientY - rect.top - rect.height / 2;
         el.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.01)`;
      });
      el.addEventListener('mouseleave', () => {
         isInside = false;
         el.style.transform = 'translate(0px, 0px) scale(1)';
      });
   });
});

/* =====================
   CERTIFICATES RENDERING (PDF.JS + VANILLA TILT)
===================== */
const certData = {
   "CORE TECHNICAL - PROFESSIONAL CERTIFICATIONS": [
      "AI-900 TRAINING.jpg", "AZ-900 TRAINING.jpg", "DP-900 TRAINING.jpg", 
      "IBM Getting Started with Artificial Intelligence.pdf", "PL-900 TRAINING.jpg", 
      "POWER BI INTERNSHIP.jpg", "PROJECT CERTIFICATE.pdf"
   ],
   "SUPPORTING TECHNICAL & SKILL CERTIFICATIONS": [
      "Android using Kotlin.pdf", "Android.pdf", "Bootstrap.pdf", "C & CPP.pdf", 
      "C LANG.pdf", "CPP ADVANCE.pdf", "CPP_TEST.pdf", "CSS, JAVASCRIPT AND PYTHON.pdf", 
      "CYBER SANSKAR WORKSHOP.pdf", "Cyber Crime Analyst.pdf", "Cyber Forensics Investigator.pdf", 
      "FULL STACK.pdf", "Hackerrank javascript.pdf", "INTEL AI APPRECIATE.png", 
      "INTEL AI AWARE.png", "JAVA.pdf", "Javascript.pdf", "LINUX Programme.pdf", 
      "LINUX TEST.pdf", "NodeJS Bootcamp.pdf", "PHP MYSQL.pdf", "PHP.pdf", 
      "Python and Flask.pdf", "R Programming.pdf", "ReactJS.pdf"
   ],
   "DIGITAL BADGES & MICRO-CREDENTIALS": [
      "Aradhya Santosh Sonar_AI_APPRECIATE_BADGE.png", 
      "Aradhya Santosh Sonar_AI_AWARE_BADGE.png", 
      "getting-started-with-artificial-intelligence (1).png"
   ],
   "CO-CURRICULAR & EXTRACURRICULAR CERTIFICATIONS": [
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
   if (!certGrid) return;
   
   // Clear grid & free img memory
   const oldImgs = certGrid.querySelectorAll("img");
   oldImgs.forEach(i => { i.src = ''; });
   certGrid.innerHTML = '';
   certLoader.style.display = 'block';
   
   const files = certData[category] || [];
   const originalBasePath = `CERTIFICATES/${category}/`;
   const webpBasePath = `CERTIFICATES/WEBP_${category}/`;

   for (const file of files) {
      try {
         const cleanTitle = file.replace(/\.[^/.]+$/, "");
         const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
         const isImg = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
         const webpFilename = cleanTitle + '.webp';

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
         
         const img = document.createElement("img");
         img.src = webpBasePath + webpFilename;
         img.alt = `Aradhya Sonar Certificate: ${cleanTitle}`;
         img.title = `Aradhya Sonar Certificate: ${cleanTitle}`;
         img.loading = "lazy";
         canvasWrap.appendChild(img);

         const title = document.createElement("div");
         title.className = "certTitle";
         title.textContent = cleanTitle;

         const overlay = document.createElement("div");
         overlay.className = "certViewOverlay";
         const viewBtn = document.createElement("a");
         viewBtn.href = originalBasePath + file;
         viewBtn.target = "_blank";
         viewBtn.textContent = isImg ? "View Full Image" : "View Full PDF";
         viewBtn.setAttribute("aria-label", `View ${cleanTitle}`);
         
         viewBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openCertModal(cleanTitle, originalBasePath + file, isImg);
         });
         
         overlay.appendChild(viewBtn);

         card.appendChild(canvasWrap);
         card.appendChild(title);
         card.appendChild(overlay);
         
         certGrid.appendChild(card);
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
         { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
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
      renderCertificates("CORE TECHNICAL - PROFESSIONAL CERTIFICATIONS");
      certSectionObs.disconnect();
   }
}, { threshold: 0.1 });

const certSection = document.getElementById("certificates");
if (certSection) {
   certSectionObs.observe(certSection);
}

/* =====================
   CERTIFICATE LIGHTBOX MODAL HANDLER
===================== */
const certModal = document.getElementById("certModal");
const certModalBackdrop = document.getElementById("certModalBackdrop");
const certModalTitle = document.getElementById("certModalTitle");
const certModalImg = document.getElementById("certModalImg");
const certModalIframe = document.getElementById("certModalIframe");
const certDownloadBtn = document.getElementById("certDownloadBtn");
const certCloseBtn = document.getElementById("certCloseBtn");
const certZoomInBtn = document.getElementById("certZoomInBtn");
const certZoomOutBtn = document.getElementById("certZoomOutBtn");
const certResetZoomBtn = document.getElementById("certResetZoomBtn");

let currentCertZoom = 1;

function openCertModal(titleText, fileUrl, isImg) {
   if (!certModal) return;
   currentCertZoom = 1;
   certModalTitle.textContent = titleText;
   certDownloadBtn.href = fileUrl;

   if (isImg) {
      certModalImg.src = fileUrl;
      certModalImg.style.transform = `scale(1)`;
      certModalImg.style.display = "block";
      certModalIframe.style.display = "none";
      certModalIframe.src = "";
   } else {
      certModalIframe.src = fileUrl;
      certModalIframe.style.display = "block";
      certModalImg.style.display = "none";
      certModalImg.src = "";
   }

   certModal.classList.add("active");
   certModal.setAttribute("aria-hidden", "false");
}

function closeCertModal() {
   if (!certModal) return;
   certModal.classList.remove("active");
   certModal.setAttribute("aria-hidden", "true");
   setTimeout(() => {
      certModalImg.src = "";
      certModalIframe.src = "";
   }, 300);
}

if (certCloseBtn) certCloseBtn.addEventListener("click", closeCertModal);
if (certModalBackdrop) certModalBackdrop.addEventListener("click", closeCertModal);

document.addEventListener("keydown", (e) => {
   if (e.key === "Escape" && certModal && certModal.classList.contains("active")) {
      closeCertModal();
   }
});

if (certZoomInBtn) {
   certZoomInBtn.addEventListener("click", () => {
      currentCertZoom = Math.min(currentCertZoom + 0.25, 3);
      if (certModalImg) certModalImg.style.transform = `scale(${currentCertZoom})`;
   });
}

if (certZoomOutBtn) {
   certZoomOutBtn.addEventListener("click", () => {
      currentCertZoom = Math.max(currentCertZoom - 0.25, 0.5);
      if (certModalImg) certModalImg.style.transform = `scale(${currentCertZoom})`;
   });
}

if (certResetZoomBtn) {
   certResetZoomBtn.addEventListener("click", () => {
      currentCertZoom = 1;
      if (certModalImg) certModalImg.style.transform = `scale(1)`;
   });
}

/* =====================
   DUAL-MODE AI CHATBOT ENGINE (LOCAL JS + GROQ LLAMA 3.1)
===================== */
document.addEventListener("DOMContentLoaded", () => {
   const chatbotToggleBtn = document.getElementById("chatbotToggleBtn");
   const chatbotContainer = document.getElementById("chatbotContainer");
   const closeChatbotBtn = document.getElementById("closeChatbotBtn");
   const chatForm = document.getElementById("chatForm");
   const chatInput = document.getElementById("chatInput");
   const chatMessages = document.getElementById("chatMessages");
   const chatStatusText = document.getElementById("chatStatusText");
   const jsBotTab = document.getElementById("jsBotTab");
   const apiBotTab = document.getElementById("apiBotTab");

   if (!chatbotToggleBtn || !chatbotContainer) return;

   let currentMode = "js"; // "js" or "api"

   // Portfolio Local Knowledge Base
   const LOCAL_FAQ_DB = [
      {
         keywords: ["azure", "cloud", "az-900", "ai-900", "dp-900", "pl-900", "microsoft certified", "aws"],
         response: "☁️ <b>Microsoft Azure & Cloud Expertise:</b><br>• <b>Microsoft Certified: Azure AI Fundamentals (AI-900)</b><br>• <b>Microsoft Certified: Azure Fundamentals (AZ-900)</b><br>• <b>Microsoft Certified: Azure Data Fundamentals (DP-900)</b><br>• <b>Microsoft Certified: Power Platform Fundamentals (PL-900)</b><br>• Experienced in connecting Azure cloud datasets with Power BI, SQL databases, and serverless hosting on Vercel/AWS."
      },
      {
         keywords: ["power bi", "dax", "power query", "fabric", "kasnet", "data analyst", "data analytics", "dashboard", "analytics", "bi"],
         response: "📊 <b>Aradhya's Power BI & Data Analytics Experience:</b><br>• <b>Role:</b> Data Analyst Intern at KasNet Technologies Pvt. Ltd.<br>• <b>Key Achievements:</b><br> 1. Designed interactive executive dashboards analyzing complex business metrics.<br> 2. Authored custom <b>DAX measures</b> & optimized <b>Power Query ETL</b> pipelines.<br> 3. Reduced data preprocessing time by 30% through automated data models.<br> 4. Hands-on experience with <b>Microsoft Fabric</b> and SQL database integrations.<br>• <b>Certifications:</b> PL-900, DP-900, and Power BI Internship Certificate."
      },
      {
         keywords: ["r", "r programming", "r language", "statistics", "statistical"],
         response: "📈 <b>R Programming & Statistics Knowledge:</b><br>Aradhya has foundational academic knowledge of R programming for statistical data analysis and data visualization (ggplot2, dplyr). His primary production projects are built using Python (OpenCV, PyTorch) and JavaScript/React."
      },
      {
         keywords: ["python", "reunite ai", "medai", "opencv", "insightface", "machine learning", "ml", "ai"],
         response: "🐍 <b>Python & AI/ML Projects:</b><br>• <b>Reunite AI:</b> Facial recognition pipeline built with OpenCV & InsightFace for missing person identification.<br>• <b>MedAI Suite:</b> Medical image classification platform using Python, PyTorch, Scikit-Learn, and FastAPI."
      },
      {
         keywords: ["chess7knight", "chess", "mcts", "elo", "board", "stockfish"],
         response: "♟️ <b>Chess7Knight Project:</b><br>• Full-Stack interactive MERN chess app deployed at <a href='https://chess7knight.vercel.app/' target='_blank'>chess7knight.vercel.app</a>.<br>• Features custom board textures, 20+ puzzles, stockfish-assisted post-game review, and real-time ELO progression system."
      },
      {
         keywords: ["netchronaix", "network", "telemetry", "traffic", "cors"],
         response: "🌐 <b>NetChronaix Platform:</b><br>• Real-time network telemetry platform deployed at <a href='https://netchronaix.vercel.app/' target='_blank'>netchronaix.vercel.app</a>.<br>• Used for microservice latency optimization, CORS debugging, and real-time packet telemetry."
      },
      {
         keywords: ["project", "projects", "work", "built", "apps", "portfolio"],
         response: "🚀 <b>Aradhya's Featured Projects:</b><br>1. <b>Chess7Knight:</b> MERN chess platform with custom themes & ELO tracking (chess7knight.vercel.app)<br>2. <b>NetChronaix:</b> Real-time network telemetry platform (netchronaix.vercel.app)<br>3. <b>Reunite AI:</b> Facial recognition pipeline built with OpenCV & InsightFace<br>4. <b>MedAI Suite:</b> Diagnostic medical machine learning suite."
      },
      {
         keywords: ["experience", "internship", "job", "company", "work experience", "codtech"],
         response: "💼 <b>Aradhya's Work Experience:</b><br>1. <b>KasNet Technologies:</b> Data Analyst Intern — Power BI dashboards, DAX, Power Query ETL pipelines.<br>2. <b>Codtech IT Solutions:</b> Web Development Intern — RESTful APIs, MERN Stack, Supabase backend & CI/CD.<br>3. <b>Om Multitherm Engineers:</b> Database validation & system administration."
      },
      {
         keywords: ["education", "college", "degree", "cgpa", "sppu", "modern college", "pesmcoe", "diploma", "awasari"],
         response: "🎓 <b>Aradhya's Education:</b><br>• <b>B.E. in Information Technology:</b> PES Modern College of Engineering, Pune (SPPU) | <b>CGPA: 7.84 (70.90%)</b><br>• <b>Diploma in IT:</b> Government Polytechnic, Awasari Pune | <b>87.19%</b>"
      },
      {
         keywords: ["skill", "skills", "tech", "stack", "react", "mern", "node", "express", "sql", "c++", "javascript", "frontend", "backend"],
         response: "💻 <b>Aradhya's Core Tech Stack:</b><br>• <b>Languages:</b> Python, JavaScript, TypeScript, C++, Java, SQL<br>• <b>Frontend:</b> React.js, Next.js, HTML5, CSS3, Tailwind CSS<br>• <b>Backend:</b> Node.js, Express.js, FastAPI, REST APIs<br>• <b>Data & Analytics:</b> Power BI, DAX, Power Query, Microsoft Fabric, OpenCV, Scikit-Learn<br>• <b>Databases & Cloud:</b> Supabase, MongoDB, AWS, Azure, Git."
      },
      {
         keywords: ["certificate", "certifications", "certified", "ibm"],
         response: "📜 <b>Certifications & Credentials:</b><br>• Microsoft Certified: Azure AI Fundamentals (AI-900)<br>• Microsoft Certified: Azure Fundamentals (AZ-900)<br>• Microsoft Certified: Azure Data Fundamentals (DP-900)<br>• Microsoft Certified: Power Platform Fundamentals (PL-900)<br>• IBM Artificial Intelligence & Power BI Internship Certifications."
      },
      {
         keywords: ["contact", "email", "phone", "reach", "hire", "linkedin", "github", "address", "pune", "resume"],
         response: "📬 <b>Contact Aradhya:</b><br>📧 <b>Email:</b> sonararadhya@gmail.com<br>📞 <b>Phone:</b> +91 82081 36064<br>📍 <b>Location:</b> Pune, Maharashtra, India<br>🔗 <b>LinkedIn:</b> linkedin.com/in/aradhya-sonar<br>💻 <b>GitHub:</b> github.com/sonararadhya"
      },
      {
         keywords: ["who", "aradhya", "about", "bio", "developer"],
         response: "👤 <b>About Aradhya Sonar:</b><br>Aradhya is a Full-Stack Web Developer & Data Analyst based in Pune, India. He builds high-performance MERN web applications, interactive Power BI data analytics solutions, and computer vision AI tools."
      }
   ];

   // Toggle Chat Window
   chatbotToggleBtn.addEventListener("click", () => {
      chatbotContainer.classList.toggle("active");
      const isActive = chatbotContainer.classList.contains("active");
      chatbotContainer.setAttribute("aria-hidden", isActive ? "false" : "true");
   });

   if (closeChatbotBtn) {
      closeChatbotBtn.addEventListener("click", () => {
         chatbotContainer.classList.remove("active");
         chatbotContainer.setAttribute("aria-hidden", "true");
      });
   }

   if (jsBotTab && apiBotTab) {
      jsBotTab.addEventListener("click", () => {
         currentMode = "js";
         jsBotTab.classList.add("active");
         apiBotTab.classList.remove("active");
         if (chatStatusText) chatStatusText.textContent = "● Mode: ASK JS (Instant)";
         appendBotMessage("Switched to ⚡ <b>ASK JS</b> mode. Instant answers from local browser NLP!");
      });

      apiBotTab.addEventListener("click", () => {
         currentMode = "api";
         apiBotTab.classList.add("active");
         jsBotTab.classList.remove("active");
         if (chatStatusText) chatStatusText.textContent = "● Mode: ASK API (Serverless)";
         appendBotMessage("Switched to 🌐 <b>ASK API</b> mode. Connected to secure AI serverless backend!");
      });
   }

   // Message Helper Functions
   function appendUserMessage(msg) {
      const b = document.createElement("div");
      b.className = "chatBubble userBubble";
      b.textContent = msg;
      chatMessages.appendChild(b);
      scrollToBottom();
   }

   function appendBotMessage(htmlContent) {
      const b = document.createElement("div");
      b.className = "chatBubble botBubble";
      b.innerHTML = htmlContent;
      chatMessages.appendChild(b);
      scrollToBottom();
   }

   function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
   }

   // Local JS Search Engine Fallback
   function getLocalJsResponse(query) {
      const lower = query.toLowerCase().trim();

      // Guardrail against general coding/program generation requests
      if (lower.includes("add 2") || lower.includes("write code") || lower.includes("write a program") || lower.includes("code for") || lower.includes("write python") || lower.includes("solve")) {
         return "I am Aradhya's Portfolio Assistant! My purpose is to answer questions about Aradhya's skills, projects (Chess7Knight, NetChronaix), education, and work experience. Feel free to ask about his technical expertise!";
      }

      let bestMatch = null;
      let maxScore = 0;

      LOCAL_FAQ_DB.forEach(item => {
         let score = 0;
         item.keywords.forEach(kw => {
            if (lower.includes(kw)) {
               score += kw.includes(" ") ? 4 : 2;
            }
         });
         if (score > maxScore) {
            maxScore = score;
            bestMatch = item.response;
         }
      });

      if (maxScore > 0 && bestMatch) {
         return bestMatch;
      }

      return "I can answer questions regarding Aradhya's Power BI experience, projects (Chess7Knight, NetChronaix), education, and work experience! Try asking <i>'Tell me about your Power BI experience'</i> or <i>'Show me projects'</i>.";
   }

   let chatHistory = [];

   // Send Message to Secure Vercel Serverless Function /api/chat
   async function sendChatMessageToApi(query) {
      try {
         const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               message: query,
               history: chatHistory
            })
         });

         const data = await res.json();

         if (res.ok && data.reply) {
            chatHistory.push({ role: "user", content: query });
            chatHistory.push({ role: "assistant", content: data.reply });
            return data.reply.replace(/\n/g, "<br>");
         } else if (data.fallback || !res.ok) {
            console.warn("Backend API response warning/fallback:", data);
            return getLocalJsResponse(query);
         }
      } catch (err) {
         console.warn("Static environment or serverless route unavailable, falling back to Local JS search:", err);
         return getLocalJsResponse(query);
      }
      return getLocalJsResponse(query);
   }

   // Handle Form Submission
   chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      appendUserMessage(text);
      chatInput.value = "";

      if (currentMode === "js") {
         const reply = getLocalJsResponse(text);
         setTimeout(() => appendBotMessage(reply), 150);
      } else {
         const loadingBubble = document.createElement("div");
         loadingBubble.className = "chatBubble botBubble";
         loadingBubble.innerHTML = "🌐 <i>Thinking...</i>";
         chatMessages.appendChild(loadingBubble);
         scrollToBottom();

         const reply = await sendChatMessageToApi(text);
         loadingBubble.remove();
         appendBotMessage(reply);
      }
   });

   // Handle Suggestion Chips
   document.querySelectorAll(".chipBtn").forEach(btn => {
      btn.addEventListener("click", () => {
         const query = btn.getAttribute("data-query") || btn.textContent;
         chatInput.value = query;
         chatForm.dispatchEvent(new Event("submit"));
      });
   });
});
