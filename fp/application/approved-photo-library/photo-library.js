(() => {
  const library = document.querySelector('.approved-photo-library');
  if (!library) return;
  const cards = [...library.querySelectorAll('.photo')];
  const buttons = [...library.querySelectorAll('[data-origin-filter]')];
  const search = library.querySelector('#photo-search');
  const use = library.querySelector('#use-filter');
  const status = library.querySelector('#result-status');
  const empty = library.querySelector('.empty-state');
  const state = { origin: 'all', search: '', use: 'all' };
  const apply = () => {
    let visible = 0;
    cards.forEach(card => {
      const matchesOrigin = state.origin === 'all' || card.dataset.origin === state.origin;
      const matchesUse = state.use === 'all' || card.dataset.uses.split(' ').includes(state.use);
      const matchesSearch = !state.search || card.dataset.search.includes(state.search);
      card.hidden = !(matchesOrigin && matchesUse && matchesSearch);
      if (!card.hidden) visible += 1;
    });
    if (status) status.textContent = `Showing ${visible} approved ${visible === 1 ? 'photo' : 'photos'}`;
    if (empty) empty.hidden = visible !== 0;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    state.origin = button.dataset.originFilter;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    apply();
  }));
  if (search) search.addEventListener('input', () => { state.search = search.value.trim().toLowerCase(); apply(); });
  if (use) use.addEventListener('change', () => { state.use = use.value; apply(); });
  cards.forEach(card => card.querySelector('img')?.addEventListener('error', event => {
    event.currentTarget.hidden = true;
    const error = card.querySelector('.image-error');
    if (error) error.hidden = false;
  }));
})();
