const words=[
{text:"Full Stack Developer",color:"#FFD700"},   // gold
{text:"AI Engineer",color:"#FF8C00"},             // orange
{text:"Cybersecurity Enthusiast",color:"#00FFFF"},// cyan
{text:"Software Engineer",color:"#22c55e"}        // green
];
let i=0,j=0,del=false;

function type(){
let el=document.getElementById("typing");
let w=words[i].text;
el.style.color=words[i].color;
if(!del){
el.textContent=w.substring(0,j++);
if(j>w.length){del=true;setTimeout(type,1000);return;}
}else{
el.textContent=w.substring(0,j--);
if(j==0){del=false;i=(i+1)%words.length;}
}
setTimeout(type,del?50:90);
}
type();

/* reveal */
const obs=new IntersectionObserver(e=>{
e.forEach(x=>{if(x.isIntersecting)x.target.classList.add("show");});
});
document.querySelectorAll(".section,.card,.skillCard,.eduCard")
.forEach(el=>obs.observe(el));

/* scroll button */
const btn=document.getElementById("topBtn");
window.addEventListener("scroll",()=>{
btn.style.display = window.scrollY > 300 ? "flex" : "none";
});
btn.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});

/* theme toggle */
const toggle=document.getElementById("themeToggle");
toggle.onclick=()=>{
document.body.classList.toggle("light");
toggle.innerHTML=document.body.classList.contains("light")
?'<i class="ri-moon-line"></i>'
:'<i class="ri-sun-line"></i>';
};

/*
document.addEventListener("contextmenu", e => {
e.preventDefault();
});

document.addEventListener("keydown", function(e) {

if (e.key === "F12") {
e.preventDefault();
}

if (e.ctrlKey && e.shiftKey && e.key === "I") {
e.preventDefault();
}

if (e.ctrlKey && e.shiftKey && e.key === "J") {
e.preventDefault();
}

if (e.ctrlKey && e.key === "U") {
e.preventDefault();
}

});
*/

/* particles */
/* =========================
   Particle System
========================= */

const c = document.getElementById("particles");
const ctx = c.getContext("2d");

function resize(){
c.width = innerWidth;
c.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

let mouse = {x:null,y:null};

document.addEventListener("mousemove",e=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

let particles=[];
const COUNT = 200;

for(let i=0;i<COUNT;i++){
particles.push({
x:Math.random()*c.width,
y:Math.random()*c.height,
dx:(Math.random()-0.5)*0.6,
dy:(Math.random()-0.5)*0.6,
r:Math.random()*2+0.6
});
}

function draw(){

ctx.clearRect(0,0,c.width,c.height);

const isLight = document.body.classList.contains("light");

particles.forEach(p=>{

p.x += p.dx;
p.y += p.dy;

if(p.x < 0 || p.x > c.width) p.dx *= -1;
if(p.y < 0 || p.y > c.height) p.dy *= -1;

/* cursor repel */

if(mouse.x){

let dx = p.x - mouse.x;
let dy = p.y - mouse.y;
let dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 120){

p.x += dx/dist * 2;
p.y += dy/dist * 2;

}

}

/* particle colors */

let color;

if(isLight){

const colors = ["#f97316","#22c55e","#a855f7"]; 
color = colors[Math.floor(Math.random()*colors.length)];

}else{

color = "#a855f7"; // purple neon for dark

}

/* draw particle */

ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle = color;
ctx.fill();

});

requestAnimationFrame(draw);

}

draw();

/* tilt */
const profile=document.querySelector(".profile");
profile.addEventListener("mousemove",e=>{
const r=profile.getBoundingClientRect();
const x=e.clientX-r.left;
const y=e.clientY-r.top;
profile.style.transform=`rotateX(${-(y-r.height/2)/12}deg) rotateY(${(x-r.width/2)/12}deg) scale(1.05)`;
});
profile.addEventListener("mouseleave",()=>profile.style.transform="rotateX(0) rotateY(0)");

/* cursor glow */
const spotlight=document.getElementById("spotlight");
document.addEventListener("mousemove",e=>{
spotlight.style.left=e.clientX+"px";
spotlight.style.top=e.clientY+"px";
});


/* ===========================
   NAV ACTIVE LINK ON SCROLL
=========================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navLinks a");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 150;
const sectionHeight = section.clientHeight;

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


/* =========================
   Supabase Visitor Tracking
========================= */

const SUPABASE_URL = "https://lqkzhyoqkjnumwqbiqyk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxa3poeW9xa2pudW13cWJpcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTYwMTQsImV4cCI6MjA4OTQ3MjAxNH0.ZUkFn9xAMMctNfNa8Lmv0XXAXAIxwRLxz1Nltf-Y-sk"; 

async function sendVisitorData() {
  try {
     
    const parser = new UAParser();
    const result = parser.getResult();
    const geo = await fetch("https://ipapi.co/json/")
     .then(res => res.json());
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
     body: JSON.stringify({
        device: result.device.model || result.device.type || result.os.name || "Desktop",
        browser: result.browser.name || "Unknown Browser",
        os: result.os.name,                 // ✅ NEW
        page: window.location.pathname,
        country: geo.country_name || "Unknown",
        time: new Date()
})
    });

    console.log("Visitor stored ✅", res.status);

  } catch (err) {
    console.error("Supabase Error:", err);
  }
}

window.addEventListener("load", () => {
  console.log("Page loaded 🚀");   // debug check
  sendVisitorData();
});


/* ===========================
   GitHub Projects Loader
=========================== */

const githubUser = "sonararadhya";
const projectsGrid = document.getElementById("projectsGrid");

async function loadProjects(){

try{

const res = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated`);
const repos = await res.json();

repos
.filter(repo => !repo.fork) // ignore forks
.sort((a,b)=>b.stargazers_count-a.stargazers_count)
.slice(0,8) // show top 8
.forEach(repo=>{

const card=document.createElement("div");
card.className="projectCard";

card.innerHTML=`

<h3>${repo.name}</h3>

<p>${repo.description || "Project repository"}</p>

<div class="tech">
${repo.language || ""}
⭐ ${repo.stargazers_count}
</div>

`;

card.onclick=()=>window.open(repo.html_url,"_blank");

projectsGrid.appendChild(card);

/* reveal animation */
obs.observe(card);

/* tilt effect */
card.addEventListener("mousemove",e=>{

const r=card.getBoundingClientRect();
const x=e.clientX-r.left;
const y=e.clientY-r.top;

card.style.transform=
`rotateX(${-(y-r.height/2)/14}deg)
 rotateY(${(x-r.width/2)/14}deg)
 scale(1.05)`;

});

card.addEventListener("mouseleave",()=>{
card.style.transform="";
});

});

}catch(err){

projectsGrid.innerHTML="<p>Failed to load projects</p>";

}

}

loadProjects();
