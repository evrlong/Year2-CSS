// api
import {
  getPostUrl,
  singleProfileUrl,
  defaultProfileParams,
  defaultPostParams,
} from './api.js';
import { getDefaultHeaders } from './config.js';

// utils
import { renderProfileData } from '../utils/render.js';
import { renderFeedPosts } from '../utils/render.js';
import { createProfileCard } from '../utils/dom/profileposts.js';

export async function fetchFeedPosts(limit, page) {
  const url = getPostUrl({ limit, page });
  console.log('Fetching posts from:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const posts = await response.json();
    return posts.data || [];
  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return [];
  }
}

// Fetch user profile data

// fetch user profile data
const profileImage = document.getElementById('profileImg');
const profileUsername = document.getElementById('username');
const profileEmail = document.getElementById('email');

// Function to fetch user profile data
export async function fetchUserProfile(userId) {
  // Lag querystring av defaultProfileParams
  const queryString = new URLSearchParams(defaultProfileParams).toString();
  const url = `${singleProfileUrl}/${userId}?${queryString}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    console.log('Profile data:', data);

    // Du kan bruke counts og annen info her
    renderProfileData(data.data, profileImage, profileUsername, profileEmail);

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// fetch user posts
export async function fetchUserPosts(userId) {
  // add extra parameters to the URL if needed
  const queryString = new URLSearchParams(defaultPostParams).toString();
  const url = `${singleProfileUrl}/${userId}/posts?${queryString}`;

  try {
    const response = await fetch(url, {
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
    renderFeedPosts(data.data || []); // Render posts into the feed
    console.log('data.dat:', data.data);
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
