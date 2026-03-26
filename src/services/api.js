const API_BASE_URL = 'http://localhost:8000/api';

const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.slice(-10);
};

const extractApiErrorMessage = (error, status) => {
  if (typeof error?.detail === 'string') {
    return error.detail;
  }
  if (typeof error?.error === 'string') {
    return error.error;
  }
  if (error && typeof error === 'object') {
    const firstKey = Object.keys(error)[0];
    if (firstKey) {
      const value = error[firstKey];
      if (Array.isArray(value) && value.length) {
        return String(value[0]);
      }
      if (typeof value === 'string') {
        return value;
      }
    }
  }
  return `API Error: ${status}`;
};

const toCollection = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  return Array.isArray(data?.results) ? data.results : [];
};

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(extractApiErrorMessage(error, response.status));
  }
  
  return response.json();
};

export const authAPI = {
  sendOTP: (phone) => 
    apiCall('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: normalizePhone(phone),
        channel: 'SMS',
      }),
    }),
  
  verifyOTP: (phone, otp, referredByCode = '', fullName = '') =>
    apiCall('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: normalizePhone(phone),
        otp_code: String(otp || '').replace(/\D/g, '').slice(0, 6),
        referred_by_code: String(referredByCode || '').trim().toUpperCase(),
        full_name: String(fullName || '').trim(),
      }),
    }),
};

export const catalogAPI = {
  getCategories: async () => {
    const data = await apiCall('/catalog/categories/');
    return toCollection(data);
  },
  
  getCategory: (id) =>
    apiCall(`/catalog/categories/${id}/`),
};

export const ordersAPI = {
  createOrder: (orderData) =>
    apiCall('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  getOrders: async () => {
    const data = await apiCall('/orders/');
    return toCollection(data);
  },
};

export const userAPI = {
  getMe: () => apiCall('/auth/users/me/'),

  updateProfile: (payload) =>
    apiCall('/auth/users/update_profile/', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getAddresses: async () => {
    const data = await apiCall('/auth/addresses/');
    return toCollection(data);
  },

  createAddress: (payload) =>
    apiCall('/auth/addresses/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateAddress: (id, payload) =>
    apiCall(`/auth/addresses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  setDefaultAddress: (id) =>
    apiCall(`/auth/addresses/${id}/set_default/`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  deleteAccount: () =>
    apiCall('/auth/users/delete_account/', {
      method: 'DELETE',
      body: JSON.stringify({}),
    }),
};

export const serviceAPI = {
  bookCall: (payload) =>
    apiCall('/catalog/service-requests/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default apiCall;
