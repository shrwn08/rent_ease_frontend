import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../../services/api";

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

export const addItem = createAsyncThunk(
  "cart/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addToCart(data);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to cart",
      );
    }
  },
);

export const updateItem = createAsyncThunk('cart/update', async ({ productId, data }, { rejectWithValue }) => {
  try { const res = await updateCartItem(productId, data); return res.data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update cart'); }
});

export const removeItem = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try { const res = await removeFromCart(productId); return res.data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to remove item'); }
});

export const emptyCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try { await clearCart(); return { items: [] }; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to clear cart'); }
});

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
      builder
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder
      .addCase(removeItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      builder
      .addCase(emptyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emptyCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(emptyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
