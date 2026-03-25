const API_BASE_URL = 'http://localhost:8000/api';

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
    throw new Error(error.detail || `API Error: ${response.status}`);
  }
  
  return response.json();
};

export const authAPI = {
  sendOTP: (phone) => 
    apiCall('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phone }),
    }),
  
  verifyOTP: (phone, otp) =>
    apiCall('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phone, otp }),
    }),
};

export const catalogAPI = {
  getCategories: () =>
    apiCall('/categories/'),
  
  getCategory: (id) =>
    apiCall(`/categories/${id}/`),
};

export const ordersAPI = {
  createOrder: (orderData) =>
    apiCall('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  getOrders: () =>
    apiCall('/orders/'),
};

export default apiCall;
