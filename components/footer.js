/**
 * Loads the footer HTML component and appends it to the end of the body.
 *
 * Fetches the HTML content from '../components/footer.html' and inserts it
 * into the body of the document using `insertAdjacentHTML` with the 'beforeend' position.
 *
 * @function
 * @returns {void}
 */
export function loadFooter() {
  fetch('../components/footer.html')
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch((error) => console.error('Error loading footer:', error));
}
