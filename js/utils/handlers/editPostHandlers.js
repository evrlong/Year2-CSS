// handlers/editPostHandlers.js
import { API_BASE_URL } from '../../api/api.js';
import { defaultHeaders } from '../../api/config.js';

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
    const updatedPost = {
      title: document.getElementById('editPostTitle').value,
      body: document.getElementById('editPostBody').value,
      media: {
        url: document.getElementById('editPostImageUrl').value,
        alt: 'Updated image',
      },
    };
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
  popup.classList.remove('hidden');
}
