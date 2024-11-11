import { combineReducers } from '@reduxjs/toolkit';
import {
  userSlice,
  productSlice,
  productsSlice,
  cartSlice,
  searchSlice,
} from 'reduxStore/reducers';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  products: productsSlice.reducer,
  product: productSlice.reducer,
  cart: cartSlice.reducer,
  search: searchSlice.reducer,
});
