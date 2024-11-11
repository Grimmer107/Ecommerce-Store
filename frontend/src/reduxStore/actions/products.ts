import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorHandler } from 'utils/utils';

export const fetchProducts = createAsyncThunk(
  'products',
  async ({ category, filter }: any, { rejectWithValue }) => {
    try {
      const url = new URL(`${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/products`);
      if (category) {
        url.searchParams.set('category', category);
      }
      if (filter) {
        url.searchParams.set('sort_order', filter);
      }
      let response = await axios.get(url.toString());

      response = response.data.results.map((product: any) => {
        const { id, name, image, price, quantity } = product;
        return {
          id: id,
          name: name,
          image: image,
          price: price,
          available: quantity > 0,
        };
      });
      return response;
    } catch (err: any) {
      return rejectWithValue(errorHandler(err));
    }
  },
);

export const fetchProduct = createAsyncThunk('product', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_API_URL}/store/api/v1/products/${id}`,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorHandler(err));
  }
});
