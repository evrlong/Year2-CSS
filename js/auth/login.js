import { API_BASE_URL } from '../api/api.js';
import { isLoggedIn } from './auth.js';
import { loadNavbar } from '../../components/navbar.js';

loadNavbar();

// Check if the user is already logged in
if (isLoggedIn()) {
  window.location.href = '/profile/index.html';
}

async function login(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, postData);
    console.log(response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    const accessToken = result.data.accessToken;
    const profileData = result.data;

    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('accessToken', accessToken);
    // Redirect to the home page after successful login
    const user = localStorage.getItem('accessToken'); // Sjekk om brukeren er logget inn
    const payload = JSON.parse(atob(user.split('.')[1]));
    const username = payload.name;
    window.location.href = `../viewprofile/index.html?user=${username}`;
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// submit button event listener
const submitButton = document.getElementById('login-button');
submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  const userLogin = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  login(`${API_BASE_URL}/auth/login`, userLogin)
    .then((result) => {
      console.log('Login successful:', result);
    })
    .catch((error) => {
      console.error('Login failed:', error);
    });
});
