/** auth.js
 * Authentication and authorization functions for the application.
 * This module handles user login, logout, and token management.
 */

import { loadNavbar } from '../../components/navbar.js';
import { logOut } from './logout.js';

function getToken() {
  return localStorage.getItem('accessToken');
}

/** Decode JWT token to get payload
 * @function decodeToken
 * @description This function decodes a JWT token and returns the payload.
 * @param {string} token - The JWT token to decode.
 * @returns {object|null} - The decoded payload or null if decoding fails.
 

 */

function decodeToken(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/** Check if user is logged ind
 * @function isLoggedIn
 * @description This function checks if the user is logged in by verifying the presence and validity of the JWT token.
 * @returns {boolean} - Returns true if the user is logged in, false otherwise.
 */
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);

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
