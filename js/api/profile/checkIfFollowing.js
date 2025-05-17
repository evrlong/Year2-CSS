/**
 * checkIfFollowing.js
 * Checks if the current user is following a specific user.
 *
 */

/**
 * Checks if the current user is following a specific user by fetching the user's profile data.
 * @function checkIfFollowing
 * @param {string} userId - The ID of the user to check if the current user is following.
 * @return {Promise<boolean>} - Returns true if the current user is following the specified user, false otherwise.
 *
 */

import { getDefaultHeaders } from '../config.js';
import { singleProfileUrl } from '../api.js';
import { defaultProfileParams } from '../api.js';

export async function checkIfFollowing(userId) {
  const queryString = new URLSearchParams(defaultProfileParams).toString();
  const url = `${singleProfileUrl}/${userId}?${queryString}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getDefaultHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();

    const localStorageUser = localStorage.getItem('profileData');
    const parsedUser = JSON.parse(localStorageUser);
    const currentUserName = parsedUser.name;

    if (!currentUserName) {
      console.error('Current user name not found in localStorage');
      return false;
    }

    const isFollowing = data.data.followers.some(
      (follower) => follower.name === currentUserName,
    );

    return isFollowing;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}
