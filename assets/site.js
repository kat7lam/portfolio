// Progressive enhancements. Every page and image link also works without JavaScript.
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  menuButton.hidden = false;
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  navigation.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
}

const filters = document.querySelector('.filters');
if (filters) {
  filters.hidden = false;
  const cards = [...document.querySelectorAll('.work-card')];
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'All' && !card.dataset.group.split(/\s+/).includes(button.dataset.filter); });
    document.querySelector('#filter-status').textContent = `${cards.filter(card => !card.hidden).length} projects shown`;
  });
}

const lightbox = document.querySelector('#lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const largeImage = lightbox.querySelector('img');
  const caption = lightbox.querySelector('#lightbox-caption');
  const fullSize = lightbox.querySelector('.original-link');
  let opener;
  document.querySelectorAll('a[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      largeImage.src = link.href;
      largeImage.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption || largeImage.alt;
      fullSize.href = link.href;
      lightbox.showModal();
      document.body.classList.add('lightbox-open');
    });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    largeImage.removeAttribute('src');
    if (opener) opener.focus();
  });
}

const videoGate = document.querySelector('[data-video-gate]');
if (videoGate) {
  const video = document.querySelector('#procedure-video');
  videoGate.hidden = false;
  video.hidden = true;
  videoGate.addEventListener('click', () => {
    video.hidden = false;
    videoGate.hidden = true;
    video.focus();
  });
}

// Optional home typing line. Static text remains available without JavaScript.
const typewriter = document.querySelector('[data-typewriter]');
if (typewriter && typeof window.matchMedia === 'function') {
  const output = typewriter.querySelector('[data-typewriter-output]');
  const toggle = typewriter.querySelector('[data-typewriter-toggle]');
  const phrases = ['hypersonic entry', 'medical devices', 'a tortilla machine'];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let phraseIndex = 0;
  let characters = phrases[0].length;
  let phase = 'hold';
  let userPaused = false;
  let timer = null;
  const paint = () => { output.textContent = phrases[phraseIndex].slice(0, characters); };
  const running = () => !userPaused && !motion.matches && !document.hidden;
  const stopTimer = () => { if (timer !== null) { clearTimeout(timer); timer = null; } };
  const delay = () => phase === 'hold' ? 1500 : phase === 'typing' ? 75 : phase === 'gap' ? 250 : 40;
  const tick = () => {
    timer = null;
    if (!running()) return;
    if (phase === 'hold') {
      phase = 'deleting';
    } else if (phase === 'deleting') {
      characters = Math.max(0, characters - 1);
      if (characters === 0) { phraseIndex = (phraseIndex + 1) % phrases.length; phase = 'gap'; }
    } else if (phase === 'gap') {
      phase = 'typing';
    } else {
      characters = Math.min(phrases[phraseIndex].length, characters + 1);
      if (characters === phrases[phraseIndex].length) phase = 'hold';
    }
    paint();
    timer = setTimeout(tick, delay());
  };
  const sync = () => {
    stopTimer();
    if (motion.matches) { characters = phrases[phraseIndex].length; phase = 'hold'; paint(); }
    typewriter.dataset.typewriterState = motion.matches ? 'static' : running() ? 'running' : 'paused';
    toggle.hidden = motion.matches;
    toggle.textContent = userPaused ? 'Resume' : 'Pause';
    toggle.setAttribute('aria-label', userPaused ? 'Resume typing animation' : 'Pause typing animation');
    toggle.setAttribute('aria-pressed', String(userPaused));
    if (running()) timer = setTimeout(tick, delay());
  };
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) { characters = phrases[phraseIndex].length; phase = 'hold'; paint(); }
    sync();
  });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
}

// Photo projects are the default view; plain links remain usable without JavaScript.
const workViews = document.querySelector('.work-views');
if (workViews) {
  const tabs = [...workViews.querySelectorAll('[data-work-view]')];
  const panels = tabs.map(tab => document.getElementById(tab.dataset.workView));
  if (tabs.length === 2 && panels.every(Boolean)) {
    workViews.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id);
      panels[i].setAttribute('tabindex', '0');
    });
    const activateView = () => {
      const selected = window.location.hash === '#project-index' ? 1 : 0;
      const moveFocus = panels.some((panel, i) => i !== selected && panel.contains(document.activeElement));
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === selected));
        tab.setAttribute('tabindex', i === selected ? '0' : '-1');
        panels[i].hidden = i !== selected;
      });
      if (moveFocus) tabs[selected].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const hash = '#' + tab.dataset.workView;
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
        activateView();
      });
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else if (event.key === ' ') { event.preventDefault(); tab.click(); return; }
        else return;
        event.preventDefault();
        tabs.forEach((item, index) => item.setAttribute('tabindex', index === next ? '0' : '-1'));
        tabs[next].focus();
      });
    });
    window.addEventListener('hashchange', activateView);
    window.addEventListener('popstate', activateView);
    activateView();
  }
}

// Index rows are visible by default. Enhance only with supported motion/observer APIs.
const projectIndex = document.querySelector('.project-index');
if (projectIndex && 'IntersectionObserver' in window && typeof window.matchMedia === 'function') {
  const indexMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!indexMotion.matches) {
    const rows = [...projectIndex.querySelectorAll('tbody tr')];
    let played = false;
    let finishTimer = null;
    let observer;
    const finish = () => {
      if (finishTimer !== null) { clearTimeout(finishTimer); finishTimer = null; }
      projectIndex.classList.remove('index-is-entering');
      projectIndex.dataset.indexReveal = 'complete';
    };
    const showImmediately = () => {
      played = true;
      if (observer) observer.disconnect();
      finish();
    };
    indexMotion.addEventListener('change', () => { if (indexMotion.matches) showImmediately(); });
    try {
      observer = new window.IntersectionObserver(entries => {
        if (played || !entries.some(entry => entry.isIntersecting)) return;
        played = true;
        observer.disconnect();
        if (indexMotion.matches) { finish(); return; }
        rows.forEach((row, index) => row.style.setProperty('--index-row-delay', `${index * 60}ms`));
        projectIndex.dataset.indexReveal = 'running';
        projectIndex.classList.add('index-is-entering');
        finishTimer = setTimeout(finish, Math.max(0, rows.length - 1) * 60 + 520);
      }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
      observer.observe(projectIndex);
    } catch (error) {
      showImmediately();
    }
  }
}
