import { CustomerUser } from '../rtk/services/customer-auth-service';

const CUSTOMER_TOKEN_KEY = 'customer_access_token';
const CUSTOMER_USER_KEY = 'customer_user';
const CUSTOMER_SESSION_EXPIRY_KEY = 'customer_session_expiry';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export interface CustomerSession {
  accessToken: string;
  user: CustomerUser;
  expiresAt: number;
}

export const customerSession = {
  /**
   * Save customer session with 1-day expiry
   */
  save(accessToken: string, user: CustomerUser): void {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    localStorage.setItem(CUSTOMER_TOKEN_KEY, accessToken);
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
    localStorage.setItem(CUSTOMER_SESSION_EXPIRY_KEY, expiresAt.toString());
  },

  /**
   * Get the current session if valid
   */
  get(): CustomerSession | null {
    const accessToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    const userJson = localStorage.getItem(CUSTOMER_USER_KEY);
    const expiresAtStr = localStorage.getItem(CUSTOMER_SESSION_EXPIRY_KEY);

    if (!accessToken || !userJson || !expiresAtStr) {
      return null;
    }

    const expiresAt = parseInt(expiresAtStr, 10);

    // Check if session has expired
    if (Date.now() > expiresAt) {
      this.clear();
      return null;
    }

    try {
      const user = JSON.parse(userJson) as CustomerUser;
      return { accessToken, user, expiresAt };
    } catch {
      this.clear();
      return null;
    }
  },

  /**
   * Check if there's a valid customer session
   */
  isAuthenticated(): boolean {
    return this.get() !== null;
  },

  /**
   * Get the customer user if session is valid
   */
  getUser(): CustomerUser | null {
    return this.get()?.user ?? null;
  },

  /**
   * Get the access token if session is valid
   */
  getToken(): string | null {
    return this.get()?.accessToken ?? null;
  },

  /**
   * Clear the customer session
   */
  clear(): void {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_USER_KEY);
    localStorage.removeItem(CUSTOMER_SESSION_EXPIRY_KEY);
  },

  /**
   * Refresh the session expiry (extend by another day)
   */
  refresh(): void {
    const session = this.get();
    if (session) {
      const newExpiry = Date.now() + SESSION_DURATION_MS;
      localStorage.setItem(CUSTOMER_SESSION_EXPIRY_KEY, newExpiry.toString());
    }
  },
};
