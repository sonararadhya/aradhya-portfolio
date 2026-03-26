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

// Hacker Text Scramble for Headers
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
document.querySelectorAll(".section h2").forEach(h2 => {
   const originalText = h2.dataset.text || h2.innerText;
   h2.dataset.text = originalText;
   
   ScrollTrigger.create({
      trigger: h2,
      start: "top 85%",
      once: true,
      onEnter: () => {
         let iterations = 0;
         const interval = setInterval(() => {
            h2.innerText = originalText.split("")
               .map((letter, index) => {
                  if(index < iterations) return originalText[index];
                  return letters[Math.floor(Math.random() * 38)];
               }).join("");
            if(iterations >= originalText.length) clearInterval(interval);
            iterations += 1/3;
         }, 30);
      }
   });
});

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
window.addEventListener("scroll", () => {
   btn.style.display = window.scrollY > 300 ? "flex" : "none";
});
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
   DISABLE DEVTOOLS
===================== */
document.addEventListener("contextmenu", e => {
   e.preventDefault();
});
document.addEventListener("keydown", function (e) {
   if (e.key === "F12") { e.preventDefault(); }
   if (e.ctrlKey && e.shiftKey && e.key === "I") { e.preventDefault(); }
   if (e.ctrlKey && e.shiftKey && e.key === "J") { e.preventDefault(); }
   if (e.ctrlKey && e.key === "U") { e.preventDefault(); }
});

/* =====================
   THREE.JS COSMIC BACKGROUND & HERO 3D
===================== */
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };
document.addEventListener("mousemove", e => {
   mouse.x = e.clientX;
   mouse.y = e.clientY;
   targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
   targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// BACKGROUND SCENE
const canvasBg = document.getElementById("particles");
const rendererBg = new THREE.WebGLRenderer({ canvas: canvasBg, alpha: true, antialias: true });
rendererBg.setSize(window.innerWidth, window.innerHeight);
rendererBg.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
const isMobile = window.innerWidth < 768;
const starsGeometry = new THREE.BufferGeometry();
const starsCount = isMobile ? 600 : 1500;
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

const rendererObj = new THREE.WebGLRenderer({ alpha: true, antialias: true });
rendererObj.setSize(window.innerWidth, window.innerHeight);
rendererObj.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
function animate3D() {
   requestAnimationFrame(animate3D);
   const elapsedTime = clock.getElapsedTime();

   // Animate background stars
   starMesh.rotation.y = elapsedTime * 0.03;
   starMesh.rotation.x = elapsedTime * 0.01;
   
   // Parallax background based on mouse
   cameraBg.position.x += (targetMouse.x * 5 - cameraBg.position.x) * 0.05;
   cameraBg.position.y += (targetMouse.y * 5 - cameraBg.position.y) * 0.05;
   cameraBg.lookAt(0, 0, 0);

   // Mouse Repel Logic mapped to full frustum approx width
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

   // Animate centerpiece Interactive Sphere
   object3D.rotation.y += (targetMouse.x * 4 - object3D.rotation.y) * 0.1;
   object3D.rotation.x += (targetMouse.y * 4 - object3D.rotation.x) * 0.1;
   object3D.scale.setScalar(1 + Math.abs(targetMouse.x) * 0.3 + Math.abs(targetMouse.y) * 0.3);

   rendererBg.render(sceneBg, cameraBg);
   if(heroContainer) rendererObj.render(sceneObj, cameraObj);
}
animate3D();

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
if(skillsContainer && !isMobile) {
   const sceneSk = new THREE.Scene();
   const cameraSk = new THREE.PerspectiveCamera(45, skillsContainer.clientWidth / skillsContainer.clientHeight, 0.1, 100);
   cameraSk.position.z = 10;
   
   const rendererSk = new THREE.WebGLRenderer({ alpha: true, antialias: true });
   rendererSk.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
   rendererSk.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   skillsContainer.appendChild(rendererSk.domElement);
   
   // Advanced Gyroscope
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

   sceneSk.add(gyroGroup);
   
   const light2 = new THREE.PointLight(0xa855f7, 2, 50);
   light2.position.set(5, 5, 5);
   sceneSk.add(light2);
   
   function animateSk() {
      requestAnimationFrame(animateSk);
      ring1.rotation.x += 0.01; ring1.rotation.y += 0.02;
      ring2.rotation.x -= 0.02; ring2.rotation.y += 0.01;
      ring3.rotation.z += 0.03; core.rotation.y -= 0.05;
      
      gyroGroup.position.x += (targetMouse.x * 1.5 - gyroGroup.position.x) * 0.1;
      gyroGroup.position.y += (targetMouse.y * 1.5 - gyroGroup.position.y) * 0.1;
      rendererSk.render(sceneSk, cameraSk);
   }
   animateSk();

   window.addEventListener("resize", () => {
      cameraSk.aspect = skillsContainer.clientWidth / skillsContainer.clientHeight;
      cameraSk.updateProjectionMatrix();
      rendererSk.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
   });
}

/* =====================
   CUSTOM CURSOR & TILT
===================== */
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const cursorGlow = document.querySelector(".cursor-glow");

if(cursorDot && cursorOutline && !isMobile) {
   window.addEventListener("mousemove", (e) => {
      cursorDot.style.left = e.clientX + "px";
      cursorDot.style.top = e.clientY + "px";
      
      cursorOutline.animate({
         left: e.clientX + "px",
         top: e.clientY + "px"
      }, { duration: 500, fill: "forwards" });

      if (cursorGlow) {
         cursorGlow.animate({
            left: e.clientX + "px",
            top: e.clientY + "px"
         }, { duration: 1200, fill: "forwards", easing: "ease-out" });
      }
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
         const rotateX = -((y - r.height / 2) / r.height) * 180;
         const rotateY = ((x - r.width / 2) / r.width) * 180;
         card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
      });
      card.addEventListener("mouseleave", () => {
         card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      });
   });
}
apply3DTilt(".card, .eduCard, .workCard");

