/**
 * Handles errors by logging them to the console and displaying a styled error message on the screen.
 *
 * @param {Error} error - The error object to handle.
 * @param {string} message - The message to display and log.
 * @param {'info' | 'warning' | 'danger' | 'default'} grade - The severity grade of the error, which determines the styling of the message.
 *
 * The `grade` parameter accepts the following values:
 * - `'info'`: Blue background with white text.
 * - `'warning'`: Yellow background with black text.
 * - `'danger'`: Red background with white text.
 * - `'default'`: Gray background with white text.
 *
 * The error message is displayed as a fixed-position element on the top-right corner of the screen.
 * It slides in from the right, stays visible for 3 seconds, and then slides out before being removed from the DOM.
 */
export function handleError(error, message, grade) {
  console.error(message, error);

  //
  const gradeClasses = {
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
    danger: 'bg-red-500 text-white',
    default: 'bg-gray-500 text-white',
  };

  const errorMessage = document.createElement('div');
  errorMessage.textContent = message;

  errorMessage.className = `
        fixed top-5 right-0 p-5 rounded z-50
        ${gradeClasses[grade] || gradeClasses.default} 
        animate-slide-in-right
    `;

  document.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.classList.add('animate-slide-out-right');
    setTimeout(() => {
      errorMessage.remove();
    }, 500);
  }, 3000);
}
