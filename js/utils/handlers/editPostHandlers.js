// handlers/editPostHandlers.js
import { API_BASE_URL } from '../../api/api.js';
import { defaultHeaders } from '../../api/config.js';
import { handleError } from '../handlers/errorHandler.js';
import { setupInputCounter } from '../inputCounter.js';

const popup = document.getElementById('popup');
const editPostForm = document.getElementById('editPostForm');

export function setupEditPostHandlers() {
  const closeBtn = document.getElementById('closePopupBtn');
  const deleteBtn = document.getElementById('deletePostBtn');
  const saveBtn = document.getElementById('saveEditBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => popup.classList.add('hidden'));
  }

  deleteBtn.addEventListener('click', async () => {
    const postId = editPostForm.dataset.id;
    try {
      const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });
      if (!response.ok) throw new Error('Noe gikk galt ved sletting');
      popup.classList.add('hidden');
      location.reload();
    } catch (error) {
      console.error('Feil ved sletting:', error);
    }
  });

  saveBtn.addEventListener('click', async () => {
    const postId = editPostForm.dataset.id;
    const maxTitleLength = 25;
    const maxBodyLength = 250;
    const updatedPost = {
      title: document.getElementById('editPostTitle').value,
      body: document.getElementById('editPostBody').value,
      media: {
        url: document.getElementById('editPostImageUrl').value,
        alt: 'Updated image',
      },
    };

    if (updatedPost.title.length > maxTitleLength) {
      handleError(
        '',
        `Title must be shorter than ${maxTitleLength} characters.`,
        'warning',
      );
      return;
    }
    if (updatedPost.body.length > maxBodyLength) {
      handleError(
        '',
        `Text must be shorter than ${maxBodyLength} characters.`,
        'warning',
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) throw new Error('Oppdatering feilet');
      popup.classList.add('hidden');
      location.reload();
    } catch (error) {
      console.error('Feil ved oppdatering:', error);
    }
  });
}

export function openEditPopup(post) {
  editPostForm.dataset.id = post.id;
  document.getElementById('editPostTitle').value = post.title || '';
  document.getElementById('editPostBody').value = post.body || '';
  document.getElementById('editPostImageUrl').value = post.media?.url || '';

  const editPostTitle = document.getElementById('editPostTitle');
  const editPostBody = document.getElementById('editPostBody');

  setupInputCounter(editPostTitle, 25);
  setupInputCounter(editPostBody, 250);

  popup.classList.remove('hidden');
}
