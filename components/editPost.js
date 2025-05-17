/**
 * Loads the edit post HTML component and injects it into the DOM.
 *
 * Fetches the HTML content from '../components/editPost.html' and inserts it into
 * the element with ID 'edit-post-container'. After injection, it initializes the
 * edit post functionality by calling `setupEditPostHandlers()`.
 *
 * @function
 * @returns {void}
 */
export function loadEditPost() {
  fetch('../components/editPost.html')
    .then((response) => response.text())
    .then((html) => {
      document.querySelector('#edit-post-container').innerHTML = html;
      setupEditPostHandlers();
    })
    .catch((error) => {
      console.error('Error loading edit post:', error);
    });
}
