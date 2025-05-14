// footer.js
export function loadFooter() {
  fetch('../components/footer.html')
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch((error) => console.error('Error loading footer:', error));
}
