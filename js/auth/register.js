import { API_BASE_URL } from '../api/api.js';

export async function register(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, postData);
    const json = await response.json();
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// submit button event listener
export const submitButton = document.getElementById('register-button');
submitButton.addEventListener('click', (event) => {
  event.preventDefault();

  const userRegister = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  const registerUrl = `${API_BASE_URL}/auth/register`;
  register(registerUrl, userRegister);
});
