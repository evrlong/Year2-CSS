// auth
import { requireAuth } from '../auth/auth.js';

// api
import { fetchFeedPosts } from '../api/fetch.js';

// utils
import { renderFeedPosts } from '../utils/render.js';
import { handleSearch, debounce } from '../utils/searchbar.js';

requireAuth();

// DOM-elementer
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const filterSelect = document.getElementById('filterSelect');
const allPosts = []; // Global array for original post-data

// Hent og vis alle innlegg
fetchFeedPosts().then((posts) => {
  if (!Array.isArray(posts)) {
    console.error('Ugyldige data fra fetchFeedPosts:', posts);
    noResults.classList.remove('hidden');
    return;
  }

  allPosts.push(...posts); // Lagre for senere filtrering/søk
  renderFeedPosts(allPosts); // Første visning

  // Start søk når innlegg er lastet
  const postCards = document.querySelectorAll('.post-card');
  searchInput.addEventListener(
    'input',
    debounce(() => handleSearch(postCards, searchInput, noResults), 300),
  );
});

// Håndter filterendring
filterSelect.addEventListener('change', (event) => {
  const selectedFilter = event.target.value;
  let filteredPosts = [...allPosts]; // Lag kopi

  if (selectedFilter === 'date') {
    filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (selectedFilter === 'likes') {
    filteredPosts.sort(
      (a, b) => (b._count?.reactions || 0) - (a._count?.reactions || 0),
    );
  } else if (selectedFilter === 'comments') {
    filteredPosts.sort(
      (a, b) => (b._count?.comments || 0) - (a._count?.comments || 0),
    );
  }

  renderFeedPosts(filteredPosts);
});
