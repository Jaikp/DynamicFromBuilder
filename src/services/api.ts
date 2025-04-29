import axios from 'axios';
import { FormResponse, UserData } from '@/types/form';

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = async (userData: UserData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-user`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getForm = async (rollNumber: string) => {
  try {
    const response = await axios.get<FormResponse>(`${API_BASE_URL}/get-form`, {
      params: { rollNumber }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};