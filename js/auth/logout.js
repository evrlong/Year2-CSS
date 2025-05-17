/**
 * Logs the user out by removing the authentication token from local storage
 * and redirecting to the homepage.
 * @function logOut
 * @description This function removes the `accessToken` from local storage, logs out thge user,
 * and then redirects the user to the homepage (`index.html`).
 */
export function logOut() {
  localStorage.removeItem('accessToken');
  window.location.href = '../index.html';
}
