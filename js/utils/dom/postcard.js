import { handleError } from '../handlers/errorHandler.js';
import { fallbackImage } from '../../components/fallbackImage.js';
import { openEditPopup } from '../handlers/editPostHandlers.js';

const profileData = JSON.parse(localStorage.getItem('profileData'));
const profileName = profileData?.name;

/**
 * Creates a post card DOM element for a given post object.
 *
 * The card includes author info, post date, title, image, body snippet,
 * and an edit button if the post belongs to the logged-in user.
 *
 * @param {Object} post - The post object containing data for rendering.
 * @param {Object} post.author - The author object.
 * @param {string} post.author.name - The author's username.
 * @param {Object} [post.author.avatar] - The author's avatar image object.
 * @param {string} [post.author.avatar.url] - URL of the author's avatar image.
 * @param {string} post.created - ISO string of the post creation date.
 * @param {string} post.title - The post's title.
 * @param {string} post.body - The post's body content.
 * @param {Array<string>} [post.tags] - List of tags for the post.
 * @param {Object} [post.media] - Post media object.
 * @param {string} [post.media.url] - URL to the post's image.
 * @param {string} [post.media.alt] - Alternative text for the image.
 * @returns {HTMLDivElement} The constructed post card element.
 */
export function createPostCard(post) {
  const card = document.createElement('div');
  card.className =
    'post-card bg-white w-full sm:w-60 rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-lg duration-200';

  // Top row containing profile image, link, and post date
  const topRow = document.createElement('div');
  topRow.className =
    'bg-white rounded-t-md p-2 flex justify-between items-center text-xs';

  // Profile image element
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

  // Edit button visible only on user's own posts
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
  title.className =
    'text-sm font-bold text-gray-800 truncate group-hover:text-green-400 transition-colors';

  const maxTitleLength = 25; // Maximum title length
  const maxBodyLength = 250; // Maximum body length

  title.textContent = post.title.slice(0, maxTitleLength).trim() || '';
  titleWrapper.appendChild(title);

  // Post image
  const contentImg = document.createElement('img');
  const contentImageUrl = post.media?.url || fallbackImage;
  contentImg.src = contentImageUrl;
  contentImg.alt = post.media?.alt || 'Default fallback image';
  contentImg.className =
    'aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-300';

  contentImg.onerror = () => {
    if (contentImg.src !== fallbackImage) {
      console.error('Post image failed to load, using fallback image.');
      contentImg.src = fallbackImage;
    }
  };

  // Bottom content with post body snippet
  const bottom = document.createElement('div');
  bottom.className =
    'bg-white py-1 rounded-b-md h-36 flex flex-col justify-between';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'flex flex-row w-full justify-start items-center';

  const paragraph = document.createElement('p');
  paragraph.className =
    'break-all text-[12px] px-1 py-1 text-gray-700 break-words whitespace-normal w-full';

  const userSpan = document.createElement('span');
  userSpan.className = 'pr-1 font-bold';
  userSpan.textContent = `@${post.author?.name || 'user'}:`;
  const postText = document.createTextNode(
    post.body.slice(0, maxBodyLength).trim() + '…' || '',
  );

  paragraph.appendChild(userSpan);
  paragraph.appendChild(postText);
  textWrapper.appendChild(paragraph);

  bottom.appendChild(textWrapper);

  // Assemble card
  card.appendChild(topRow);
  card.appendChild(titleWrapper);
  card.appendChild(contentImg);
  card.appendChild(bottom);

  // Data attributes for filtering and searching
  card.dataset.title = post.title || '';
  card.dataset.body = post.body || '';
  card.dataset.tags = (post.tags || []).join(',');
  card.dataset.author = post.author?.name || '';
  card.dataset.created = post.created || '';

  return card;
}
