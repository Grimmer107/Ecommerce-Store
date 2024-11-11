import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts } from 'reduxStore/actions/products';
import { getItemFromLocalStorage } from 'reduxStore/utils';

const initialState: {
  isLoading: boolean;
  products: Array<any>;
  error: string;
  category: string;
  filter: string;
} = {
  isLoading: false,
  products: [],
  error: '',
  category: getItemFromLocalStorage('category', ''),
  filter: getItemFromLocalStorage('filter', '') || 'relevance',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = '';
      state.products = action.payload as any;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isLoading = false;
      state.products = [];
    });
  },
});

export const { setCategory, setFilter } = productsSlice.actions;
