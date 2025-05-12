/**
 * Login functionality for the application.
 * This module handles user login, token management, and redirection after successful login.
 * It also includes validation for the login form inputs.
 * @module login
 */

import { API_BASE_URL } from '../api/api.js';
import { isLoggedIn } from './auth.js';
import { loadNavbar } from '../../components/navbar.js';
import { validateInput } from '../utils/validation.js';
import { handleFeedback } from '../utils/handlers/feedback.js';

loadNavbar();

if (isLoggedIn()) {
  const user = localStorage.getItem('accessToken');
  const payload = JSON.parse(atob(user.split('.')[1]));
  const username = payload.name;

  window.location.href = `../viewprofile/index.html?user=${username}`;
}

/** function to handle user login.
 * @function login
 * @param {string} url - The URL to send the login request to.
 * @param {object} data - The login data containing email and password.
 * @returns {Promise<object>} - A promise that resolves to the login result.
 * @description This function sends a POST request to the specified URL with the login data.
 * It handles the response, stores the access token in local storage, and redirects the user to their profile page.
 */
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

    if (!response.ok) {
      const json = await response.json();
      const errorMessage = json.errors?.[0]?.message || 'Registration failed.';

      handleFeedback(errorMessage, 'danger');
      return;
    }

    const result = await response.json();
    const accessToken = result.data.accessToken;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('profileData', JSON.stringify(result.data));

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const username = payload.name;

    window.location.href = `../viewprofile/index.html?user=${username}`;
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/** Event listener for the login button.
 * @description This function handles the click event on the login button.
 * It validates the input fields and calls the login function with the provided data.
 */

document.getElementById('login-button').addEventListener('click', (event) => {
  event.preventDefault();

  const userLogin = {
    email: document.getElementById('email').value.trim().toLowerCase(), // Konverterer e-post til små bokstaver
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
