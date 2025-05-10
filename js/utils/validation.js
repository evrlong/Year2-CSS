import { regexConfig } from './config/regexConfig.js';

// validate input fields
export function validateInput(input, message, minLength, configKey) {
  const { pattern, error } = regexConfig[configKey];
  const value = input.value.trim();
  const isValid = pattern.test(value);
  const isValidLength = value.length >= minLength;

  // Rydd opp
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
// validate confirm password
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
