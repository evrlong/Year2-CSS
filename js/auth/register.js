/** register.js
 * User registration logic for the application.
 * This module handles user registration, input validation, and feedback handling.
 * @module register
 */

import { API_BASE_URL } from '../api/api.js';
import { validateInput, validateConfirmPassword } from '../utils/validation.js';
import { handleFeedback } from '../utils/handlers/feedback.js';

/** Function to handle user registration.
 * @function register
 * @param {string} url - The URL to send the registration request to.
 * @param {object} data - The registration data containing name, email, password, and avatar.
 * @returns {Promise<void>} - A promise that resolves when the registration is complete.
 * @description This function sends a POST request to the specified URL with the registration data.
 * It handles the response and provides feedback to the user.
 */
export async function register(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    const json = await response.json();

    if (!response.ok) {
      // Get error message from response
      const errorMessage = json.errors?.[0]?.message || 'Registration failed.';
      handleFeedback(errorMessage, 'danger');
      return;
    }

    handleFeedback('Registrering fullført! Du sendes videre ...', 'success');

    setTimeout(() => {
      window.location.href = '/index.html';
    }, 3000);
  } catch (error) {
    console.error('Registration failed:', error);
    handleFeedback('Something went wrong', 'danger');
  }
}
// DOM elements
export const submitButton = document.getElementById('register-button');
const avatars = document.querySelectorAll('.avatar');
const avatarInput = document.getElementById('avatar');
const avatarUrlInput = document.getElementById('avatar-url'); // New input for the avatar URL
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const usernameMessage = document.getElementById('username-message');
const emailMessage = document.getElementById('email-message');
const passwordMessage = document.getElementById('password-message');
const confirmPasswordMessage = document.getElementById(
  'confirm-password-message',
);
const avatarMessage = document.getElementById('avatar-message');

// Avatar selection (Image clicks)
avatars.forEach((avatar) => {
  avatar.addEventListener('click', () => {
    avatars.forEach((av) =>
      av.classList.remove('border-4', 'border-green-500'),
    );
    avatar.classList.add('border-4', 'border-green-500');
    avatarInput.value = avatar.getAttribute('data-avatar-url').trim();
    avatarUrlInput.value = ''; // Clear the URL input when an avatar is selected
    avatarMessage.textContent = '';
    avatarMessage.classList.add('hidden');
  });
});

// Avatar URL input handling
avatarUrlInput.addEventListener('input', () => {
  const url = avatarUrlInput.value.trim();
  if (url) {
    avatarInput.value = url; // Update the avatar value with the URL from the input
    avatarMessage.textContent = ''; // Clear any avatar message
    avatarMessage.classList.add('hidden');
  }
});

// Input validation listeners
nameInput.addEventListener('input', () => {
  validateInput(nameInput, usernameMessage, 3, 'username');
});

emailInput.addEventListener('input', () => {
  validateInput(emailInput, emailMessage, 10, 'email');
});

passwordInput.addEventListener('input', () => {
  validateInput(passwordInput, passwordMessage, 6, 'password');
});

confirmPasswordInput.addEventListener('input', () => {
  validateConfirmPassword(
    passwordInput,
    confirmPasswordInput,
    confirmPasswordMessage,
  );
});

/** Event listener for the register button.
 * @description This function handles the click event on the register button.
 * It validates the input fields and calls the register function with the provided data.
 */
submitButton.addEventListener('click', async (event) => {
  event.preventDefault();

  // Hent og konverter inputene til små bokstaver
  const avatarValue = avatarInput.value.trim();
  const isAvatarValid = avatarValue.length > 0;

  const nameValue = nameInput.value.trim(); // Brukernavn konverteres til små bokstaver
  const isNameValid = validateInput(nameInput, usernameMessage, 3, 'username');

  const emailValue = emailInput.value.trim().toLowerCase(); // E-post konverteres til små bokstaver
  const isEmailValid = validateInput(emailInput, emailMessage, 15, 'email');

  const isPasswordValid = validateInput(
    passwordInput,
    passwordMessage,
    6,
    'password',
  );
  const isConfirmPasswordValid = validateConfirmPassword(
    passwordInput,
    confirmPasswordInput,
    confirmPasswordMessage,
  );

  // Vis feilmelding for avatar hvis den ikke er valgt
  if (!isAvatarValid) {
    avatarMessage.textContent = 'please choose an avatar';
    avatarMessage.classList.remove('hidden');
  } else {
    avatarMessage.textContent = '';
    avatarMessage.classList.add('hidden');
  }

  if (
    !isNameValid ||
    !isEmailValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid ||
    !isAvatarValid
  ) {
    return;
  }

  const userRegister = {
    name: nameValue, // Bruker det konverterte navnet
    email: emailValue, // Bruker den konverterte e-posten
    password: passwordInput.value,
    avatar: {
      url: avatarValue,
    },
  };

  // UI-feedback under registrering
  submitButton.disabled = true;
  submitButton.textContent = 'Registrerer...';

  const registerUrl = `${API_BASE_URL}/auth/register`;
  await register(registerUrl, userRegister);

  submitButton.disabled = false;
  submitButton.textContent = 'Registrer';
});
