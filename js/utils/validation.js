import { regexConfig } from './config/regexConfig.js';

/**
 * Validates an input field against a regex pattern and minimum length.
 * Displays appropriate success or error messages with icons.
 *
 * @param {HTMLInputElement} input - The input element to validate.
 * @param {HTMLElement} message - The element to display validation messages.
 * @param {number} minLength - Minimum number of characters required.
 * @param {string} configKey - The key to access the regex pattern and error message from regexConfig.
 * @returns {boolean} Returns true if input is valid and meets length requirement, false otherwise.
 */
export function validateInput(input, message, minLength, configKey) {
  const { pattern, error } = regexConfig[configKey];
  const value = input.value.trim();
  const isValid = pattern.test(value);
  const isValidLength = value.length >= minLength;

  // Clear previous messages
  message.classList.add('hidden');
  message.textContent = '';

  const warningIcon = document.createElement('i');
  warningIcon.classList.add(
    'fa-solid',
    'fa-circle-exclamation',
    'text-red-600',
    'text-sm',
    'mr-1',
  );

  const successIcon = document.createElement('i');
  successIcon.classList.add(
    'fa-solid',
    'fa-circle-check',
    'text-green-600',
    'text-sm',
    'mr-1',
  );

  if (!isValid && value.length > 0) {
    input.classList.remove('bg-green-200', 'border-green-500');
    input.classList.add('border-red-500');
    message.appendChild(warningIcon);
    message.appendChild(document.createTextNode(error));
    message.classList.remove('hidden');
    return false;
  } else if (!isValidLength) {
    input.classList.remove('bg-green-200', 'border-green-500');
    input.classList.add('border-red-500');
    message.appendChild(warningIcon);
    message.appendChild(
      document.createTextNode(`Minimum ${minLength} characters.`),
    );
    message.classList.remove('hidden');
    return false;
  } else {
    input.classList.remove('border-red-500');
    input.classList.add('bg-green-200', 'border-green-500');
    message.appendChild(successIcon);
    message.appendChild(document.createTextNode('Check!'));
    message.classList.remove('hidden');
    return isValid && isValidLength;
  }
}

/**
 * Validates that the confirm password input matches the original password input.
 * Displays success or error messages with icons accordingly.
 *
 * @param {HTMLInputElement} passwordInput - The original password input element.
 * @param {HTMLInputElement} confirmInput - The confirm password input element.
 * @param {HTMLElement} message - The element to display validation messages.
 * @returns {boolean} Returns true if passwords match, false otherwise.
 */
export function validateConfirmPassword(passwordInput, confirmInput, message) {
  const password = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();

  message.classList.add('hidden');
  message.textContent = '';

  const warningIcon = document.createElement('i');
  warningIcon.classList.add(
    'fa-solid',
    'fa-circle-exclamation',
    'text-red-600',
    'text-sm',
    'mr-1',
  );

  const successIcon = document.createElement('i');
  successIcon.classList.add(
    'fa-solid',
    'fa-circle-check',
    'text-green-600',
    'text-sm',
    'mr-1',
  );

  if (confirm !== password) {
    confirmInput.classList.remove('bg-green-200', 'border-green-500');
    confirmInput.classList.add('border-red-500');
    message.appendChild(warningIcon);
    message.appendChild(document.createTextNode('Passwords do not match'));
    message.classList.remove('hidden');
    return false;
  } else {
    confirmInput.classList.remove('border-red-500');
    confirmInput.classList.add('bg-green-200', 'border-green-500');
    message.appendChild(successIcon);
    message.appendChild(document.createTextNode('Passwords match'));
    message.classList.remove('hidden');
    return true;
  }
}
