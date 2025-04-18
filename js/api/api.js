export const API_BASE_URL = 'https://v2.api.noroff.dev';

// API endpoint for fetching posts
const params = new URLSearchParams({
  _author: 'true',
  _comments: 'true',
  _reactions: 'true',
});
export const postUrl = `${API_BASE_URL}/social/posts?${params.toString()}`;

export const singleProfileUrl = `${API_BASE_URL}/social/profiles`;
