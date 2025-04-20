export function handleSearch(searchInput, noResults, loadMoreBtn) {
  const searchTerm = searchInput.value.toLowerCase();
  const postCards = document.querySelectorAll('.post-card'); // Hent oppdatert liste

  postCards.forEach((card) => {
    const title = card.dataset.title?.toLowerCase() || '';
    const body = card.dataset.body?.toLowerCase() || '';
    const tags = card.dataset.tags?.toLowerCase() || '';
    const author = card.dataset.author?.toLowerCase() || '';
    const created = card.dataset.created?.toLowerCase() || '';

    const match =
      title.includes(searchTerm) ||
      body.includes(searchTerm) ||
      tags.includes(searchTerm) ||
      author.includes(searchTerm) ||
      created.includes(searchTerm);

    card.style.display = match ? 'block' : 'none';
  });

  const visibleCards = Array.from(postCards).filter(
    (card) => card.style.display !== 'none',
  );

  // Skjul "No results" hvis det er noen visbare innlegg
  noResults.classList.toggle('hidden', visibleCards.length > 0);

  // Deaktiver "Last mer"-knappen hvis det er færre enn limit visbare innlegg
  updateLoadMoreButton(visibleCards.length, loadMoreBtn);
}

export function updateLoadMoreButton(visibleCardCount, loadMoreBtn) {
  const pageLimit = 20;

  if (visibleCardCount < pageLimit) {
    console.log('Fewer than 20 posts visible:', visibleCardCount);
    // Juster denne verdien for å matche 'limit'
    loadMoreBtn.disabled = true;
    loadMoreBtn.classList.add('hidden'); // Skjul knappen
  } else {
    console.log('20 or more posts visible:', visibleCardCount);
    loadMoreBtn.disabled = false;
    loadMoreBtn.classList.remove('hidden');
  }
}

export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
