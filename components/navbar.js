/**
 * Loads the navbar HTML component and initializes menu toggle and navbar updates.
 *
 * Fetches the navbar HTML from '../components/navbar.html' and inserts it into the
 * element with the ID 'navbar-container'. Initializes the menu toggle functionality
 * and updates the navbar based on the user's authentication status.
 *
 * @function
 * @returns {void}
 */
export function loadNavbar() {
  fetch('../components/navbar.html')
    .then((response) => response.text())
    .then((html) => {
      document.querySelector('#navbar-container').innerHTML = html;
      setupMenuToggle();
      updateNavbar();
    })
    .catch((error) => {
      console.error('Error loading navbar:', error);
    });
}

/**
 * Sets up the event listener for the menu toggle button, which controls the visibility
 * of the mobile menu on small screens.
 *
 * @function
 * @returns {void}
 */
function setupMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('max-h-screen');

    mobileMenu.classList.toggle('max-h-0', isOpen);
    mobileMenu.classList.toggle('opacity-0', isOpen);
    mobileMenu.classList.toggle('max-h-screen', !isOpen);
    mobileMenu.classList.toggle('opacity-100', !isOpen);
  });
}

/**
 * Toggles the visibility of elements by adding or removing the 'hidden' class.
 *
 * @param {Array<HTMLElement>} links - Array of elements to toggle visibility on.
 * @param {string} action - Action to perform, either 'add' or 'remove' the 'hidden' class.
 * @returns {void}
 */
function toggleVisibility(links, action) {
  links.forEach((link) => {
    if (link) {
      link.classList[action]('hidden');
    }
  });
}

/**
 * Adds event listeners to logout links on both desktop and mobile views.
 *
 * @returns {void}
 */
function addLogoutListeners() {
  const authLinks = [
    document.getElementById('auth-link'),
    document.getElementById('mobile-auth-link'),
  ];

  authLinks.forEach((link) => {
    if (link) {
      link.addEventListener('click', logout);
    }
  });
}

/**
 * Updates the navbar based on the user's authentication status.
 *
 * If the user is authenticated, updates the profile link and shows authenticated-only links.
 * If the user is not authenticated, shows login-related links and hides authenticated-only links.
 *
 * @returns {void}
 */
function updateNavbar() {
  const user = localStorage.getItem('accessToken'); // Check if the user is logged in

  const feedLink = document.getElementById('feed-link');
  const profileLink = document.getElementById('profile-link');
  const registerLink = document.getElementById('register-link');

  // Get mobile links
  const mobileFeedLink = document.getElementById('mobile-feed-link');
  const mobileProfileLink = document.getElementById('mobile-profile-link');
  const mobileRegisterLink = document.getElementById('mobile-register-link');

  const currentPath = window.location.pathname;

  if (currentPath.includes('feed')) {
    feedLink?.classList.add('after:w-full');
    mobileFeedLink?.classList.add('after:w-full');
  }

  if (currentPath.includes('profile')) {
    profileLink?.classList.add('after:w-full');
    mobileProfileLink?.classList.add('after:w-full');
  }

  if (user) {
    const payload = JSON.parse(atob(user.split('.')[1]));
    const username = payload.name;

    // Update profile links with the username as a query parameter
    if (profileLink)
      profileLink.href = `../viewprofile/index.html?user=${username}`;
    if (mobileProfileLink)
      mobileProfileLink.href = `../viewprofile/index.html?user=${username}`;

    // Change navbar for authenticated users
    document.getElementById('auth-link-text').textContent = 'Log out';
    document.getElementById('auth-link').href = '#';
    document.getElementById('mobile-auth-link').textContent = 'Log out';

    // Show relevant links for authenticated users
    toggleVisibility(
      [feedLink, profileLink, mobileFeedLink, mobileProfileLink],
      'remove',
    );
    toggleVisibility([registerLink, mobileRegisterLink], 'add');

    addLogoutListeners();
  } else {
    // Change navbar for unauthenticated users
    document.getElementById('auth-link-text').textContent = 'Log in';
    document.getElementById('auth-link').href = '/index.html';
    document.getElementById('mobile-auth-link').textContent = 'Log in';

    // Hide relevant links for unauthenticated users
    toggleVisibility(
      [feedLink, profileLink, mobileFeedLink, mobileProfileLink],
      'add',
    );
    toggleVisibility([registerLink, mobileRegisterLink], 'remove');
  }
}

/**
 * Logs the user out by removing the access token and profile data from local storage
 * and redirecting to the home page.
 *
 * @param {Event} event - The event object generated when the logout link is clicked.
 * @returns {void}
 */
function logout(event) {
  event.preventDefault(); // Avoid redirecting to #
  localStorage.removeItem('accessToken'); // Remove user token from local storage
  localStorage.removeItem('profileData'); // Remove user profile data from local storage
  window.location.href = '../index.html'; // Navigate to the home page
}

/**
 * Initializes the navbar when the DOM content has fully loaded.
 *
 * @event DOMContentLoaded
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar(); // Load the navbar when the page loads
});
