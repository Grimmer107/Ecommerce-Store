import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: { searchString: string } = {
  searchString: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },
  },
});
