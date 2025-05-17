// dom
import { createPostCard } from './dom/postcard.js';
import {
  createFollowerCard,
  createFollowingCard,
} from './dom/followersFollowing.js';

import { handleFeedback } from './handlers/feedback.js';

/**
 * Renders the user's profile data including avatar, username, and email.
 * Sets a default avatar if the image fails to load.
 *
 * @param {Object} data - The profile data object.
 * @param {HTMLImageElement} imageElement - The image element for the avatar.
 * @param {HTMLElement} usernameElement - The element to display the username.
 * @param {HTMLElement} emailElement - The element to display the email.
 */
export function renderProfileData(
  data,
  imageElement,
  usernameElement,
  emailElement,
) {
  if (data) {
    // Set the image source
    const imageUrl = data.avatar?.url || '../img/avatars/catavatar.png';
    imageElement.src = imageUrl || '../img/avatars/catavatar.png';

    // Handle image load error (fallback to default avatar)
    imageElement.onerror = function () {
      if (imageElement.src !== '../img/avatars/catavatar.png') {
        console.error('Profile Image failed to load, using default avatar.');
        handleFeedback(
          'Profile Image failed to load, using default avatar.',
          'default',
        );
      }

      imageElement.src = '../img/avatars/catavatar.png';
    };

    // Set other profile data
    usernameElement.textContent = data.name || 'No username available';
    emailElement.textContent = data.email || 'No email available';
  } else {
    console.error('No profile data found');
    handleFeedback('No profile data found', 'warning');
  }
}

/**
 * Renders posts in the feed by creating and appending post cards to the container.
 *
 * @param {Array<Object>} posts - Array of post objects to render.
 */
export function renderFeedPosts(posts) {
  const postContainer = document.getElementById('postContainer');
  postContainer.innerHTML = '';
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    postContainer.appendChild(postCard);
  });
}

/**
 * Renders a list of followers with an optional maximum number to show.
 * Updates the followers count in the UI.
 *
 * @param {Array<Object>} followers - Array of follower objects.
 * @param {number} [maxToShow=15] - Maximum number of followers to display.
 * @returns {number} The total number of followers.
 */
export function renderFollowers(followers, maxToShow = 15) {
  const followersContainer = document.getElementById('followersContainer');
  const followersTitle = document.getElementById('followersTitle');
  const followersCount = followers.length;
  followersTitle.textContent = 'Followers (' + followersCount + ')';
  followersContainer.innerHTML = '';
  followers.slice(0, maxToShow).forEach((follower) => {
    const followerCard = createFollowerCard(follower);
    followersContainer.appendChild(followerCard);
  });
  return followers.length;
}

/**
 * Renders a list of following users with an optional maximum number to show.
 * Updates the following count in the UI.
 *
 * @param {Array<Object>} following - Array of following user objects.
 * @param {number} [maxToShow=15] - Maximum number of users to display.
 */
export function renderFollowing(following, maxToShow = 15) {
  const followingTitle = document.getElementById('followingTitle');
  const followingCount = following.length;

  followingTitle.textContent = 'Following (' + followingCount + ')';

  const followingContainer = document.getElementById('followingContainer');
  followingContainer.innerHTML = '';
  following.slice(0, maxToShow).forEach((follow) => {
    const followCard = createFollowingCard(follow);
    followingContainer.appendChild(followCard);
  });
}
