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
    if (video.dataset.src && !video.getAttribute('src')) video.setAttribute('src', video.dataset.src);
    video.hidden = false;
    videoGate.hidden = true;
    video.focus();
  });
}

// A once-only greeting; no loop, controls, or live announcements.
const greeting = document.querySelector('[data-greeting]');
if (greeting && typeof window.matchMedia === 'function') {
  const greetingMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const greetingText = greeting.querySelector('[data-greeting-text]');
  const fullGreeting = greetingText.textContent;
  let greetingTimer = null;
  let position = 0;
  const finishGreeting = () => {
    if (greetingTimer !== null) clearTimeout(greetingTimer);
    greetingTimer = null;
    greetingText.textContent = fullGreeting;
    greeting.classList.remove('greeting-is-writing');
  };
  const writeGreeting = () => {
    greetingTimer = null;
    if (greetingMotion.matches || document.hidden) { finishGreeting(); return; }
    position += 1;
    greetingText.textContent = fullGreeting.slice(0, position);
    if (position >= fullGreeting.length) { finishGreeting(); return; }
    greetingTimer = setTimeout(writeGreeting, 85);
  };
  if (!greetingMotion.matches && !document.hidden) {
    greetingText.textContent = '';
    greeting.classList.add('greeting-is-writing');
    greetingTimer = setTimeout(writeGreeting, 85);
    greetingMotion.addEventListener('change', () => { if (greetingMotion.matches) finishGreeting(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) finishGreeting(); });
  }
}
