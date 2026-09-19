// Admin Authentication & Master PIN Management for CARGAS NGV Platform

const ADMIN_PIN_KEY = 'cng_admin_system_pin';
const ADMIN_AUTH_SESSION_KEY = 'cng_admin_authed_v1';
export const DEFAULT_ADMIN_PIN = '000000';

/**
 * Retrieves the currently configured Admin Master Password/PIN.
 * Defaults to '000000' if not previously set or customized.
 */
export const getAdminPassword = (): string => {
  try {
    const saved = localStorage.getItem(ADMIN_PIN_KEY);
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }
  } catch (e) {
    console.error('Failed to read admin password from localStorage', e);
  }
  return DEFAULT_ADMIN_PIN;
};

/**
 * Updates the Admin Master Password/PIN in persistent storage.
 */
export const setAdminPassword = (newPassword: string): boolean => {
  try {
    const trimmed = newPassword.trim();
    if (!trimmed) return false;
    localStorage.setItem(ADMIN_PIN_KEY, trimmed);
    return true;
  } catch (e) {
    console.error('Failed to save admin password to localStorage', e);
    return false;
  }
};

/**
 * Verifies if the provided password matches the configured Admin Password.
 */
export const verifyAdminPassword = (candidatePassword: string): boolean => {
  const currentPin = getAdminPassword();
  return candidatePassword.trim() === currentPin;
};

/**
 * Checks if the current browser session has already unlocked Admin access.
 */
export const isSessionAdminAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Marks the current session as authenticated (or clears it on logout).
 */
export const setSessionAdminAuthenticated = (authenticated: boolean): void => {
  try {
    if (authenticated) {
      sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    }
  } catch {
    // Ignore storage issues
  }
};

/**
 * Resets the Admin Master Password back to the factory default '000000'.
 */
export const resetAdminPassword = (): void => {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, DEFAULT_ADMIN_PIN);
  } catch (e) {
    console.error('Failed to reset admin password', e);
  }
};
