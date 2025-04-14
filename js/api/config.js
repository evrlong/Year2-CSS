export const apiKey = 'e75f8fed-0fe8-456e-a5ba-23a2e3fe6dce';

// API endpoint for fetching posts
export function getDefaultHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'x-Noroff-API-key': apiKey,
  };
}
