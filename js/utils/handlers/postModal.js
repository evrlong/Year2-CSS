/**
 * Opens a modal displaying the details of a given post.
 *
 * @param {Object} post - The post object containing details to display in the modal.
 * @param {string} post.title - The title of the post.
 * @param {string} [post.created] - The creation date of the post in ISO format.
 * @param {Object} [post.media] - The media object associated with the post.
 * @param {string} [post.media.url] - The URL of the post's media image.
 * @param {string} [post.media.alt] - The alt text for the post's media image.
 * @param {Object} [post.author] - The author object of the post.
 * @param {string} [post.author.name] - The name of the post's author.
 * @param {string} post.body - The main content/body of the post.
 */
export function openPostModal(post) {
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4';

  const content = document.createElement('div');
  content.className =
    'bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col items-center border-4 border-green-400';

  content.innerHTML = `
    <h2 class=" text-xl font-extrabold mb-1 text-gray-900">${post.title}</h2>
    <p class="text-sm text-gray-500 mb-6">${post.created ? post.created.split('T')[0] : ''}</p>
    <img src="${post.media?.url || fallbackImage}" alt="${post.media?.alt || 'Post image'}" class="w-full mb-6 rounded-xl shadow-md object-cover max-h-96"/>
    
    <p class="text-gray-700 text-base whitespace-pre-line mb-6"><span class="pr-1 font-bold">@${post.author?.name || 'Unknown'}:</span>${post.body}</p>
  `;

  const closeButton = document.createElement('button');
  closeButton.className =
    'bg-red-500 hover:bg-red-700 transition-colors duration-300 ease-in-out text-white rounded-full px-5 py-3 shadow-lg focus:outline-none active:scale-95';

  closeButton.innerHTML = `<i class="fa-solid fa-xmark text-lg"></i>`;

  closeButton.setAttribute('aria-label', 'Lukk modal');

  content.appendChild(closeButton);
  modal.appendChild(content);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (
      e.target === modal ||
      e.target === closeButton ||
      e.target.closest('button') === closeButton
    ) {
      modal.remove();
    }
  });
}
