export function handleSearch(postCards, searchInput, noResults) {
  const searchTerm = searchInput.value.toLowerCase();

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

  noResults.classList.toggle('hidden', visibleCards.length > 0);
}

export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
