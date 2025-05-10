import { API_BASE_URL } from '../../api/api.js';
import { defaultHeaders } from '../../api/config.js';
import { renderFeedPosts } from '../render.js';

import { handleError } from './errorHandler.js';

export async function refreshFeed() {
  try {
    const response = await fetch(`${API_BASE_URL}/social/posts?_author=true`, {
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error('Klarte ikke å hente feed');
    }

    const json = await response.json();
    const posts = json.data;

    if (Array.isArray(posts)) {
      renderFeedPosts(posts);
    } else {
      console.error('Forventet array i json.data, fikk:', posts);
    }
  } catch (error) {
    handleError(error, 'Kunne ikke oppdatere feeden', 'default');
    console.error('Feil i refreshFeed():', error);
  }
}
