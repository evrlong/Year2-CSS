export const regexConfig = {
  username: {
    pattern: /^[a-zA-Z0-9_.-]+$/,
    error: 'Invalid characters in username',
  },
  email: {
    pattern: /^[^\s@]+@(stud\.)?noroff\.no$/,
    error: 'only @noroff.no / @stud.noroff.no',
  },

  password: {
    pattern: /^[\S]{8,}$/, // minimum 6 tegn, ingen mellomrom
    error: 'minimum 8 characters, no spaces',
  },
};
