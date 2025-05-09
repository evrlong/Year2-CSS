import { API_BASE_URL } from '../../api/api.js';
import { defaultHeaders } from '../../api/config.js';
//get name from local storage
const profileData = JSON.parse(localStorage.getItem('profileData'));
const profileName = profileData.name;

export function createPostCard(post) {
  const card = document.createElement('div');
  card.className =
    ' post-card bg-white min-h-52 w-140 m-4 shadow-md rounded-lg w-60';

  // Top profile/date row
  const topRow = document.createElement('div');
  topRow.className =
    'bg-white rounded-t-md p-2 flex justify-between items-center text-xs';

  // Profile image
  const profileImg = document.createElement('img');
  profileImg.src =
    post.author.avatar.url &&
    typeof post.author.avatar.url === 'string' &&
    post.author.avatar.url.trim().startsWith('http')
      ? post.author.avatar.url
      : '../img/noimg.png';
  profileImg.alt = `profile picture of ${post.author?.name || 'user'}`;
  profileImg.className =
    'bg-blue-100 shadow-md rounded-full h-7 w-7 object-cover';

  //add edit button if user is the author of the post

  // Lag lenke rundt profilbildet
  const profileLink = document.createElement('a');
  profileLink.href = `../viewProfile/index.html?user=${encodeURIComponent(post.author.name)}`;
  profileLink.appendChild(profileImg);

  // Created date
  const createdDate = post.created?.split('T')[0] || 'Date';
  const dateText = document.createTextNode(createdDate);

  // Legg til i topRow
  topRow.appendChild(profileLink); // Bildet med lenke
  topRow.appendChild(dateText);

  const popup = document.getElementById('popup');
  const editPostForm = document.getElementById('editPostForm');
  const closeButton = document.getElementById('closeButton');

  closePopupBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  // Funksjon for å åpne redigeringspopup med data
  function openEditPopup(post) {
    // Lagre ID-en på posten
    editPostForm.dataset.id = post.id;

    // Fyll inn feltene med eksisterende data
    document.getElementById('editPostTitle').value = post.title || '';
    document.getElementById('editPostBody').value = post.body || '';
    document.getElementById('editPostImageUrl').value = post.media?.url || '';

    // Vis popup
    popup.classList.remove('hidden');
  }

  if (post.author.name === profileName) {
    const editButton = document.createElement('button');
    editButton.className =
      'edit-button px-2 py-1 rounded-md fa-solid fa-pen-to-square';
    editButton.style.fontSize = '10px';
    editButton.style.marginLeft = '10px';
    editButton.style.cursor = 'pointer';

    editButton.onclick = () => {
      openEditPopup(post); // <-- Bruk funksjonen her
    };

    topRow.appendChild(editButton);
  }

  const saveEditBtn = document.getElementById('saveEditBtn');
  const deletePostBtn = document.getElementById('deletePostBtn');
  deletePostBtn.addEventListener('click', async () => {
    const postId = editPostForm.dataset.id;
    try {
      const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });

      if (!response.ok) {
        throw new Error('Noe gikk galt ved sletting av posten');
      }

      // Lukk popupen
      popup.classList.add('hidden');

      // Oppdater feed eller last inn på nytt
      location.reload(); // eller renderFeedPosts() hvis du har en funksjon for det
    } catch (error) {
      console.error('Feil ved sletting:', error);
    }
  });

  saveEditBtn.addEventListener('click', async () => {
    const postId = editPostForm.dataset.id;
    const updatedTitle = document.getElementById('editPostTitle').value;
    const updatedBody = document.getElementById('editPostBody').value;
    const updatedImage = document.getElementById('editPostImageUrl').value;

    const updatedPost = {
      title: updatedTitle,
      body: updatedBody,
      media: {
        url: updatedImage,
        alt: 'Updated image',
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
        method: 'PUT', // eller PATCH hvis du bare vil endre noe
        headers: defaultHeaders,
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Noe gikk galt ved oppdatering av posten');
      }

      // Lukk popupen
      popup.classList.add('hidden');

      // Oppdater feed eller last inn på nytt
      location.reload(); // eller renderFeedPosts() hvis du har en funksjon for det
    } catch (error) {
      console.error('Feil ved oppdatering:', error);
    }
  });

  // Content image
  const contentImg = document.createElement('img');
  contentImg.src =
    post.media &&
    typeof post.media.url === 'string' &&
    post.media.url.trim().startsWith('http')
      ? post.media.url
      : '../img/noimg.jpg';

  contentImg.alt =
    post.media && typeof post.media.alt === 'string'
      ? post.media.alt
      : 'Default fallback image';

  contentImg.className = 'h-40 w-full w-3 mx-auto object-cover ring-green-500';

  // Bottom content
  const bottom = document.createElement('div');
  bottom.className = 'bg-white py-1 rounded-b-md';

  const heartIcon = document.createElement('i');
  heartIcon.className = 'fa-solid fa-heart fa-sm px-0.5 pl-4 text-red-600';

  const commentIcon = document.createElement('i');
  commentIcon.className = 'fa-regular fa-comment fa-sm px-0.5';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'flex flex-row';

  const paragraph = document.createElement('p');
  paragraph.className = 'text-[12px] px-0.5 py-1 pl-4';

  const userSpan = document.createElement('span');
  userSpan.className = 'pr-1 font-bold';
  userSpan.textContent = `@${post.author?.name || 'user'}:`;

  const postText = document.createTextNode(post.body || '');

  paragraph.appendChild(userSpan);

  paragraph.appendChild(postText);
  textWrapper.appendChild(paragraph);

  bottom.appendChild(heartIcon);
  bottom.appendChild(commentIcon);
  bottom.appendChild(textWrapper);

  // Put it all together
  card.appendChild(topRow);
  card.appendChild(contentImg);
  card.appendChild(bottom);

  // Legg til data-attributter for søk
  card.dataset.title = post.title || '';
  card.dataset.body = post.body || '';
  card.dataset.tags = (post.tags || []).join(',');
  card.dataset.author = post.author?.name || '';
  card.dataset.created = post.created || '';

  return card;
}