/* =====================
   MEDIUM NEON LAPTOP
===================== */
const laptopContainer = document.getElementById("laptop-3d-container");
if(laptopContainer && !isMobile) {
   const sceneLap = new THREE.Scene();
   const cameraLap = new THREE.PerspectiveCamera(45, laptopContainer.clientWidth / laptopContainer.clientHeight, 0.1, 100);
   cameraLap.position.z = 10;
   
   const rendererLap = new THREE.WebGLRenderer({ alpha: true, antialias: true });
   rendererLap.setSize(laptopContainer.clientWidth, laptopContainer.clientHeight);
   rendererLap.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   laptopContainer.appendChild(rendererLap.domElement);

   const laptopGrp = new THREE.Group();

   // Laptop Base
   const baseGeom = new THREE.BoxGeometry(4.2, 0.15, 3);
   const baseMat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.3, metalness: 0.8 });
   const base = new THREE.Mesh(baseGeom, baseMat);

   // Laptop Screen
   const screenGeom = new THREE.BoxGeometry(4.2, 2.6, 0.1);
   const screenMat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.3, metalness: 0.8 });
   const screen = new THREE.Mesh(screenGeom, screenMat);
   screen.position.set(0, 1.3, -1.45);
   screen.rotation.x = -0.15; // open angle

   // Glow Screen Display
   const displayGeom = new THREE.PlaneGeometry(4.0, 2.4);
   const displayMat = new THREE.MeshBasicMaterial({ color: 0xb874fe, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
   const display = new THREE.Mesh(displayGeom, displayMat);
   display.position.set(0, 1.3, -1.39);
   display.rotation.x = -0.15;

   // Wireframe
   base.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(baseGeom),
      new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.6 })
   ));

   laptopGrp.add(base);
   laptopGrp.add(screen);
   laptopGrp.add(display);
   
   laptopGrp.scale.set(0.8, 0.8, 0.8);
   laptopGrp.position.y = -0.5;
   sceneLap.add(laptopGrp);

   const lightLap = new THREE.PointLight(0xa855f7, 2, 50);
   lightLap.position.set(5, 5, 5);
   sceneLap.add(lightLap);
   sceneLap.add(new THREE.AmbientLight(0xffffff, 0.5));

   function animateLap() {
      requestAnimationFrame(animateLap);
      laptopGrp.rotation.y += (targetMouse.x * Math.PI - laptopGrp.rotation.y) * 0.05;
      laptopGrp.rotation.x += ((0.2 + targetMouse.y * 0.5) - laptopGrp.rotation.x) * 0.05;
      rendererLap.render(sceneLap, cameraLap);
   }
   animateLap();

   window.addEventListener("resize", () => {
      if(laptopContainer.clientWidth === 0) return;
      cameraLap.aspect = laptopContainer.clientWidth / laptopContainer.clientHeight;
      cameraLap.updateProjectionMatrix();
      rendererLap.setSize(laptopContainer.clientWidth, laptopContainer.clientHeight);
   });
}

/* =====================
   NAV ACTIVE LINK ON SCROLL
===================== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navLinks a");

window.addEventListener("scroll", () => {
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
            os: navigator.platform,
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
