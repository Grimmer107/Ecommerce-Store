import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginFormData } from 'utils/types';
import { errorHandler } from 'utils/utils';

export const login = createAsyncThunk(
  'regularUserLogin',
  async (formData: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/authentication/api/v1/login/`,
        formData,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(errorHandler(err));
    }
  },
);

export const googleLogin = createAsyncThunk(
  'googleUserLogin',
  async (authCode: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/authentication/api/v1/google/login/`,
        {
          code: authCode,
        },
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue('Google Authentication Error.');
    }
  },
);

export const passwordReset = createAsyncThunk(
  'passwordReset',
  async (
    { email, passwordResetNotify }: { email: string; passwordResetNotify: () => void },
    { rejectWithValue },
  ) => {
    try {
      if (email === '') {
        return rejectWithValue('Email address not entered.');
      }
      await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/authentication/api/v1/password/reset/`,
        {
          email: email,
        },
      );
      passwordResetNotify();
    } catch (err: any) {
      return rejectWithValue(errorHandler(err));
    }
  },
);
