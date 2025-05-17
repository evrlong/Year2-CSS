import { handleFeedback } from '../js/utils/handlers/feedback.js';
import { handleError } from '../js/utils/handlers/errorHandler.js';
import { postUrl } from '../js/api/api.js';
import { defaultHeaders } from '../js/api/config.js';
import { setupInputCounter } from '../js/utils/inputCounter.js';

import { allPosts } from '../js/components/allPosts.js'; // ! Global variable to store all posts

/**
 * Loads the create post HTML component and injects it into the DOM.
 *
 * After loading the HTML from '/components/createPost.html', it injects the content
 * into the element with the ID 'createPost-container', and initializes the post
 * creation functionality using the provided render function and post data.
 *
 * @async
 * @param {Function} renderPosts - A function to render posts in the UI.
 * @param {Array<Object>} postsToRender - An array of post objects to be rendered.
 *
 * @returns {Promise<void>} A promise that resolves when the HTML is loaded and initialized.
 */
export async function addCreateToHtml(renderPosts, postsToRender) {
  try {
    const container = document.querySelector('#createPost-container');
    const response = await fetch('/components/createPost.html');
    if (!response.ok) throw new Error('Failed to load createPost.html');

    const html = await response.text();
    container.innerHTML = html;

    // Initialize the post creation functionality after the HTML is added
    initCreatePost(renderPosts, postsToRender);
  } catch (error) {
    console.error('Error loading create post HTML:', error);
    handleError(error.message, 'default');
  }
}

/**
 * Initializes the create post form functionality.
 *
 * Sets up input counters, toggles form visibility, and handles form submission.
 *
 * @param {Function} renderPosts - Function to re-render posts after a new post is created.
 * @param {Array<Object>} postsToRender - Current list of post objects to update with new posts.
 */

export function initCreatePost(renderPosts, postsToRender) {
  const createPostBtn = document.getElementById('createPostBtn');
  const postForm = document.getElementById('postForm');
  const submitBtn = document.getElementById('submitPostBtn');

  if (!createPostBtn || !postForm || !submitBtn) {
    console.error('Required elements are missing from the DOM.');
    return;
  }

  // Set up dynamic input counters
  const postTitleInput = document.getElementById('postTitle');
  const postBodyInput = document.getElementById('postBody');
  setupInputCounter(postTitleInput, 25);
  setupInputCounter(postBodyInput, 250);

  // Toggle form visibility
  createPostBtn.addEventListener('click', () => {
    const icon = createPostBtn.querySelector('i');

    if (icon && icon.classList.contains('fa-xmark')) {
      createPostBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
      createPostBtn.innerHTML =
        '<i class="fa-solid fa-plus font-semibold text-2xl"></i>';
    } else {
      createPostBtn.classList.add('bg-red-500', 'hover:bg-red-600');
      createPostBtn.innerHTML =
        '<i class="fa-solid fa-xmark font-semibold text-2xl"></i>';
    }

    postForm.classList.toggle('scale-0');
  });

  // Submit the new post
  submitBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const postData = getPostData();

    if (!postData) return;

    try {
      const response = await fetch(postUrl, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.errors?.[0]?.message || 'Failed to create post';
        handleError(null, errorMessage, 'danger');
        return;
      }

      const data = await response.json();

      postsToRender.unshift(data.data);
      renderPosts(postsToRender);
      resetForm();
      handleFeedback('New post created successfully!', 'success');

      function resetCreatePostButton() {
        createPostBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
        createPostBtn.innerHTML =
          '<i class="fa-solid fa-plus font-semibold text-2xl"></i>';
      }
      resetCreatePostButton();
      closeForm();
    } catch (error) {
      console.error('Error creating post:', error);
      handleError(
        error.message || 'An error occurred while creating post',
        'default',
      );
    }
  });
}

/**
 * Retrieves and validates the post data from the form inputs.
 *
 * Ensures title and body meet maximum length requirements.
 * Falls back to default text and image if inputs are empty.
 *
 * @returns {Object|null} The post data object if valid, otherwise `null`.
 */

function getPostData() {
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value.trim();
  const mediaUrl = document.getElementById('postImageUrl').value.trim();

  const maxTitleLength = 25;
  const maxBodyLength = 250;

  const postTitle =
    title.length > maxTitleLength
      ? title.slice(0, maxTitleLength).trim()
      : title || 'Ingen tittel';

  const postBody =
    body.length > maxBodyLength
      ? body.slice(0, maxBodyLength).trim()
      : body || 'No text';

  const postMediaUrl =
    mediaUrl ||
    'https://raw.githubusercontent.com/evrlong/Year2-CSS/js2/img/avatars/catavatar.png';

  const isFallbackImage =
    postMediaUrl ===
    'https://raw.githubusercontent.com/evrlong/Year2-CSS/js2/img/avatars/catavatar.png';

  if (postTitle.length > maxTitleLength) {
    handleFeedback(
      `Title is too long. Maximum length is ${maxTitleLength} characters.`,
      'warning',
    );
    return null;
  }

  if (postBody.length > maxBodyLength) {
    handleFeedback(
      `Body is too long. Maximum length is ${maxBodyLength} characters.`,
      'warning',
    );
    return null;
  }

  return {
    title: postTitle,
    body: postBody,
    tags: ['filterEvr'],
    media: {
      url: postMediaUrl,
      alt: 'Bilde',
    },
  };
}

/**
 * Clears all input fields in the create post form.
 */

function resetForm() {
  document.getElementById('postTitle').value = '';
  document.getElementById('postBody').value = '';
  document.getElementById('postImageUrl').value = '';
}
/**
 * Closes the create post form by adding the 'scale-0' class.
 */

function closeForm() {
  const postForm = document.getElementById('postForm');
  setTimeout(() => {
    postForm.classList.add('scale-0');
  }, 10);
}
