// import { API_BASE_URL } from '../../api/api.js';
// import { defaultHeaders } from '../../api/config.js';
// import { refreshFeed } from '../handlers/refreshFeed.js';

import { handleError } from '../handlers/errorHandler.js';
// import { handleFeedback } from '../handlers/feedback.js';
// import { renderFeedPosts, renderProfilePosts } from '../render.js';
// //get name from local storage

import { fallbackImage } from '../../components/fallbackImage.js';
import { openEditPopup } from '../handlers/editPostHandlers.js';

const profileData = JSON.parse(localStorage.getItem('profileData'));
const profileName = profileData?.name;

export function createPostCard(post) {
  const card = document.createElement('div');
  card.className =
    'post-card bg-white w-full sm:w-60 h-80 m-1.5 shadow-md rounded-lg overflow-hidden';

  // Top row
  const topRow = document.createElement('div');
  topRow.className =
    'bg-white rounded-t-md p-2 flex justify-between items-center text-xs';

  // Profile image
  const profileImg = document.createElement('img');
  profileImg.src = post.author?.avatar?.url || fallbackImage;
  profileImg.alt = `profile picture of ${post.author?.name || 'user'}`;
  profileImg.className =
    'bg-blue-100 shadow-md rounded-full h-7 w-7 object-cover';

  profileImg.onerror = () => {
    try {
      if (profileImg.src !== fallbackImage) {
        throw new Error(
          `Following user (${post.author?.name}) profile image failed to load.`,
        );
      }
    } catch (error) {
      handleError(
        error,
        `Following user (${post.author?.name}) profile image failed to load.`,
        'warning',
      );
      profileImg.src = fallbackImage;
    }
  };

  const profileLink = document.createElement('a');
  profileLink.href = `../viewProfile/index.html?user=${encodeURIComponent(post.author.name)}`;
  profileLink.appendChild(profileImg);

  const createdDate = post.created?.split('T')[0] || 'Date';
  const dateText = document.createTextNode(createdDate);

  topRow.appendChild(profileLink);
  topRow.appendChild(dateText);

  // Edit button (only for own posts)
  if (post.author.name === profileName) {
    const editButton = document.createElement('button');
    editButton.className =
      'edit-button px-2 py-1 rounded-md fa-solid fa-pen-to-square';
    editButton.style.fontSize = '10px';
    editButton.style.marginLeft = '10px';
    editButton.style.cursor = 'pointer';
    editButton.onclick = () => openEditPopup(post);
    topRow.appendChild(editButton);
  }

  // Post title
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'bg-gray-100 px-2 py-1 text-center';
  const title = document.createElement('h3');
  title.className = 'text-sm font-bold text-gray-800 truncate';
  title.textContent = post.title || 'Untitled Post';
  titleWrapper.appendChild(title);

  // Post image
  const contentImg = document.createElement('img');
  const contentImageUrl = post.media?.url || fallbackImage;
  contentImg.src = contentImageUrl;
  contentImg.alt = post.media?.alt || 'Default fallback image';
  contentImg.className = 'h-40 w-full w-3 mx-auto object-cover ring-green-500';

  contentImg.onerror = () => {
    if (contentImg.src !== fallbackImage) {
      console.error('Post image failed to load, using fallback image.');
      contentImg.src = fallbackImage;
    }
  };

  // Bottom content
  const bottom = document.createElement('div');
  bottom.className = 'bg-white py-1 rounded-b-md';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'flex flex-row w-full justify-start items-center';

  const paragraph = document.createElement('p');
  paragraph.className =
    'text-[12px] px-0.5 py-1 pl-4 text-gray-700 break-words whitespace-normal w-full';

  const userSpan = document.createElement('span');
  userSpan.className = 'pr-1 font-bold';
  userSpan.textContent = `@${post.author?.name || 'user'}:`;
  const postText = document.createTextNode(post.body || '');

  paragraph.appendChild(userSpan);
  paragraph.appendChild(postText);
  textWrapper.appendChild(paragraph);

  bottom.appendChild(textWrapper);

  card.appendChild(topRow);
  card.appendChild(titleWrapper); // Add title below the top row
  card.appendChild(contentImg);
  card.appendChild(bottom);

  // Data attributes for filtering/search
  card.dataset.title = post.title || '';
  card.dataset.body = post.body || '';
  card.dataset.tags = (post.tags || []).join(',');
  card.dataset.author = post.author?.name || '';
  card.dataset.created = post.created || '';

  return card;
}
