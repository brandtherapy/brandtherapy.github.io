(() => {
  const cards = [...document.querySelectorAll('.photo')];
  const buttons = [...document.querySelectorAll('[data-origin-filter]')];
  const search = document.querySelector('#photo-search');
  const use = document.querySelector('#use-filter');
  const status = document.querySelector('#result-status');
  const empty = document.querySelector('.empty-state');
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
    status.textContent = `Showing ${visible} approved ${visible === 1 ? 'photo' : 'photos'}`;
    empty.hidden = visible !== 0;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    state.origin = button.dataset.originFilter;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    apply();
  }));
  search.addEventListener('input', () => { state.search = search.value.trim().toLowerCase(); apply(); });
  use.addEventListener('change', () => { state.use = use.value; apply(); });
  cards.forEach(card => card.querySelector('img').addEventListener('error', event => {
    event.currentTarget.hidden = true;
    card.querySelector('.image-error').hidden = false;
  }));
})();
