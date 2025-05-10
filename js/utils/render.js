//dom
import { createPostCard } from './dom/postcard.js';
import {
  createFollowerCard,
  createFollowingCard,
} from './dom/followersFollowing.js';

import { handleFeedback } from './handlers/feedback.js';

export function renderProfileData(
  data,
  imageElement,
  usernameElement,
  emailElement,
  followersCount,
  postCount,
) {
  if (data) {
    // Set the image source
    const imageUrl = data.avatar?.url || '../img/avatars/catavatar.png';
    imageElement.src = imageUrl || '../img/avatars/catavatar.png';

    // Handle image error (if the image URL is broken or incorrect)
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
    followersCount.textContent = data._count.followers || 0;
    postCount.textContent = data._count.posts || 0;

    console.log('Profile data rendered:', data);
  } else {
    console.error('No profile data found');
    handleFeedback('No profile data found', 'warning');
  }
}

export function renderFeedPosts(posts) {
  const postContainer = document.getElementById('postContainer');
  postContainer.innerHTML = '';
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    postContainer.appendChild(postCard);
  });
}

//list followers
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

//list following
export function renderFollowing(following, maxToShow = 15) {
  const followingTitle = document.getElementById('followingTitle');
  const followingCount = following.length;
  console.log('Following count:', followingCount);
  followingTitle.textContent = 'Following (' + followingCount + ')';

  const followingContainer = document.getElementById('followingContainer');
  followingContainer.innerHTML = '';
  following.slice(0, maxToShow).forEach((follow) => {
    const followCard = createFollowingCard(follow);
    followingContainer.appendChild(followCard);
  });
}

export function renderProfilePosts(posts) {
  const postContainer = document.getElementById('postContainer');
  postContainer.innerHTML = '';
  posts.forEach((post) => {
    const postCard = createProfileCard(post);
    postContainer.appendChild(postCard);
  });
}
