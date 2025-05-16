/**
 * @file ViewProfile.js
 * @description Handles logic for the profile page, including fetching profile data,
 * displaying user posts, and managing follow/unfollow functionality.
 */

// API imports
import { fetchUserProfile, fetchUserPosts } from '../api/fetch.js';
import { singleProfileUrl, defaultProfileParams } from '../api/api.js';
import { getDefaultHeaders } from '../api/config.js';
import { checkIfFollowing } from '../api/profile/checkIfFollowing.js';

// UI components and handlers
import { loadNavbar } from '../../components/navbar.js';
import { loadFooter } from '../../components/footer.js';
import { addCreateToHtml } from '../../components/createPost.js';
import { renderFollowers, renderFeedPosts } from '../utils/render.js';
import { setupEditPostHandlers } from '../utils/handlers/editPostHandlers.js';

// Authentication
import { requireAuth } from '../auth/auth.js';

// Initialize layout and authentication
loadNavbar();
loadFooter();
requireAuth();
setupEditPostHandlers();

// Global state
let userPosts = []; // Store user posts

// Setup post creation UI
addCreateToHtml(renderFeedPosts, userPosts);

// Get user info from query parameters and localStorage
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('user');

const localStorageUser = localStorage.getItem('profileData');
const parsedUser = JSON.parse(localStorageUser);
const currentUserName = parsedUser.name;

// Update document title and page header
document.title = `SOME | ${userId}'s Profile`;
const profileTitle = document.getElementById('profileTitle');
profileTitle.innerHTML = `${userId}'s feed`;

// Fetch and display profile and posts
fetchUserProfile(userId);

fetchUserPosts(userId).then((posts) => {
  // Avoid duplicates
  const newPosts = posts.filter(
    (post) => !userPosts.some((existingPost) => existingPost.id === post.id),
  );

  if (newPosts.length > 0) {
    userPosts.push(...newPosts);
    renderFeedPosts(userPosts);
  }
});

// Follow button logic
const followButton = document.getElementById('followButton');
let isFollowing = await checkIfFollowing(userId); // Must be in top-level async context or inside IIFE

/**
 * Updates the follow button's appearance and state
 * based on whether the current user is following the profile.
 */
function updateFollowButton() {
  if (userId === currentUserName) {
    followButton.innerHTML = '<i class="fa-solid fa-crown"></i>';
    followButton.classList.remove(
      'bg-green-500',
      'bg-red-500',
      'cursor-default',
      'hover:bg-green-600',
    );
    followButton.classList.add('bg-yellow-500', 'cursor-default');
    followButton.disabled = true;
    return;
  }

  followButton.innerHTML = isFollowing
    ? '<i class="fa-solid fa-user-minus"></i>'
    : '<i class="fa-solid fa-user-plus"></i>';

  followButton.classList.remove('bg-yellow-500', 'cursor-default');
  followButton.classList.toggle('bg-green-500', !isFollowing);
  followButton.classList.toggle('bg-red-500', isFollowing);
  followButton.disabled = false;
}

// Initial update of follow button
updateFollowButton();

/**
 * Event listener for follow/unfollow button click
 */
followButton.addEventListener('click', async () => {
  try {
    followButton.disabled = true; // Prevent multiple clicks

    if (isFollowing) {
      // Unfollow logic
      const unfollowResponse = await fetch(
        `${singleProfileUrl}/${userId}/unfollow`,
        {
          method: 'PUT',
          headers: getDefaultHeaders(),
        },
      );

      if (!unfollowResponse.ok) {
        throw new Error('Failed to unfollow user');
      }

      isFollowing = false;
    } else {
      // Follow logic
      const followResponse = await fetch(
        `${singleProfileUrl}/${userId}/follow`,
        {
          method: 'PUT',
          headers: getDefaultHeaders(),
        },
      );

      if (!followResponse.ok) {
        throw new Error('Failed to follow user');
      }

      isFollowing = true;
    }

    updateFollowButton();

    // Fetch and render updated profile data (for updated follower count, etc.)
    const queryString = new URLSearchParams(defaultProfileParams).toString();
    const url = `${singleProfileUrl}/${userId}?${queryString}`;
    const updatedProfile = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!updatedProfile.ok) {
      throw new Error('Failed to fetch updated profile');
    }

    const updatedData = await updatedProfile.json();
    renderFollowers(updatedData.data.followers || []);
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    followButton.disabled = false;
  }
});
