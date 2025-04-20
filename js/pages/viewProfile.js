// api
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchFeedPosts,
} from '../api/fetch.js';

// auth
import { requireAuth } from '../auth/auth.js';

requireAuth(); // Check if the user is authenticated

// Fetch userId using query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('user');
const userPosts = userId;
const loadMoreBtn = document.getElementById('loadMoreBtn');
console.log(userPosts); // Assuming userPosts is the same as userId for this example
console.log('User ID:', userId); // Debugging log for userId

fetchUserProfile(userId); // Fetch and render user profile
fetchUserPosts(userPosts); // Fetch and render user posts
