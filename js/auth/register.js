import { API_BASE_URL } from '../api/api.js';

// Register function
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
      console.error('Server error response:', json);
      throw new Error('Registration failed.');
    }

    // Gå til index ved suksess
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Registration failed:', error);
    alert('Registration failed: ' + error.message);
  }
}

// Getting elements
export const submitButton = document.getElementById('register-button');
const avatars = document.querySelectorAll('.avatar');
const avatarInput = document.getElementById('avatar');

// Event listeners for avatars
avatars.forEach((avatar) => {
  avatar.addEventListener('click', () => {
    avatars.forEach((av) =>
      av.classList.remove('border-4', 'border-green-500'),
    );
    avatar.classList.add('border-4', 'border-green-500'); // Legg til markering på valgt avatar
    avatarInput.value = avatar.getAttribute('data-avatar-url').trim(); // Sett avatar URL til input
  });
});

// Event listener for submit button
submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  const avatarValue = avatarInput.value.trim();

  if (!avatarValue) {
    alert('Vennligst velg en avatar.');
    return;
  }

  const userRegister = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    avatar: {
      url: avatarValue,
    },
  };
  //
  const registerUrl = `${API_BASE_URL}/auth/register`;
  register(registerUrl, userRegister);
});
