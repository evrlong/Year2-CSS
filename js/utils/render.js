//dom
import { createPostCard } from './dom/postcard.js';

export function renderProfileData(
  data,
  imageElement,
  usernameElement,
  emailElement,
) {
  if (data) {
    imageElement.src = data.avatar?.url || 'default-profile.png';
    usernameElement.textContent = data.name || 'No username available';
    emailElement.textContent = data.email || 'No email available';
    console.log('Profile data rendered:', data);
  } else {
    console.error('No profile data found');
  }
}

export function renderFeedPosts(posts) {
  const postContainer = document.getElementById('postContainer');
  postContainer.innerHTML = ''; // Clear existing posts
  posts.forEach((post) => {
    const postCard = createPostCard(post);
    postContainer.appendChild(postCard);
  });
}
