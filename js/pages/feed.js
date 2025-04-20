// auth
import { requireAuth } from '../auth/auth.js';

// api
import { feedUrl } from '../api/api.js';
import { apiKey } from '../api/config.js';
import { getDefaultHeaders, defaultHeaders } from '../api/config.js';
//fetch
import { fetchFeedPosts } from '../api/fetch.js';

// utils
import { renderFeedPosts } from '../utils/render.js';
import {
  handleSearch,
  debounce,
  updateLoadMoreButton,
} from '../utils/searchbar.js';

requireAuth();

// DOM-elementer
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const filterSelect = document.getElementById('filterSelect');

const allPosts = []; // Global array for original post-data

// Søkelogikk med debounce
searchInput.addEventListener(
  'input',
  debounce(() => handleSearch(searchInput, noResults, loadMoreBtn), 300),
);

// Pagination-oppsett
let currentPage = 1;
const limit = 20;

// Hent og vis første innlegg
fetchFeedPosts(limit, currentPage).then((posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    noResults.classList.remove('hidden');
    loadMoreBtn.classList.add('hidden');
    return;
  }

  allPosts.push(...posts);
  renderFeedPosts(allPosts);

  if (posts.length < limit) {
    loadMoreBtn.classList.add('hidden');
  }
});

// load more btn
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  const morePosts = await fetchFeedPosts(limit, currentPage);

  if (morePosts.length === 0) {
    loadMoreBtn.classList.add('hidden');
    return;
  }

  allPosts.push(...morePosts);
  renderFeedPosts(allPosts);

  // Skjul "Last mer"-knappen hvis færre enn limit innlegg
  if (morePosts.length < limit) {
    loadMoreBtn.classList.add('hidden');
  }

  // Kall på søkefunksjonen etter at nye innlegg er lagt til
  handleSearch(searchInput, noResults, loadMoreBtn);
});

// Filtrering
filterSelect.addEventListener('change', (event) => {
  const selectedFilter = event.target.value;
  let filteredPosts = [...allPosts];

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
  handleSearch(searchInput, noResults, loadMoreBtn); // Behold søk etter filterendring
});

// create post button
const toggleBtn = document.getElementById('createPostBtn');
const postForm = document.getElementById('postForm');

toggleBtn.addEventListener('click', () => {
  postForm.classList.toggle('hidden');
});

const submitBtn = document.getElementById('submitPostBtn');

submitBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  // Get values from the form fields
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value.trim();
  let mediaUrl = document.getElementById('postImageUrl').value.trim();

  // Fallback-verdier hvis feltene er tomme
  title ? title : (title = 'Ingen tittel');
  body ? body : (body = 'Ingen beskrivelse');
  mediaUrl ? mediaUrl : (mediaUrl = 'https://example.com/default-image.jpg'); // Fallback-bilde
  if (!mediaUrl.startsWith('http')) {
    // Sjekk om URL-en er gyldig
    mediaUrl = 'https://example.com/default-image.jpg'; // Fallback-bilde
  }

  // Validering av feltene
  const postData = {
    title: title,
    body: body,
    media: {
      url: mediaUrl,
      alt: 'Bilde',
    },
  };

  try {
    const respone = await fetch(`${feedUrl}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(postData),
    });
    if (!respone.ok) {
      throw new Error('Feil ved oppretting av innlegg');
    }

    const data = await respone.json();
    console.log('Innlegg opprettet:', data);

    // Lukk skjemaet og tøm feltene
    postForm.classList.add('hidden');
    document.getElementById('postTitle').value = '';
    document.getElementById('postBody').value = '';
    document.getElementById('postImageUrl').value = '';
    allPosts.unshift(data); // Legg til det nye innlegget i begynnelsen av listen

    window.location.reload(); // Last inn siden på nytt for å vise det nye innlegget
  } catch (error) {
    console.error('Feil ved oppretting av innlegg:', error);
  }
});
