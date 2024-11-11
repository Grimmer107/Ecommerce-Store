import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { login, googleLogin, passwordReset } from 'reduxStore/actions/user';
import { CredentialResponse } from 'utils/types';
import { Draft } from 'immer';
import {
  getItemFromLocalStorage,
  setItemToLocalStorage,
  removeItemFromLocalStorage,
} from 'reduxStore/utils';

const initialState: CredentialResponse = {
  isLoading: false,
  credentialDetails: getItemFromLocalStorage('credentialDetails', {}),
  error: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.credentialDetails = null;
      removeItemFromLocalStorage('credentialDetails');
    },
    clearLoginErrors(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    // password reset
    builder.addCase(passwordReset.fulfilled, (state, action) => {
      state.error = '';
    });
    builder.addCase(passwordReset.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addMatcher(
      (action: PayloadAction) => isAnyOf(login.pending, googleLogin.pending)(action),
      (state) => {
        state.isLoading = true;
      },
    );

    builder.addMatcher(
      (action: PayloadAction) => isAnyOf(login.fulfilled, googleLogin.fulfilled)(action),
      (state: Draft<CredentialResponse>, action: PayloadAction) => {
        state.isLoading = false;
        state.error = '';
        state.credentialDetails = action.payload!;
        setItemToLocalStorage('credentialDetails', state.credentialDetails);
      },
    );

    builder.addMatcher(
      (action: PayloadAction) => isAnyOf(login.rejected, googleLogin.rejected)(action),
      (state: Draft<CredentialResponse>, action: PayloadAction<any>) => {
        state.error = action.payload! as string;
        state.isLoading = false;
      },
    );
  },
});

export const { clearLoginErrors } = userSlice.actions;
