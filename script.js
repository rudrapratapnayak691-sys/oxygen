/* AETHER Life Support â€” interactive behaviors */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initParallax();
  initDiagram();
  initDashboard();
  initExploreButton();
  initNavHighlight();
});

/* ---------- Oxygen particle canvas ---------- */
function initParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("oxygen-particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((w * h) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        alpha: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.7 ? 160 : 185
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

/* ---------- Parallax on scroll ---------- */
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const planet = document.querySelector(".planet");
  const craft = document.querySelector(".spacecraft-orbit");
  if (!planet) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    planet.style.transform = `translateY(${y * 0.15}px)`;
    if (craft && y < window.innerHeight) {
      craft.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.6));
    }
  }, { passive: true });
}

/* ---------- Interactive system diagram ---------- */
const diagramData = {
  water: {
    title: "Water Supply",
    text: "Purified water from the Water Recovery System feeds the electrolyzer. Almost all humidity, hygiene water, and urine is recycled so the habitat needs very little water resupply from Earth."
  },
  electrolysis: {
    title: "Electrolysis (OGA / Elektron)",
    text: "Electric current splits water into oxygen and hydrogen. Oxygen is released into the cabin. Hydrogen is either vented or routed to the Sabatier reactor. The ISS OGA can produce up to ~9.25 kg of Oâ‚‚ per day."
  },
  cabin: {
    title: "Cabin Atmosphere",
    text: "Crew breathe the mixed air (â‰ˆ21% Oâ‚‚, 78% Nâ‚‚). Fans circulate air so oxygen is evenly distributed and COâ‚‚ does not accumulate in any module. Sensors continuously monitor composition and pressure."
  },
  cdra: {
    title: "COâ‚‚ Removal",
    text: "The Carbon Dioxide Removal Assembly uses zeolite beds to capture COâ‚‚ from cabin air. Saturated beds are heated to release the COâ‚‚, which is then vented or sent to the Sabatier system. Backup LiOH canisters are available."
  },
  sabatier: {
    title: "Sabatier Reactor",
    text: "Combines hydrogen from electrolysis with captured COâ‚‚ to produce water and methane: COâ‚‚ + 4 Hâ‚‚ â†’ CHâ‚„ + 2 Hâ‚‚O. The water returns to the recovery loop. Methane is currently vented. This recovers roughly half of the oxygen that would otherwise be lost."
  }
};

function initDiagram() {
  const nodes = document.querySelectorAll(".node");
  const panel = document.getElementById("diagram-info");
  if (!nodes.length || !panel) return;

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      nodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      const key = node.dataset.info;
      const data = diagramData[key];
      if (data) {
        panel.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
      }
    });

    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        node.click();
      }
    });
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");
  });
}

/* ---------- Dashboard subtle live variation ---------- */
function initDashboard() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const gauges = document.querySelectorAll(".gauge");
  gauges.forEach(g => {
    const base = parseFloat(g.dataset.value);
    const max = parseFloat(g.dataset.max);
    const valueEl = g.querySelector(".gauge-value");
    if (!valueEl) return;

    setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.15;
      let next = base + variation;
      if (g.classList.contains("co2")) next = Math.max(1.8, Math.min(3.2, next));
      else if (g.classList.contains("quality")) next = Math.max(92, Math.min(99, next));
      else next = Math.max(base * 0.98, Math.min(base * 1.02, next));

      const display = next.toFixed(1);
      const unit = valueEl.querySelector("span");
      valueEl.childNodes[0].textContent = display;
      const percent = Math.min(100, (next / max) * 100);
      g.style.setProperty("--p", percent + "%");
    }, 2800 + Math.random() * 2000);
  });
}

/* ---------- Explore button ---------- */
function initExploreButton() {
  const btn = document.getElementById("explore-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.getElementById("electrolysis").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- Active nav link ---------- */
function initNavHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".main-nav a");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}
