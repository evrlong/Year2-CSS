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

function setupMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Definer toggleVisibility utenfor updateNavbar
function toggleVisibility(links, action) {
  links.forEach((link) => {
    if (link) {
      link.classList[action]('hidden');
    }
  });
}

// Listeners for both desktop and mobile logout links
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

function updateNavbar() {
  const user = localStorage.getItem('accessToken'); // Sjekk om brukeren er logget inn

  const feedLink = document.getElementById('feed-link');
  const profileLink = document.getElementById('profile-link');
  const registerLink = document.getElementById('register-link');

  // Get mobile links
  const mobileFeedLink = document.getElementById('mobile-feed-link');
  const mobileProfileLink = document.getElementById('mobile-profile-link');
  const mobileRegisterLink = document.getElementById('mobile-register-link');

  if (user) {
    const payload = JSON.parse(atob(user.split('.')[1]));
    const username = payload.name;

    // Oppdater profil-lenker med brukernavn som query-param
    if (profileLink)
      profileLink.href = `../viewprofile/index.html?user=${username}`;
    if (mobileProfileLink)
      mobileProfileLink.href = `../viewprofile/index.html?user=${username}`;

    // Endre navbar for autentiserte brukere
    document.getElementById('auth-link-text').textContent = 'Log out';
    document.getElementById('auth-link').href = '#';
    document.getElementById('mobile-auth-link').textContent = 'Log out';

    // Vis relevante lenker for autentiserte brukere
    toggleVisibility(
      [feedLink, profileLink, mobileFeedLink, mobileProfileLink],
      'remove',
    );
    toggleVisibility([registerLink, mobileRegisterLink], 'add');

    addLogoutListeners();
  } else {
    // Endre navbar for ikke-autentiserte brukere
    document.getElementById('auth-link-text').textContent = 'Log in';
    document.getElementById('auth-link').href = '/index.html';
    document.getElementById('mobile-auth-link').textContent = 'Log in';

    // Skjul relevante lenker for ikke-autentiserte brukere
    toggleVisibility(
      [feedLink, profileLink, mobileFeedLink, mobileProfileLink],
      'add',
    );
    toggleVisibility([registerLink, mobileRegisterLink], 'remove');
  }
}

function logout(event) {
  event.preventDefault(); // Avoid redirecting to #
  localStorage.removeItem('accessToken'); // Remove user token from local storage
  localStorage.removeItem('profileData'); // Remove user profile data from local storage
  window.location.href = '../index.html'; // Navigate to the home page
}

// Initialiser navbaren når DOM er lastet
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar(); // Last inn navbaren når siden lastes
  console.log('Navbar loaded');
});
