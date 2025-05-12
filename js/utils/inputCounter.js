export function setupInputCounter(inputElement, maxLength) {
  if (!inputElement) return;

  // Lag en teller ved siden av input
  const counter = document.createElement('div');
  counter.className = 'text-xs text-gray-500 mb-1 text-right';
  inputElement.insertAdjacentElement('afterend', counter);

  const updateCounter = () => {
    const length = inputElement.value.length;
    counter.textContent = `${length}/${maxLength}`;
    if (length > maxLength) {
      counter.classList.add('text-red-500');
    } else {
      counter.classList.remove('text-red-500');
    }
  };

  inputElement.addEventListener('input', updateCounter);
  updateCounter();
}
