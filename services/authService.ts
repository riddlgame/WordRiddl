// This service simulates a basic authentication flow.
// In a real application, this would involve API calls, JWTs, etc.

const ADMIN_PASSWORD = 'riddlword@01123581321';
const SESSION_KEY = 'wordish_admin_session';

const login = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    // In a real app, you'd get a token from the server here.
    // For this simulation, we'll just set a flag in sessionStorage.
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    } catch (e) {
      console.error("Could not set session storage.", e);
      // Fallback for environments where sessionStorage is not available
      return true;
    }
  }
  return false;
};

const logout = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("Could not remove item from session storage.", e);
  }
};

const isAdmin = (): boolean => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {
    console.error("Could not get item from session storage.", e);
    return false;
  }
};

export const authService = {
  login,
  logout,
  isAdmin,
};
