// api
import { fetchUserProfile, fetchUserPosts } from '../api/fetch.js';

import { addCreateToHtml } from '../../components/createPost.js';

import { singleProfileUrl } from '../api/api.js';

import { getDefaultHeaders } from '../api/config.js';
import { renderFollowers } from '../utils/render.js';
import { renderFeedPosts } from '../utils/render.js';
import { checkIfFollowing } from '../api/profile/checkIfFollowing.js';
import { loadNavbar } from '../../components/navbar.js';
import { loadFooter } from '../../components/footer.js';

import { defaultProfileParams } from '../api/api.js';
import { setupEditPostHandlers } from '../utils/handlers/editPostHandlers.js';

// auth
import { requireAuth } from '../auth/auth.js';

let userPosts = []; // Global variable to store user posts

loadNavbar();
loadFooter();
requireAuth();
setupEditPostHandlers();
addCreateToHtml(renderFeedPosts, userPosts);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('user');
const localStorageUser = localStorage.getItem('profileData');
const parsedUser = JSON.parse(localStorageUser);
const currentUserName = parsedUser.name;

document.title = `SOME | ${userId}'s Profile`;

const profileTitle = document.getElementById('profileTitle');
profileTitle.innerHTML = `${userId}' feed`;

fetchUserProfile(userId); //

fetchUserPosts(userId).then((posts) => {
  console.log('Globale posts:', userPosts);

  // Unngå duplisering, sjekk om posten allerede finnes i listen
  const newPosts = posts.filter(
    (post) => !userPosts.some((existingPost) => existingPost.id === post.id),
  );

  if (newPosts.length > 0) {
    userPosts.push(...newPosts); // Legg til nye poster
    renderFeedPosts(userPosts); // Oppdater UI med de nye innleggene
  } else {
    console.log('Ingen nye innlegg');
  }
});

const followButton = document.getElementById('followButton');
let isFollowing = await checkIfFollowing(userId);
console.log('Is following:', isFollowing);

function updateFollowButton() {
  if (userId === currentUserName) {
    followButton.innerHTML = '<i class="fa-solid fa-crown"></i>'; // Egen profil-ikon
    followButton.classList.remove(
      'bg-green-500',
      'bg-red-500',
      'cursor-default',
      'hover:bg-green-600',
    );
    followButton.classList.add('bg-yellow-500', 'cursor-default');
    followButton.disabled = true; // Valgfritt: deaktiver knappen
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
