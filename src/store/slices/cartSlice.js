import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart } from "../../services/api";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCart();
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null, loading: false, error: null },
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
