// api
import { postUrl, singleProfileUrl } from './api.js';
import { getDefaultHeaders } from './config.js';

// utils
import { renderProfileData } from '../utils/render.js';
import { createProfileCard } from '../utils/dom/profileposts.js';

export async function fetchFeedPosts() {
  try {
    const response = await fetch(postUrl, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const posts = await response.json();
    console.log('Fetched posts:', posts); // Log the fetched posts
    return posts.data || []; // ✅ Returnér array direkte
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return []; // Returnér tomt array ved feil
  }
}
const profileImage = document.getElementById('profileImg');
const profileUsername = document.getElementById('username');
const profileEmail = document.getElementById('email');

export async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`${singleProfileUrl}/${userId}`, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    console.log('Profile data:', data);

    // Default email if none provided
    renderProfileData(data.data, profileImage, profileUsername, profileEmail); // Render profile data into UI elements

    // Debugging log for profile data
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`${singleProfileUrl}/${userId}/posts`, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    console.log(
      'Raw posts data:',
      data,
      'Type:',
      typeof data,
      'Is array:',
      Array.isArray(data),
    );

    console.log('User posts data:', data); // Debugging log for user posts
    renderProfilePosts(data.data || []); // Render posts into the feed
    console.log('Posts:', data); // Debugging log for posts
    return data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

export function renderProfilePosts(posts) {
  const postContainer = document.getElementById('postContainer');
  postContainer.innerHTML = ''; // Clear existing posts
  posts.forEach((post) => {
    const postCard = createProfileCard(post);
    postContainer.appendChild(postCard);
  });
}
