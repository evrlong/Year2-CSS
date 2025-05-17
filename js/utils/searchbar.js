/**
 * Filters and displays post cards based on the search input value.
 * Shows or hides the "No results" message and "Load More" button accordingly.
 *
 * @param {HTMLInputElement} searchInput - The input element where the user types the search term.
 * @param {HTMLElement} noResults - The element that displays when no results are found.
 * @param {HTMLElement} loadMoreBtn - The "Load More" button element to show or hide.
 */
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

  // Toggle visibility of no results message and post container
  noResults.classList.toggle('hidden', hasResults);
  postContainer.classList.toggle('hidden', !hasResults);
}

/**
 * Creates a debounced version of a function that delays its execution until after a wait time has elapsed.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay time in milliseconds.
 * @returns {Function} A debounced version of the input function.
 */
export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
