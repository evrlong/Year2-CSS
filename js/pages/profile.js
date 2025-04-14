// auth
import { requireAuth } from '../auth/auth.js';

// utils
import { renderProfileData } from '../utils/render.js';

requireAuth();

const token = localStorage.getItem('accessToken');
console.log(token);

const payload = JSON.parse(atob(token.split('.')[1]));
console.log('payload', payload.name);

// Get profile data from localStorage
const profileData = JSON.parse(localStorage.getItem('profileData'));
console.log('profileData', profileData);

// Get the profile container element
const profileImage = document.getElementById('profileImg');
const profileUsername = document.getElementById('username');
const profileEmail = document.getElementById('email');

// Render profile data on the page
renderProfileData(profileData, profileImage, profileUsername, profileEmail);
