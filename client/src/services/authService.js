import { apiFetch, parseResponse } from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return parseResponse(res);
};

export const register = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return parseResponse(res);
};

export const verifyToken = async () => {
  const res = await apiFetch('/auth/verify');
  return parseResponse(res);
};
