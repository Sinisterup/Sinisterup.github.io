/* =============================================
   SAFE STORAGE (private windows can throw)
   ============================================= */
const store = {
    get(k)    { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =============================================
   ROUTING — #home / #projects / #skills
   ============================================= */
const PAGES = ['home', 'projects', 'skills'];
const pages = document.querySelectorAll('.page');

function currentRoute() {
    const h = location.hash.slice(1);
    if (PAGES.includes(h)) return h;
    // a hash pointing inside a page (e.g. #contact) opens that page
    const el = h && document.getElementById(h);
    const page = el && el.closest('.page');
    return page ? page.id : 'home';
}

function showPage(route, focus) {
    pages.forEach(p => p.classList.toggle('active', p.id === route));
    document.querySelectorAll('[data-route]').forEach(a => {
        if (a.classList.contains('key-link')) {
            if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        }
    });
    document.title = route === 'home'
        ? 'Tan Shang Ren | Gameplay Programmer'
        : `${route[0].toUpperCase() + route.slice(1)} | Tan Shang Ren`;
    document.querySelector('.brand-path').textContent = route === 'home' ? '~' : `~/${route}`;
    const target = location.hash.slice(1);
    const anchor = target && !PAGES.includes(target) && document.getElementById(target);
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    if (focus) document.getElementById('main').focus({ preventScroll: true });
}

window.addEventListener('hashchange', () => showPage(currentRoute(), true));
showPage(currentRoute(), false);

/* =============================================
   PHOSPHOR TOGGLE (green / amber)
   ============================================= */
const themeBtn   = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

function applyPhosphor(p) {
    if (p === 'amber') document.documentElement.dataset.phosphor = 'amber';
    else delete document.documentElement.dataset.phosphor;
    themeLabel.textContent = p;
    themeBtn.setAttribute('aria-pressed', String(p === 'amber'));
}
applyPhosphor(store.get('phosphor') === 'amber' ? 'amber' : 'green');
themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.phosphor === 'amber' ? 'green' : 'amber';
    applyPhosphor(next);
    store.set('phosphor', next);
});

/* =============================================
   ROLE TYPEWRITER
   ============================================= */
const roles  = ['Gameplay Programmer', 'Unity Developer', 'Unreal Tinkerer', 'VR Developer'];
const typeEl = document.getElementById('typewriter');
if (!reducedMotion) {
    let r = 0, c = roles[0].length, deleting = true;
    (function step() {
        const word = roles[r];
        typeEl.textContent = word.slice(0, c);
        let delay = deleting ? 45 : 85;
        if (deleting) {
            if (--c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; delay = 300; }
        } else if (++c > roles[r].length) { deleting = true; c = roles[r].length; delay = 1800; }
        setTimeout(step, c === roles[0].length && r === 0 && deleting ? 1800 : delay);
    })();
}

/* =============================================
   HACKER TERMINAL — every keypress types more of a real script
   (SpigotDispenser.cs from Panda Unexpress)
   ============================================= */
const SOURCE = `using UnityEngine;
using Oculus.Interaction;

public class SpigotDispenser : MonoBehaviour
{
    public LiquidBase barrelLiquidType;
    public MetaSocket cupSocket;
    public ParticleSystem liquidStream;
    public float fillSpeed = 15f;

    public Transform spigotHandle;
    public float pourAngleThreshold = 45f;
    public float springSpeed = 10f;

    private Grabbable handleGrabbable;
    public bool isPouring = false;
    private Quaternion restingRotation;
    private Vector3 restingPosition;

    void Awake()
    {
        if (liquidStream != null) liquidStream.Stop();
        if (spigotHandle != null)
        {
            handleGrabbable = spigotHandle.GetComponent<Grabbable>();
            restingRotation = spigotHandle.localRotation;
            restingPosition = spigotHandle.localPosition;
        }
    }

    protected virtual void Update()
    {
        if (spigotHandle != null)
        {
            bool isBeingGrabbed = handleGrabbable != null
                && handleGrabbable.SelectingPointsCount > 0;

            // spring the handle back when the player lets go
            if (!isBeingGrabbed)
            {
                spigotHandle.localRotation = Quaternion.Lerp(
                    spigotHandle.localRotation, restingRotation,
                    Time.deltaTime * springSpeed);
                spigotHandle.localPosition = Vector3.Lerp(
                    spigotHandle.localPosition, restingPosition,
                    Time.deltaTime * springSpeed);
            }

            float pull = Quaternion.Angle(restingRotation, spigotHandle.localRotation);
            isPouring = pull > pourAngleThreshold;
        }

        if (isPouring && cupSocket != null && cupSocket.HasItem())
        {
            CupData cup = cupSocket.GetSocketItem();
            if (cup != null && !cup.isSealed)
                cup.AddLiquid(barrelLiquidType, fillSpeed * Time.deltaTime);
        }
    }
}
`;
const hackOut  = document.getElementById('hack-output');
const hackHint = document.getElementById('hack-hint');
let hackPos = 0;

