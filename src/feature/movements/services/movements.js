import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('login-token');

export const createMovement = createAsyncThunk(
  'movements/createMovement',
  async (data) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const res = await fetch(`${BASE_URL}/api/movements`, options);
    const result = await res.json();
    return result;
  },
);

export default createMovement;