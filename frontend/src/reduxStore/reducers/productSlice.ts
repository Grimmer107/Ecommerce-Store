import { createSlice } from '@reduxjs/toolkit';
import { fetchProduct } from 'reduxStore/actions/products';

const initialState: { isLoading: boolean; product: Array<any>; error: string } = {
  isLoading: false,
  product: [],
  error: '',
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.product = action.payload as any;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isLoading = false;
      state.product = [];
    });
  },
});
