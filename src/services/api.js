const API_BASE_URL = 'http://localhost:8080/api';

// Token store helper
const tokenStore = {
  getAccessToken: () => localStorage.getItem('paypulse_access_token'),
  setAccessToken: (token) => localStorage.setItem('paypulse_access_token', token),
  getRefreshToken: () => localStorage.getItem('paypulse_refresh_token'),
  setRefreshToken: (token) => localStorage.setItem('paypulse_refresh_token', token),
  getUser: () => {
    const userStr = localStorage.getItem('paypulse_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => localStorage.setItem('paypulse_user', JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem('paypulse_access_token');
    localStorage.removeItem('paypulse_refresh_token');
    localStorage.removeItem('paypulse_user');
  }
};

// Queue to hold requests while refreshing token
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// Custom fetch wrapper with interceptor for 401 Unauthorized and auto-refresh
async function fetchWithAuth(url, options = {}) {
  options.headers = options.headers || {};
  
  const accessToken = tokenStore.getAccessToken();
  if (accessToken) {
    options.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, options);

  if (res.status === 401) {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth-expired'));
      throw new Error('Session expired');
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshRes.ok) {
          throw new Error('Refresh failed');
        }

        const data = await refreshRes.json();
        tokenStore.setAccessToken(data.accessToken);
        tokenStore.setRefreshToken(data.refreshToken);
        tokenStore.setUser({ id: data.userId, username: data.username, email: data.email });
        
        isRefreshing = false;
        onRefreshed(data.accessToken);
      } catch (err) {
        isRefreshing = false;
        tokenStore.clear();
        window.dispatchEvent(new Event('auth-expired'));
        throw new Error('Session expired. Please log in again.');
      }
    }

    // Wait for the token refresh to complete
    const retryOrigRequest = new Promise((resolve) => {
      subscribeTokenRefresh((newToken) => {
        options.headers['Authorization'] = `Bearer ${newToken}`;
        resolve(fetch(url, options));
      });
    });

    res = await retryOrigRequest;
  }

  return res;
}

export const api = {
  // Authentication
  login: async (usernameOrEmail, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Invalid credentials');
    }
    const data = await res.json();
    tokenStore.setAccessToken(data.accessToken);
    tokenStore.setRefreshToken(data.refreshToken);
    tokenStore.setUser({ id: data.userId, username: data.username, email: data.email });
    return data;
  },

  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Failed to register');
    }
    return res.text();
  },

  logout: async () => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      tokenStore.clear();
    }
  },

  getCurrentUser: () => {
    return tokenStore.getUser();
  },

  isAuthenticated: () => {
    return !!tokenStore.getAccessToken();
  },

  // Dashboard statistics
  getDashboardStats: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  },

  // Salary Records
  getSalaryRecords: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/salaries`);
    if (!res.ok) throw new Error('Failed to fetch salary records');
    return res.json();
  },

  getSalaryRecord: async (id) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/salaries/${id}`);
    if (!res.ok) throw new Error('Failed to fetch salary record');
    return res.json();
  },

  createSalaryRecord: async (data) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/salaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create salary record');
    return res.json();
  },

  updateSalaryRecord: async (id, data) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/salaries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update salary record');
    return res.json();
  },

  deleteSalaryRecord: async (id) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/salaries/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete salary record');
    return true;
  },

  // Increments
  getIncrements: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/increments`);
    if (!res.ok) throw new Error('Failed to fetch salary increments');
    return res.json();
  },

  createIncrement: async (data) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/increments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log increment');
    return res.json();
  },

  updateIncrement: async (id, data) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/increments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update increment');
    return res.json();
  },

  deleteIncrement: async (id) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/increments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete increment');
    return true;
  },

  // Expenses CRUD
  getExpenses: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/expenses`);
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  },

  createExpense: async (data) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create expense');
    return res.json();
  },

  deleteExpense: async (id) => {
    const res = await fetchWithAuth(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return true;
  },

  // Export CSV URL - note that download must include Authorization if using simple standard fetch
  getExportCsvUrl: () => `${API_BASE_URL}/salaries/export/csv`,

  downloadCsv: async () => {
    const res = await fetchWithAuth(`${API_BASE_URL}/salaries/export/csv`);
    if (!res.ok) throw new Error('Failed to export CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_records.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};
