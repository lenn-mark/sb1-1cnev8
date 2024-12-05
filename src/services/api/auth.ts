import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const register = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/forgot-password`, { email });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to send reset email');
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to reset password');
  }
};