import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Cart } from 'utils/types';
import {
  getItemFromLocalStorage,
  computeTotalFromCart,
  setItemToLocalStorage,
} from 'reduxStore/utils';

const initialState: { isLoading: boolean; cart: Cart; error: string; total: number } = {
  isLoading: false,
  cart: getItemFromLocalStorage('cart', {}),
  error: '',
  total: computeTotalFromCart(),
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<any>) {
      const product = action.payload;
      if (state.cart[product.id]) {
        state.cart[product.id].quantity += 1;
        state.total += state.cart[product.id].price;
      } else {
        state.cart[product.id] = {
          name: product.name,
          quantity: 1,
          price: Number(product.price),
          image: product.image,
          available: Number(product.quantity),
        };
        state.total += state.cart[product.id].price;
      }
      setItemToLocalStorage('cart', state.cart);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const productId = action.payload;
      if (state.cart[productId]) {
        const { price, quantity } = state.cart[productId];
        state.total -= price * quantity;
        delete state.cart[productId];
      }
      setItemToLocalStorage('cart', state.cart);
    },
    setCartItemQuanity(state, action: PayloadAction<{ productId: string; newQuantity: number }>) {
      const { productId, newQuantity } = action.payload;
      if (state.cart[productId]) {
        const { price, quantity } = state.cart[productId];
        if (newQuantity > quantity) {
          state.total += (newQuantity - quantity) * price;
        } else {
          state.total -= (quantity - newQuantity) * price;
        }
        state.cart[productId].quantity = newQuantity;
      }
      setItemToLocalStorage('cart', state.cart);
    },
    clearCart: (state) => {
      state.cart = {};
      state.total = 0.0;
      setItemToLocalStorage('cart', state.cart);
    },
  },
});
