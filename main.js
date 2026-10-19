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
const roles  = ['Gameplay Programmer', 'VR Developer', 'Shader Programmer', 'Unity Developer'];
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
const hackOut = document.getElementById('hack-output');
let hackPos = 0;

function hackType(n) {
    hackPos += n;
    if (hackPos > SOURCE.length) hackPos = 0;   // loop like hackertyper
    hackOut.textContent = SOURCE.slice(0, hackPos);
    hackOut.scrollTop = hackOut.scrollHeight;
}
if (reducedMotion) hackOut.textContent = SOURCE;
hackOut.addEventListener('click', () => hackType(18));   // tap to type on touch screens

/* =============================================
   MONITOR — reel of project frames / code tab
   ============================================= */
const tabs   = { reel: document.getElementById('tab-reel'), code: document.getElementById('tab-code') };
const reelEl = document.getElementById('reel');
const slides = [...reelEl.querySelectorAll('.reel-slide')];
const dotBox = reelEl.querySelector('.reel-dots');
let slide = 0, reelTimer = null, reelPaused = false;

function showTab(name, focus) {
    Object.entries(tabs).forEach(([k, t]) => {
        const on = k === name;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
    });
    reelEl.hidden   = name !== 'reel';
    hackOut.hidden  = name !== 'code';
    if (focus) tabs[name].focus();
}
Object.entries(tabs).forEach(([k, t]) => {
    t.addEventListener('click', () => showTab(k));
    t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); showTab(k === 'reel' ? 'code' : 'reel', true); }
    });
});

function showSlide(i) {
    slide = (i + slides.length) % slides.length;
    slides.forEach((s, j) => {
        s.classList.toggle('active', j === slide);
        s.tabIndex = j === slide ? 0 : -1;
        s.setAttribute('aria-hidden', String(j !== slide));
    });
    dotBox.querySelectorAll('button').forEach((d, j) => d.setAttribute('aria-current', String(j === slide)));
}
slides.forEach((s, j) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', `Show ${s.querySelector('.reel-cap').firstChild.textContent.trim()}`);
    d.addEventListener('click', () => showSlide(j));
    dotBox.appendChild(d);
});
showSlide(0);

if (!reducedMotion) {
    reelTimer = setInterval(() => { if (!reelPaused && !reelEl.hidden) showSlide(slide + 1); }, 4000);
    reelEl.addEventListener('mouseenter', () => { reelPaused = true; });
    reelEl.addEventListener('mouseleave', () => { reelPaused = false; });
    reelEl.addEventListener('focusin',    () => { reelPaused = true; });
    reelEl.addEventListener('focusout',   () => { reelPaused = false; });
}

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

    // typing anywhere on the home page flips the monitor to the code tab, hackertyper-style
    if (document.getElementById('home').classList.contains('active') && e.key.length === 1 && e.key !== ' ') {
        if (hackOut.hidden) showTab('code');
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
if (reducedMotion) clips.forEach(v => { v.controls = true; });   // no autoplay: let people start it themselves
if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) target.play().catch(() => {});
            else target.pause();
        });
    }, { threshold: 0.6 });
    clips.forEach(v => io.observe(v));
}
