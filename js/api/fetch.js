/** fetch.js
 * Fetching data from the API and rendering it on the page.
 * This module contains functions to fetch feed posts, user profile data, and user posts.
 */

/**
 * @module fetch
 * @description This module contains functions to fetch feed posts, user profile data, and user posts.
 * It also includes functions to render the fetched data on the page.
 * @requires module:api
 * @requires module:config
 * @requires module:utils/render
 * */

// api
import {
  getPostUrl,
  singleProfileUrl,
  defaultProfileParams,
  defaultPostParams,
} from './api.js';

// config
import { getDefaultHeaders } from './config.js';

// utils
import {
  renderFeedPosts,
  renderFollowers,
  renderFollowing,
  renderProfileData,
} from '../utils/render.js';

import { handleError } from '../utils/handlers/errorHandler.js';

/** Fetch feed posts from the API.
 * @description This function fetches posts from the API and returns them as an array.
 * @param {number} limit - The number of posts to fetch.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
export async function fetchFeedPosts(limit, page) {
  const url = getPostUrl({ limit, page });
  console.log('Fetching posts from:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      handleError(errorData, 'Failed to fetch feed posts', 'danger');
      throw new Error('Network response was not ok');
    }

    const posts = await response.json();
    return posts.data || [];
  } catch (error) {
    // Handle error and display feedback to the user
    handleError(error, 'Failed to fetch feed posts', 'danger');
    return [];
  }
}

// fetch user profile data
const profileImage = document.getElementById('profileImg');
const profileUsername = document.getElementById('username');
const profileEmail = document.getElementById('email');
const followersCount = document.getElementById('followers');
const postCount = document.getElementById('postCount');
const followButton = document.getElementById('followButton');

/**
 * Fetch user profile data from the API.
 * @function fetchUserProfile
 * @description This function fetches the profile data of a specific user and updates the UI with the fetched data.
 * @param {string} userId - The ID of the user whose profile to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the user's profile data.
 */

export async function fetchUserProfile(userId) {
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

    const userData = await response.json();

    renderFollowers(userData.data.followers, 10);
    renderFollowing(userData.data.following, 10);

    // update profile data
    renderProfileData(
      userData.data,
      profileImage,
      profileUsername,
      profileEmail,
      followersCount,
      postCount,
    );

    return userData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Function to fetch user posts from the API.
 * * @function fetchUserPosts
 * * @param {string} userId - The ID of the user whose posts to fetch.
 * * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 * * @description This function fetches posts from a specific user and renders them into the feed.
 *
 */

export async function fetchUserPosts(userId) {
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

    renderFeedPosts(data.data || []); // Render posts into the feed

    console.log('User posts data:', data); // Debugging log for user posts
    console.log('data.dat:', data.data);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}
