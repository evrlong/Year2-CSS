/** config.js
 * Configuration file for API settings and default headers.
 * This file contains the API key, base URL, and default headers for API requests.
 */

export const apiKey = 'e75f8fed-0fe8-456e-a5ba-23a2e3fe6dce';

/**
 * @function getDefaultHeaders
 * @description This function returns an object containing the default headers for API requests.
 * @returns {Object} - An object containing the default headers for API requests.
 */
export function getDefaultHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    'x-Noroff-API-key': apiKey,
  };
}

export const defaultHeaders = getDefaultHeaders();
