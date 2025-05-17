/**
 * Displays a feedback message on the screen with dynamic styling and animations.
 *
 * @param {string} message - The feedback message to display.
 * @param {('info'|'warning'|'danger'|'default'|'success')} grade - The grade of the feedback,
 * determining the styling. Defaults to 'default' if an invalid grade is provided.
 *
 * The available grades and their corresponding styles are:
 * - 'info': Blue background with white text.
 * - 'warning': Yellow background with black text.
 * - 'danger': Red background with white text.
 * - 'default': Gray background with white text.
 * - 'success': Green background with white text.
 *
 * The feedback message will appear at the top-right corner of the screen,
 * stay visible for 3 seconds, and then slide out before being removed.
 */
export function handleFeedback(message, grade) {
  const gradeClasses = {
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
    danger: 'bg-red-500 text-white',
    default: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
  };

  const feedbackMessage = document.createElement('div');
  feedbackMessage.textContent = message;

  feedbackMessage.className = `
            fixed top-5 right-0 p-5 rounded z-50
            ${gradeClasses[grade] || gradeClasses.default} 
            animate-slide-in-right
        `;

  document.body.appendChild(feedbackMessage);

  setTimeout(() => {
    feedbackMessage.classList.add('animate-slide-out-right');
    setTimeout(() => {
      feedbackMessage.remove();
    }, 500);
  }, 3000);
}
