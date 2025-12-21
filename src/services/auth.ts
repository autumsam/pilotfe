const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pilotbe.onrender.com';

// Helper function to get CSRF token from cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Helper function to get CSRF token from the server
async function getCsrfToken(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to get CSRF token');
    }
    
    const data = await response.json();
    return data.csrfToken || '';
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw error;
  }
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
  };
  token: string;
  role?: string;
}

interface AuthError {
  error: string;
  details?: Record<string, string[]>;
}

const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse | AuthError> {
    try {
      // Get the CSRF token from the JSON response
      const csrfResponse = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token');
      }

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;
      
      if (!csrfToken) {
        throw new Error('CSRF token not found in response');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          error: 'Registration failed',
          details: responseData,
        };
      }

      return responseData as AuthResponse;
    } catch (error) {
      return {
        error: 'Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      };
    }
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse | AuthError> {
    try {
      console.log('Starting login process...');
      
      // Get the CSRF token from the JSON response
      const csrfResponse = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        console.error('Failed to get CSRF token:', csrfResponse.status, csrfResponse.statusText);
        throw new Error('Failed to get CSRF token');
      }

      // Get the token from the JSON response instead of cookies
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;
      
      console.log('CSRF Token from response:', csrfToken ? 'received' : 'missing');
      
      if (!csrfToken) {
        throw new Error('CSRF token not found in response');
      }

      console.log('Sending login request...');
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',  // Explicitly request JSON response
          'X-CSRFToken': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',  // Helps identify AJAX requests
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);
      console.log('Login response status:', response.status);
      
      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        console.error('Login failed with status:', response.status, 'Response:', responseData);
        return {
          error: responseData.error || 'Login failed',
          details: responseData.details || responseData,
        };
      }

      console.log('Login successful, user data:', responseData);
      return responseData as AuthResponse;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        error: `Login failed: ${errorMessage}`,
      };
    }
  },

  /**
   * Save auth token to localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('postpulse-token', token);
  },

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('postpulse-token');
  },

  /**
   * Save user data to localStorage
   */
  saveUser(user: AuthResponse['user'], role: string = 'user'): void {
    localStorage.setItem('postpulse-authenticated', 'true');
    localStorage.setItem('postpulse-username', user.username);
    localStorage.setItem('postpulse-email', user.email);
    localStorage.setItem('postpulse-user-id', String(user.id));
    localStorage.setItem('postpulse-user-role', role);
    localStorage.setItem('postpulse-admin', String(user.is_staff));
  },

  /**
   * Clear auth data from localStorage
   */
  logout(): void {
    localStorage.removeItem('postpulse-token');
    localStorage.removeItem('postpulse-authenticated');
    localStorage.removeItem('postpulse-username');
    localStorage.removeItem('postpulse-email');
    localStorage.removeItem('postpulse-user-id');
    localStorage.removeItem('postpulse-user-role');
    localStorage.removeItem('postpulse-admin');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Get authentication header for API calls
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Token ${token}` } : {};
  },
};

export default authService;
