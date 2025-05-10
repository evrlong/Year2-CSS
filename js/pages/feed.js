/* feed.js - Main feed page script
 * This script handles the feed page functionality, including fetching posts,
 * rendering them, handling search and filtering, and creating new posts.
 * It also manages user authentication and error handling.
 */

// auth
import { requireAuth } from '../auth/auth.js';

// api
import { postUrl } from '../api/api.js';
import { defaultHeaders } from '../api/config.js';

//fetch
import { fetchFeedPosts } from '../api/fetch.js';

// utils
import { renderFeedPosts } from '../utils/render.js';
import { handleSearch, debounce } from '../utils/searchbar.js';

// handeler
import { handleError } from '../utils/handlers/errorHandler.js';
import { handleFeedback } from '../utils/handlers/feedback.js';
import { setupEditPostHandlers } from '../utils/handlers/editPostHandlers.js';

requireAuth();
setupEditPostHandlers(); // kun én gang når siden lastes

// DOM-elementer
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const filterSelect = document.getElementById('filterSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const postContainer = document.getElementById('postContainer');
const allPosts = []; // Global array to store all posts

// Event listener for search input
searchInput.addEventListener(
  'input',
  debounce(() => handleSearch(searchInput, noResults, loadMoreBtn), 300),
);

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

  console.log('Filtered posts:', filteredPosts); // Debugging log for filtered posts
  renderFeedPosts(filteredPosts);
  handleSearch(searchInput, noResults, loadMoreBtn); // Keep search functionality after filtering
});

/* * Event listener for the "Create Post" button.
 * This function toggles the visibility of the post form when the button is clicked.
 */
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

  // Fallback values if fields are empty
  title ? title : (title = 'Ingen tittel');
  body ? body : (body = 'Ingen beskrivelse');
  mediaUrl
    ? mediaUrl
    : (mediaUrl =
        'https://raw.githubusercontent.com/evrlong/Year2-CSS/js2/img/avatars/catavatar.png'); // Fallback picture
  if (!mediaUrl.startsWith('http' || mediaUrl.startsWith('https'))) {
    // Check if the URL is valid
    mediaUrl =
      'https://raw.githubusercontent.com/evrlong/Year2-CSS/js2/img/avatars/catavatar.png'; // Fallback picture
  }

  // Validate input fields
  const postData = {
    title: title,
    body: body,
    tags: ['filterTagELokken'],
    media: {
      url: mediaUrl,
      alt: 'Bilde',
    },
  };

  try {
    const respone = await fetch(`${postUrl}}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(postData),
    });
    if (!respone.ok) {
      const errorData = await respone.json();
      const errorMessage =
        errorData.errors?.[0]?.message || 'Failed to create post';
      console.error('An error occurred while creating post', errorData);
      handleError(
        errorMessage,
        'An error occurred while creating post',
        'default',
      );
      handleError(
        'An error occurred while creating post',
        'An error occurred while creating post',
        'default',
      );
      throw new Error('An error occurred while creating post');
    }

    const data = await respone.json();
    console.log('Post created successfully:', data);

    // Add the new post to the allPosts array
    allPosts.unshift(data.data);

    // Update the feed with the new post
    renderFeedPosts(allPosts);

    // Close the post form and reset the fields
    postForm.classList.add('hidden');
    document.getElementById('postTitle').value = '';
    document.getElementById('postBody').value = '';
    document.getElementById('postImageUrl').value = '';

    // Show feedback to the user
    handleFeedback('New post created successfully!', 'success');
  } catch (error) {
    // Handle error and show feedback to the user
    handleError(error, 'An error occurred while creating post', 'default');
    console.error('An error occurred while creating post:', error);
  }
});
