/* feed.js - Main feed page script
 * This script handles the feed page functionality, including fetching posts,
 * rendering them, handling search and filtering, and creating new posts.
 * It also manages user authentication and error handling.
 */

// auth
import { requireAuth } from '../auth/auth.js';
import { loadNavbar } from '../../components/navbar.js';

// components
import { initCreatePost } from '../../components/createPost.js';
import { addCreateToHtml } from '../../components/createPost.js';
import { allPosts } from '../components/allPosts.js';

// api
import { postUrl } from '../api/api.js';
import { defaultHeaders } from '../api/config.js';

//fetch
import { fetchFeedPosts } from '../api/fetch.js';
// import { fetchFollowedUsernames } from '../api/fetch.js';

// utils
import { renderFeedPosts } from '../utils/render.js';
import { handleSearch, debounce } from '../utils/searchbar.js';

// handeler
import { handleError } from '../utils/handlers/errorHandler.js';
import { handleFeedback } from '../utils/handlers/feedback.js';
import { setupEditPostHandlers } from '../utils/handlers/editPostHandlers.js';

// load navbar
loadNavbar();
requireAuth();
setupEditPostHandlers();
addCreateToHtml(renderFeedPosts, allPosts);

// DOM-elementer
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const filterSelect = document.getElementById('filterSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const postContainer = document.getElementById('postContainer');
// Global array to store all posts

// Debugging log for followed usernames
// Event listener for search input
searchInput.addEventListener(
  'input',
  debounce(() => handleSearch(searchInput, noResults, loadMoreBtn), 300),
);

const localStorageUser = localStorage.getItem('profileData');
const parsedUser = JSON.parse(localStorageUser);
const currentUserName = parsedUser.name;

// fetchFollowedUsernames(currentUserName);
// Pagination variables
let currentPage = 1;
const limit = 20;

// Get and show posts
fetchFeedPosts(limit, currentPage).then((posts) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    noResults.classList.remove('hidden');
    loadMoreBtn.classList.add('hidden');
    postContainer.appendChild(noResults);
    return;
  }

  // check if user is  following

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

  // Hide the load more button if no more posts are available
  if (morePosts.length < limit) {
    loadMoreBtn.classList.add('hidden');
  }

  handleSearch(searchInput, noResults, loadMoreBtn); // Keep search functionality after loading more posts
});

// Filtrering
filterSelect.addEventListener('change', (event) => {
  const selectedFilter = event.target.value;
  let filteredPosts = [...allPosts];

  if (selectedFilter === 'date') {
    filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (selectedFilter === 'title') {
    filteredPosts.sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );
  } else if (selectedFilter === 'likes') {
    filteredPosts.sort(
      (a, b) => (b._count?.reactions || 0) - (a._count?.reactions || 0),
    );
  }

  renderFeedPosts(filteredPosts);
  handleSearch(searchInput, noResults, loadMoreBtn); // Keep search functionality after filtering
});