function hackType(n) {
    hackPos += n;
    if (hackPos > SOURCE.length) hackPos = 0;   // loop like hackertyper
    hackOut.textContent = SOURCE.slice(0, hackPos);
    hackOut.scrollTop = hackOut.scrollHeight;
}

if (reducedMotion) {
    hackOut.textContent = SOURCE;
    hackHint.textContent = '';
} else {
    // idle auto-typing so the terminal is alive before anyone presses a key
    let lastKey = 0;
    setInterval(() => { if (Date.now() - lastKey > 2500 && document.getElementById('home').classList.contains('active')) hackType(1); }, 60);
    window.__hackKey = () => { lastKey = Date.now(); };
}
hackOut.addEventListener('click', () => hackType(18));   // tap to type on touch screens

/* =============================================
   KEYBOARD — 1-4 navigate, letters hack, Alt×3 / CapsLock×3 popups
   ============================================= */
const popup      = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupBody  = document.getElementById('popup-body');
let altCount = 0, capsCount = 0, comboTimer;

function openPopup(granted) {
    popup.classList.toggle('denied', !granted);
    popupTitle.textContent = granted ? 'ACCESS GRANTED' : 'ACCESS DENIED';
    popupBody.innerHTML = granted
        ? 'Welcome, recruiter. The fastest way in: <a href="mailto:tanshangren07@gmail.com">tanshangren07@gmail.com</a>'
        : 'Nice try. Caps lock will not get you in. Try <kbd>alt</kbd> three times.';
    popup.hidden = false;
    document.getElementById('popup-close').focus();
}
function closePopup() { popup.hidden = true; }
document.getElementById('popup-close').addEventListener('click', closePopup);

function isTyping(e) {
    const t = e.target;
    return t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName);
}

document.addEventListener('keydown', e => {
    if (isTyping(e)) return;

    if (e.key === 'Escape') { closePopup(); return; }

    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { altCount = capsCount = 0; }, 1200);
    if (e.key === 'Alt')      { e.preventDefault(); if (++altCount === 3)  { altCount = 0;  openPopup(true); }  return; }
    if (e.key === 'CapsLock') { if (++capsCount === 3) { capsCount = 0; openPopup(false); } return; }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const nav = { '1': '#home', '2': '#projects', '3': '#skills' };
    if (nav[e.key]) { location.hash = nav[e.key]; return; }
    if (e.key === '4') { location.href = 'mailto:tanshangren07@gmail.com'; return; }

    if (document.getElementById('home').classList.contains('active') && e.key.length === 1 && e.key !== ' ') {
        if (window.__hackKey) window.__hackKey();
        hackType(3 + Math.floor(Math.random() * 4));
    }
});

/* =============================================
   LAZY YOUTUBE EMBED (click thumbnail → load iframe)
   ============================================= */
document.querySelectorAll('.video-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${thumb.dataset.vid}?autoplay=1&rel=0`;
        iframe.title = thumb.getAttribute('aria-label').replace(/^Play /, '');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        thumb.replaceWith(iframe);
        iframe.focus();
    });
});

/* =============================================
   LOCAL CLIPS — play while hovered / in view, only load when visible
   ============================================= */
const clips = document.querySelectorAll('video.clip');
if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) target.play().catch(() => {});
            else target.pause();
        });
    }, { threshold: 0.6 });
    clips.forEach(v => io.observe(v));
}

/* =============================================
   PORTFOLIO FILTER
   ============================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.toggle('active', b === btn);
            b.setAttribute('aria-pressed', String(b === btn));
        });
        const f = btn.dataset.filter;
        let shown = 0;
        document.querySelectorAll('.project-card').forEach(card => {
            const match = f === 'all' || (card.dataset.tags || '').split(' ').includes(f);
            card.classList.toggle('hidden', !match);
            if (match) shown++;
        });
        document.getElementById('empty-note').hidden = shown > 0;
    });
});
