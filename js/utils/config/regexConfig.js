export const regexConfig = {
  username: {
    /**
     * Only allows letters (A-Z, a-z), numbers (0-9), underscores (_), dots (.), and hyphens (-).
     * Does NOT allow spaces or special characters like @, !, etc.
     */
    pattern: /^[a-zA-Z0-9_-]+$/,
    error:
      'Username can only include letters, numbers, underscores (_) and hyphens (-)',
  },

  email: {
    /**
     * Must be a valid email ending with @noroff.no or @stud.noroff.no
     */
    pattern: /^[^\s@]+@(stud\.)?noroff\.no$/,
    error: 'Email must be @noroff.no or @stud.noroff.no',
  },

  password: {
    /**
     * Minimum 8 characters, no spaces (any non-whitespace characters allowed).
     */
    pattern: /^\S{8,}$/, // Note: \S matches any non-whitespace
    error: 'Password must be at least 8 characters with no spaces',
  },
};
