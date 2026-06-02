/* =============================================
   NAVIGATION
   ============================================= */
const navLinks = document.querySelectorAll('.nav-link');
const pages    = document.querySelectorAll('.page-module');

function switchPage(targetId) {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    navLinks.forEach(l => {
        l.classList.toggle('active-nav', l.dataset.target === targetId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetId === 'resume') {
        // Reset bars to 0, then animate in — works on every visit
        document.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
        });
        // Double rAF ensures the reset renders before the transition fires
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.querySelectorAll('.skill-fill').forEach(bar => {
                    bar.style.transition = '';
                    bar.style.width = bar.dataset.width + '%';
                });
            });
        });
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const t = link.getAttribute('data-target');
        if (t) switchPage(t);
    });
});

// Set initial active nav link
switchPage('home');

/* =============================================
   THEME TOGGLE
   ============================================= */
const themeBtn = document.getElementById('theme-toggle');
const body     = document.body;

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeBtn.textContent = '🌙';
} else {
    themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursorRing = document.getElementById('cursor');
const cursorDot  = document.getElementById('cursor-dot');
const isFine     = window.matchMedia('(pointer: fine)').matches;

if (isFine && cursorRing && cursorDot) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursorRing.classList.add('visible');
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top  = my + 'px';
    });

    document.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('visible');
    });

    // Enlarge ring on interactive elements
    const hoverTargets = 'a, button, .project-card, .filter-btn, .stat-item, .contact-item';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    // Lagged ring animation
    (function animateCursor() {
        cx += (mx - cx) * 0.13;
        cy += (my - cy) * 0.13;
        cursorRing.style.left = cx + 'px';
        cursorRing.style.top  = cy + 'px';
        requestAnimationFrame(animateCursor);
    })();
}

/* =============================================
   TYPEWRITER
   ============================================= */
const subtitles = [
    'Gameplay Programmer',
    'Unity Developer',
    'C# Specialist',
    'AI-Assisted Developer'
];

const typeEl = document.getElementById('typewriter');
let sIdx = 0, cIdx = 0, deleting = false;

function typeWriter() {
    const word = subtitles[sIdx];
    typeEl.textContent = deleting ? word.slice(0, --cIdx) : word.slice(0, ++cIdx);

    let delay = deleting ? 55 : 95;

    if (!deleting && cIdx === word.length) {
        delay = 1800;
        deleting = true;
    } else if (deleting && cIdx === 0) {
        deleting = false;
        sIdx = (sIdx + 1) % subtitles.length;
        delay = 350;
    }

    setTimeout(typeWriter, delay);
}

typeWriter();

/* =============================================
   PARTICLE NETWORK BACKGROUND
   ============================================= */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
const COUNT  = 55;
let particles = [];

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.init(); }
    init() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.2 + 0.4;
        this.a  = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw(rgb) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${this.a})`;
        ctx.fill();
    }
}

for (let i = 0; i < COUNT; i++) particles.push(new Particle());

(function drawLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rgb = body.classList.contains('light-mode') ? '0, 85, 204' : '0, 255, 136';

    particles.forEach((p, i) => {
        p.update();
        p.draw(rgb);
        // Draw connecting lines for nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const q  = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 115) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(${rgb}, ${0.12 * (1 - d / 115)})`;
                ctx.lineWidth   = 0.5;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(drawLoop);
})();

/* =============================================
   PORTFOLIO FILTER
   ============================================= */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card => {
            const tags = card.dataset.tags || '';
            card.classList.toggle('hidden', f !== 'all' && !tags.includes(f));
        });
    });
});
