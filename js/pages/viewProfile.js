// api
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchFeedPosts,
} from '../api/fetch.js';

import { singleProfileUrl } from '../api/api.js';

import { getDefaultHeaders } from '../api/config.js';
import { renderFeedPosts, renderFollowers } from '../utils/render.js';

import { checkIfFollowing } from '../api/profile/checkIfFollowing.js';

import { defaultProfileParams } from '../api/api.js';

// auth
import { requireAuth } from '../auth/auth.js';

requireAuth(); // Check if the user is authenticated

// Fetch userId using query string
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams);
const userId = urlParams.get('user');
const userPosts = userId;

const localStorageUser = localStorage.getItem('profileData');
const parsedUser = JSON.parse(localStorageUser);
const currentUserName = parsedUser.name;
console.log('Current user name:', currentUserName); // Debugging log for current user name
console.log('user posts', userPosts);
console.log('User ID:', userId);

fetchUserProfile(userId); // Fetch and render user profile
fetchUserPosts(userId); // Fetch and render user posts

const followButton = document.getElementById('followButton');
let isFollowing = await checkIfFollowing(userId);
console.log('Is following:', isFollowing);

function updateFollowButton() {
  if (userId === currentUserName) {
    followButton.style.display = 'none'; // Hide follow button if its own profile
  }

  followButton.textContent = isFollowing ? 'Unfollow' : 'Follow';
  followButton.classList.toggle('bg-green-500', !isFollowing);
  followButton.classList.toggle('bg-red-500', isFollowing);
}

updateFollowButton(); // Update the button text and style based on follow status

// add event listener to follow button
followButton.addEventListener('click', async () => {
  try {
    // lock button to prevent multiple clicks
    followButton.disabled = true;
    if (isFollowing) {
      // Unfollow user
      const unfollowResponse = await fetch(
        `${singleProfileUrl}/${userId}/unfollow`,
        {
          method: 'PUT',
          headers: getDefaultHeaders(),
        },
      );

      console.log('Unfollow response:', unfollowResponse);

      if (!unfollowResponse.ok) {
        throw new Error('Failed to unfollow user');
      }

      // Update UI and status
      isFollowing = false;
      updateFollowButton();
    } else {
      // Follow user
      const followResponse = await fetch(
        `${singleProfileUrl}/${userId}/follow`,
        {
          method: 'PUT',
          headers: getDefaultHeaders(),
        },
      );

      console.log('Follow response:', followResponse);

      if (!followResponse.ok) {
        throw new Error('Failed to follow user');
      }

      const data = await followResponse.json();
      console.log('Followed user:', data);

      // Update UI and status
      isFollowing = true;
      updateFollowButton();
    }
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
    console.log('Updated profile data:', updatedData.data);

    renderFollowers(updatedData.data.followers || []); // Render updated followers
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    // Unlock button after operation
    // regardless of success or failure
    followButton.disabled = false;
  }
});
