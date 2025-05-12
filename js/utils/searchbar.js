export function handleSearch(searchInput, noResults, loadMoreBtn) {
  const searchTerm = searchInput.value.toLowerCase();
  const postCards = document.querySelectorAll('.post-card'); // Select all post cards
  const postContainer = document.getElementById('postContainer');

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

  const hasResults = visibleCards.length > 0;
  const showLoadMore = visibleCards.length >= 20;

  if (hasResults && showLoadMore) {
    loadMoreBtn.classList.remove('hidden');
    loadMoreBtn.classList.add('block');
  } else {
    loadMoreBtn.classList.add('hidden');
    loadMoreBtn.classList.remove('block');
  }

  // Toggle visibility
  noResults.classList.toggle('hidden', hasResults);
  postContainer.classList.toggle('hidden', !hasResults);

  // if (hasResults) {
  //   const lastVisibleCard = visibleCards[visibleCards.length - 1];

  //   // Scroll to the last visible card
  //   lastVisibleCard.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'nearest',
  //   });
  // }
}

export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
