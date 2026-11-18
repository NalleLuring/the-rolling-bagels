/* The Rolling Bagels: arket som glider upp nerifrån.
   "Meny" visar menyn följd av Visit us och de andra restaurangerna.
   "Visit us" visar samma delar utan menyn.
   Loggan rullar längs arkets överkant medan man scrollar. */
(() => {
  const page = document.querySelector('.page');
  const sheet = document.getElementById('sheet');
  if (!page || !sheet) return;

  const scroller = sheet.querySelector('.sheet__scroll');
  const content = sheet.querySelector('.sheet__content');
  const closeBtn = sheet.querySelector('.sheet__close');
  const logo = document.querySelector('.rider__logo');
  const hero = document.querySelector('.hero');
  const triggers = [...document.querySelectorAll('[data-open]')];
  const desktop = window.matchMedia('(min-width: 768px)');

  const HASH = { menu: '#meny', visit: '#visit-us' };
  const HOURS = { weekday: ['08:00', '16:00'], weekend: ['09:00', '16:00'] };

  let mode = null;          // null (stängt), 'menu' eller 'visit'
  let lastTrigger = null;
  let rollTimer = 0;
  let swallowClick = false;

  /* ---------- Öppna och stänga ---------- */

  const modeFromHash = () =>
    Object.keys(HASH).find((key) => HASH[key] === window.location.hash) || null;

  function setHidden(hidden) {
    sheet.inert = hidden;
    if (hidden) sheet.setAttribute('aria-hidden', 'true');
    else sheet.removeAttribute('aria-hidden');
  }

  function syncTriggers() {
    triggers.forEach((t) => t.setAttribute('aria-expanded', String(t.dataset.open === mode)));
  }

  function open(next, { fromHistory = false, focus = true } = {}) {
    const switching = mode !== null && mode !== next;
    if (mode === next) return;
    mode = next;

    sheet.dataset.mode = next;
    page.classList.add('is-open');
    setHidden(false);
    syncTriggers();
    scroller.scrollTop = 0;

    if (switching) {
      content.classList.remove('is-swapping');
      void content.offsetWidth;
      content.classList.add('is-swapping');
    }

    rollSlowly();
    requestAnimationFrame(updateRoll);

    if (!fromHistory) {
      const state = { sheet: next };
      if (switching || (history.state && history.state.sheet)) history.replaceState(state, '', HASH[next]);
      else history.pushState(state, '', HASH[next]);
    }

    if (focus) scroller.focus({ preventScroll: true });
  }

  function close({ fromHistory = false, restoreFocus = true } = {}) {
    if (mode === null) return;
    mode = null;

    page.classList.remove('is-open');
    setHidden(true);
    syncTriggers();
    rollSlowly();
    setRoll(0);

    if (!fromHistory) {
      if (history.state && history.state.sheet) history.back();
      else history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (restoreFocus && lastTrigger) lastTrigger.focus({ preventScroll: true });
  }

  triggers.forEach((trigger) => {
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-controls', 'sheet');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const next = trigger.dataset.open;
      if (mode === next) {
        close();
        return;
      }
      lastTrigger = trigger;
      open(next);
    });
  });

  closeBtn.addEventListener('click', () => {
    if (swallowClick) {
      swallowClick = false;
      return;
    }
    close();
  });

  hero.addEventListener('click', () => close());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mode !== null) close();
  });

  // Bakåtknappen (t.ex. på Android) stänger arket, och länkar till #meny eller #visit-us öppnar det.
  window.addEventListener('popstate', () => {
    const next = modeFromHash();
    if (next) open(next, { fromHistory: true, focus: false });
    else close({ fromHistory: true, restoreFocus: false });
  });

  window.addEventListener('hashchange', () => {
    const next = modeFromHash();
    if (next && next !== mode) open(next, { fromHistory: true });
  });

  document.querySelector('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    lastTrigger = triggers.find((t) => t.dataset.open === 'menu') || null;
    open('menu');
  });

  /* ---------- Loggan som rullar ---------- */

  // På desktop stannar loggan före knapparna Meny och Besök oss (159 px breda) plus luft.
  function travel() {
    const pad = desktop.matches ? 48 : 16;
    const nav = desktop.matches ? 159.32 + 32 : 0;
    return Math.max(0, document.documentElement.clientWidth - 2 * pad - logo.offsetWidth - nav);
  }

  function progress() {
    if (mode === null) return 0;
    const max = scroller.scrollHeight - scroller.clientHeight;
    if (max <= 1) return mode === 'visit' ? 1 : 0;
    return Math.min(1, Math.max(0, scroller.scrollTop / max));
  }

  // Hjulen snurrar som om de rullade på listen: vinkel = sträcka / radie.
  // Hjulradien är ca 12,1 enheter i loggans viewBox (205,09 enheter bred).
  const WHEEL_RADIUS = 12.1;
  const LOGO_UNITS = 205.09;

  function setRoll(p) {
    const x = p * travel();
    const radius = (WHEEL_RADIUS * logo.offsetWidth) / LOGO_UNITS;
    logo.style.setProperty('--roll-x', `${x.toFixed(1)}px`);
    if (radius > 0) logo.style.setProperty('--wheel-rot', `${((x / radius) * 180 / Math.PI).toFixed(1)}deg`);
  }

  function updateRoll() {
    setRoll(progress());
  }

  function rollSlowly() {
    page.classList.add('is-rolling');
    clearTimeout(rollTimer);
    rollTimer = setTimeout(() => page.classList.remove('is-rolling'), 900);
  }

  let rollQueued = false;
  scroller.addEventListener('scroll', () => {
    if (rollQueued) return;
    rollQueued = true;
    requestAnimationFrame(() => {
      rollQueued = false;
      updateRoll();
    });
  }, { passive: true });

  content.addEventListener('animationend', updateRoll);
  sheet.addEventListener('transitionend', (event) => {
    if (event.target === sheet) updateRoll();
  });

  // När fönstret ändrar storlek ska arket inte glida till sin nya plats.
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    page.classList.add('no-anim');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => page.classList.remove('no-anim'), 150);
    updateRoll();
  });

  /* ---------- Dra ner arket för att stänga ---------- */

  let drag = null;

  function dragStart(y) {
    drag = { y0: y, dy: 0, t0: performance.now(), top: sheet.getBoundingClientRect().top };
    page.classList.add('is-dragging');
  }

  function dragMove(y) {
    if (!drag) return;
    drag.dy = Math.max(0, y - drag.y0);
    page.style.setProperty('--rail', `${drag.top + drag.dy}px`);
  }

  function dragEnd() {
    if (!drag) return;
    const { dy, t0 } = drag;
    const speed = dy / Math.max(1, performance.now() - t0);
    drag = null;
    page.classList.remove('is-dragging');
    page.style.removeProperty('--rail');
    if (dy > 6) swallowClick = true;
    if (dy > 90 || (speed > 0.6 && dy > 24)) close();
  }

  // Greppet överst i arket (mobil).
  closeBtn.addEventListener('pointerdown', (event) => {
    if (mode === null || desktop.matches || event.button !== 0) return;
    swallowClick = false;
    closeBtn.setPointerCapture(event.pointerId);
    dragStart(event.clientY);
  });
  closeBtn.addEventListener('pointermove', (event) => dragMove(event.clientY));
  closeBtn.addEventListener('pointerup', dragEnd);
  closeBtn.addEventListener('pointercancel', dragEnd);

  // Dra nedåt i innehållet när det redan är scrollat högst upp.
  let pull = null;
  scroller.addEventListener('touchstart', (event) => {
    pull = mode !== null && scroller.scrollTop <= 0 ? { y0: event.touches[0].clientY, active: false } : null;
  }, { passive: true });

  scroller.addEventListener('touchmove', (event) => {
    if (!pull) return;
    const y = event.touches[0].clientY;
    if (!pull.active) {
      const dy = y - pull.y0;
      if (dy < 0 || scroller.scrollTop > 0) {
        pull = null;
        return;
      }
      if (dy < 8) return;
      pull.active = true;
      dragStart(y);
    }
    event.preventDefault();
    dragMove(y);
  }, { passive: false });

  const endPull = () => {
    if (pull && pull.active) dragEnd();
    pull = null;
  };
  scroller.addEventListener('touchend', endPull);
  scroller.addEventListener('touchcancel', endPull);

  /* ---------- Bildraden i heron ---------- */

  // Raden kopieras en gång, så att den kan glida runt utan skarv.
  // Rörelsen är byggd som Apollo Bagels bildkolumner, fast liggande:
  // - jämn takt åt vänster, 50 px i sekunden (lite lugnare än Apollos ca 77),
  // - mushjul och styrplatta flyttar raden lika långt som man scrollar (bakåt-scroll flyttar bakåt),
  // - med fingret följer raden svepet, och när man släpper fortsätter den med fart som minskar
  //   med 5 % per bildruta tills den är nere i den jämna takten igen,
  // - när menyn är öppen följer raden med när man scrollar i menyn.
  const heroTrack = document.querySelector('.hero__track');
  const heroSet = heroTrack && heroTrack.querySelector('.hero__set');
  if (heroTrack && heroSet) {
    const copy = heroSet.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach((img) => {
      img.alt = '';
      img.removeAttribute('fetchpriority');
    });
    heroTrack.appendChild(copy);

    const HERO_SPEED = 50;             // px per sekund
    const BASE_STEP = HERO_SPEED / 60; // px per bildruta, gränsen där farten släpps
    const FRICTION = 0.95;             // som Apollo: farten minskar 5 % per bildruta
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    let loop = 0;       // bredden på en uppsättning bilder (ett varv)
    let offset = 0;     // hur långt raden har glidit
    let momentum = 0;   // px per bildruta efter ett svep
    let touch = null;   // pågående svep
    let queued = 0;     // scroll som ska läggas på, utjämnat över några bildrutor
    let lastTime = performance.now();

    const measure = () => { loop = heroSet.getBoundingClientRect().width; };
    measure();
    window.addEventListener('resize', measure);
    // Saknar en bild width och height blir rutan rätt bred först när bilden har laddat.
    heroSet.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure, { once: true });
    });

    // Fingret flyttar raden direkt. Scroll (mushjul, styrplatta, menyn) läggs på över
    // några bildrutor, så att ett hack i mushjulet blir en mjuk knuff i stället för ett ryck.
    const nudge = (px) => { if (!still.matches) offset += px; };
    const queue = (px) => { if (!still.matches) queued += px; };

    const frame = (now) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      if (queued !== 0) {
        const take = Math.abs(queued) < 0.5 ? queued : queued * (1 - Math.pow(0.75, dt * 60));
        offset += take;
        queued -= take;
      }
      if (!still.matches && !touch) {
        if (momentum !== 0) {
          const frames = dt * 60;
          offset += momentum * frames;
          momentum *= Math.pow(FRICTION, frames);
          if (Math.abs(momentum) < BASE_STEP) momentum = 0;
        } else {
          offset += HERO_SPEED * dt;
        }
      }
      if (loop > 0) offset = ((offset % loop) + loop) % loop;
      heroTrack.style.transform = `translate3d(${(-offset).toFixed(2)}px, 0, 0)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    const inSheet = (target) => target instanceof Node && sheet.contains(target);

    // Mushjul och styrplatta, var som helst utom i menyarket (där tar menyns scroll över).
    window.addEventListener('wheel', (event) => {
      if (inSheet(event.target)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      queue(delta * unit);
    }, { passive: true });

    // Svep med fingret: raden följer fingret, åt sidan eller uppåt.
    window.addEventListener('touchstart', (event) => {
      if (inSheet(event.target) || event.touches.length !== 1) return;
      touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      momentum = 0;
    }, { passive: true });
    window.addEventListener('touchmove', (event) => {
      if (!touch) return;
      const { clientX, clientY } = event.touches[0];
      const dx = touch.x - clientX;
      const dy = touch.y - clientY;
      const step = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      touch = { x: clientX, y: clientY };
      nudge(step);
      momentum = step;
    }, { passive: true });
    const endTouch = () => {
      if (!touch) return;
      touch = null;
      if (Math.abs(momentum) < BASE_STEP) momentum = 0;
    };
    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);

    // Scroll i menyn flyttar raden lika långt.
    let lastSheetScroll = scroller.scrollTop;
    scroller.addEventListener('scroll', () => {
      const delta = scroller.scrollTop - lastSheetScroll;
      lastSheetScroll = scroller.scrollTop;
      if (mode !== null) queue(delta);
    }, { passive: true });

    // Bild 3 och framåt laddas när de är en skärmbredd från att glida in. Webbläsarens egen
    // lazy loading ser inte bilder som heron klipper bort, så de skulle dyka upp tomma.
    const pending = [...heroTrack.querySelectorAll('img[data-src]')];
    const reveal = (img) => {
      img.parentElement.querySelectorAll('source[data-srcset]').forEach((source) => {
        source.srcset = source.dataset.srcset;
        source.removeAttribute('data-srcset');
      });
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    };
    if ('IntersectionObserver' in window) {
      const watcher = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          watcher.unobserve(entry.target);
        });
      }, { root: hero, rootMargin: '0px 100% 0px 0px' });
      pending.forEach((img) => watcher.observe(img));
    } else {
      pending.forEach(reveal);
    }
  }

  /* ---------- Öppet i dag ---------- */

  function updateOpenToday() {
    const day = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Stockholm', weekday: 'short' }).format(new Date());
    const [from, to] = day === 'Sat' || day === 'Sun' ? HOURS.weekend : HOURS.weekday;
    document.querySelectorAll('[data-open-today]').forEach((node) => {
      node.textContent = `Öppet idag ${from}–${to}`;
    });
  }

  updateOpenToday();
  setInterval(updateOpenToday, 10 * 60 * 1000);

  /* ---------- Start ---------- */

  setHidden(true);
  syncTriggers();

  const initial = modeFromHash();
  if (initial) {
    page.classList.add('no-anim');
    open(initial, { fromHistory: true, focus: false });
    history.replaceState(null, '', HASH[initial]);
    // Två bildrutor räcker, men i en flik i bakgrunden körs inga bildrutor, så en timer tar över.
    const settle = () => page.classList.remove('no-anim');
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 200);
  }
})();
