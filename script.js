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

// Stars
const isMobile = window.innerWidth < 768;
const starsGeometry = new THREE.BufferGeometry();
const starsCount = isMobile ? 600 : 1500;
const posArray = new Float32Array(starsCount * 3);
const origPosArray = new Float32Array(starsCount * 3);

for(let i = 0; i < starsCount * 3; i++) {
   const val = (Math.random() - 0.5) * 300;
   posArray[i] = val;
   origPosArray[i] = val;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
   size: 0.8,
   color: 0xb874fe,
   transparent: true,
   opacity: 0.8,
   blending: THREE.AdditiveBlending
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

// Icosahedron shape (scale down for mobile)
const geometry = new THREE.IcosahedronGeometry(isMobile ? 1.6 : 2.2, 1);
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

   // Mouse Repel Logic
   const mw = targetMouse.x * 50; 
   const mh = targetMouse.y * 50;
   const positions = starsGeometry.attributes.position.array;
   for(let i=0; i<starsCount; i++) {
        const i3 = i * 3;
        const ox = origPosArray[i3];
        const oy = origPosArray[i3+1];
        const dx = ox - mw;
        const dy = oy - mh;
        const distSq = dx*dx + dy*dy;
        if(distSq < 400 && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (20 - dist) * 0.5;
            positions[i3] = ox + (dx/dist) * force;
            positions[i3+1] = oy + (dy/dist) * force;
        } else {
            positions[i3] += (ox - positions[i3]) * 0.1;
            positions[i3+1] += (oy - positions[i3+1]) * 0.1;
        }
   }
   starsGeometry.attributes.position.needsUpdate = true;

   // Animate centerpiece
   object3D.rotation.y += 0.005;
   object3D.rotation.x += 0.002;
   // subtle mouse follow
   object3D.position.x += (targetMouse.x * 1.5 - object3D.position.x) * 0.05;
   object3D.position.y += (targetMouse.y * 1.5 - object3D.position.y) * 0.05;

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
   
   const torusGeom = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
   const torusMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.1,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.7
   });
   const torus = new THREE.Mesh(torusGeom, torusMat);
   sceneSk.add(torus);
   
   const light2 = new THREE.PointLight(0xa855f7, 2, 50);
   light2.position.set(5, 5, 5);
   sceneSk.add(light2);
   
   function animateSk() {
      requestAnimationFrame(animateSk);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      torus.position.x += (targetMouse.x * 2 - torus.position.x) * 0.1;
      torus.position.y += (targetMouse.y * 2 - torus.position.y) * 0.1;
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

if(cursorDot && cursorOutline && !isMobile) {
   window.addEventListener("mousemove", (e) => {
      cursorDot.style.left = e.clientX + "px";
      cursorDot.style.top = e.clientY + "px";
      
      cursorOutline.animate({
         left: e.clientX + "px",
         top: e.clientY + "px"
      }, { duration: 500, fill: "forwards" });
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
         card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
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
         .filter(repo => !repo.fork)
         .sort((a, b) => b.stargazers_count - a.stargazers_count)
         .slice(0, 8)
         .forEach(repo => {
            const card = document.createElement("div");
            card.className = "projectCard";
            card.innerHTML = `
<img class="projectImage" src="https://opengraph.githubassets.com/1/${githubUser}/${repo.name}" alt="Preview" loading="lazy">
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
