export const API_BASE_URL = 'https://v2.api.noroff.dev';

export const defaultPostParams = {
  _author: 'true',
  _comments: 'true',
  _reactions: 'true',
  comments: 'true',
};

export const defaultProfileParams = {
  _count: 'true',
  _posts: 'true',
  _followers: 'true',
  _following: 'true',
};

// Funksjon for å bygge post-URL med ekstra params
export function getPostUrl({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    ...defaultPostParams,
    page: page,
    limit: limit,
  });

  return `${API_BASE_URL}/social/posts?${params.toString()}`;
}

export const singleProfileUrl = `${API_BASE_URL}/social/profiles`;
console.log('Single profile URL:', singleProfileUrl);
export const feedUrl = `${API_BASE_URL}/social/posts`;
