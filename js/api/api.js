/** api.js
 * This module contains functions and constants related to API interactions.
 * It includes the base URL for the API, default parameters for fetching posts and profiles,
 */

export const API_BASE_URL = 'https://v2.api.noroff.dev';

export const defaultPostParams = {
  _author: 'true',
  _comments: 'true',
  _reactions: 'true',
  comments: 'true',
  tag: 'true',
};

export const defaultProfileParams = {
  _count: 'true',
  _posts: 'true',
  _followers: 'true',
  _following: 'true',
};

/** Function to get the URL for fetching posts with pagination.
 * @param {Object} options - Options for pagination.
 * @param {number} options.page - The page number to fetch (default is 1).
 * @param {number} options.limit - The number of posts per page (default is 20).
 * @returns {string} - The URL for fetching posts with the specified parameters.
 */

export function getPostUrl({ page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({
    ...defaultPostParams,
    page: page,
    limit: limit,
  });

  return `${API_BASE_URL}/social/posts?${params.toString()}`;
}

export const postUrl = getPostUrl({ page: 1, limit: 20 });
export const singleProfileUrl = `${API_BASE_URL}/social/profiles`;
export const feedUrl = `${API_BASE_URL}/social/posts`;
