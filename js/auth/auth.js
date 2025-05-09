import { loadNavbar } from '../../components/navbar.js';

function getToken() {
  return localStorage.getItem('accessToken');
}

// Decode the JWT token
function decodeToken(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

// Check if the user is logged in
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  console.log(payload);
  console.log(payload.name);

  if (!payload) return false;
  if (payload.exp && payload.exp < Date.now() / 1000) {
    console.log('Outdated token, logging out...');
    logOut();
    return false;
  }

  return true;
}

// Redirect to login page if not logged in
export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '../index.html';
  }
}
