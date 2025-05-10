export function logOut() {
  localStorage.removeItem('accessToken');
  window.location.href = '../index.html';
}
