/**
 * @file feed.js
 * @description Main feed logic for fetching, rendering, filtering, and paginating posts.
 * Handles authentication, layout initialization, post creation, search, and error handling.
 */

// Authentication
import { requireAuth } from '../auth/auth.js';

// Layout components
import { loadNavbar } from '../../components/navbar.js';
import { loadFooter } from '../../components/footer.js';

// Post creation and management
import {
  initCreatePost,
  addCreateToHtml,
} from '../../components/createPost.js';
import { allPosts } from '../components/allPosts.js';
import { fetchFeedPosts } from '../api/fetch.js';

// Utility functions
import { renderFeedPosts } from '../utils/render.js';
import { handleSearch, debounce } from '../utils/searchbar.js';
import { setupEditPostHandlers } from '../utils/handlers/editPostHandlers.js';

// Initialization
loadNavbar();
loadFooter();
requireAuth();
setupEditPostHandlers();
addCreateToHtml(renderFeedPosts, allPosts);

// DOM elements
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const filterSelect = document.getElementById('filterSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const postContainer = document.getElementById('postContainer');

// User info
const localStorageUser = localStorage.getItem('profileData');
const parsedUser = JSON.parse(localStorageUser);
const currentUserName = parsedUser.name;

// Pagination
let currentPage = 1;
const limit = 20;

/**
 * Handle live post searching via debounced input.
 */
searchInput.addEventListener(
  'input',
  debounce(() => handleSearch(searchInput, noResults, loadMoreBtn), 300),
);

/**
 * Fetch and render the initial batch of posts on page load.
 * If no posts are found, show a "no results" message.
 */
fetchFeedPosts(limit, currentPage).then((posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    noResults.classList.remove('hidden');
    loadMoreBtn.classList.add('hidden');
    postContainer.appendChild(noResults);
    return;
  }

  allPosts.push(...posts);
  renderFeedPosts(allPosts);

  if (posts.length < limit) {
    loadMoreBtn.classList.add('hidden');
  }
});

/**
 * Load additional posts on click of "Load More" button.
 * Updates page count and appends new posts to feed.
 */
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  const morePosts = await fetchFeedPosts(limit, currentPage);

  if (morePosts.length === 0) {
    loadMoreBtn.classList.add('hidden');
    return;
  }

  allPosts.push(...morePosts);
  renderFeedPosts(allPosts);

  if (morePosts.length < limit) {
    loadMoreBtn.classList.add('hidden');
  }

  handleSearch(searchInput, noResults, loadMoreBtn);
});

/**
 * Apply selected filter to all loaded posts.
 * Sorts by date or title depending on the dropdown value.
 * @param {Event} event - The change event from the select element.
 */
filterSelect.addEventListener('change', (event) => {
  const selectedFilter = event.target.value;
  let filteredPosts = [...allPosts];

  if (selectedFilter === 'date') {
    filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (selectedFilter === 'title') {
    filteredPosts.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );
  }

  renderFeedPosts(filteredPosts);
  handleSearch(searchInput, noResults, loadMoreBtn);
});

export function openPostModal(post) {
  const modal = document.getElementById('post-modal');
  const overlay = document.getElementById('post-modal-overlay');
  const content = document.getElementById('post-modal-content');

  content.innerHTML = `
    <div class="mb-2">
      <h2 class="text-xl font-bold">${post.title}</h2>
      <p class="text-sm text-gray-500">${post.created.split('T')[0]} by @${post.author.name}</p>
    </div>
    <img src="${post.media?.url || fallbackImage}" alt="${post.media?.alt || 'Post image'}" class="w-full object-cover rounded-md mb-3">
    <p class="text-gray-800 whitespace-pre-wrap">${post.body}</p>
    ${post.tags?.length ? `<div class="mt-2 text-sm text-gray-600">Tags: ${post.tags.join(', ')}</div>` : ''}
  `;

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
