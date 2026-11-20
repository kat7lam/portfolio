// Keep each Hobbies stack simple: one Next button, with no image-opening links.
document.querySelectorAll('.side-page [data-note-cards]').forEach(stack => {
  const cards = [...stack.querySelectorAll('.note-card')];
  const controls = stack.querySelector('.note-card-controls');
  if (!controls) return;
  const selectors = [...controls.querySelectorAll('button')];
  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next';
  next.setAttribute('aria-label', 'Next photo: ' + stack.getAttribute('aria-label'));
  next.addEventListener('click', () => {
    const current = cards.findIndex(card => card.classList.contains('is-front'));
    selectors[(current + 1) % cards.length].click();
  });
  controls.replaceChildren(next);
  stack.querySelectorAll('.photo-link').forEach(link => link.remove());
});
