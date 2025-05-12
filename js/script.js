// import { loadFooter } from '../components/footer.js';

// const menuToggle = document.getElementById('menu-toggle');
// const mobileMenu = document.getElementById('mobile-menu');

// // menuToggle.addEventListener('click', () => {
// //   mobileMenu.classList.toggle('hidden');
// // });

// Henter alle lenkene
const links = document.querySelectorAll('.nav-link');
// Henter nåværende URL-filnavn
const currentPage = window.location.pathname.split('/').pop();

links.forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('border-blue-500');
  }
});
