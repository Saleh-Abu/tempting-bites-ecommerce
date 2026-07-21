import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // OPEN CART
    openCart: (state) => {
      state.isOpen = true;
    },

    // CLOSE CART
    closeCart: (state) => {
      state.isOpen = false;
    },

    // TOGGLE CART
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    // ADD TO CART
    addToCart: (state, action) => {
      const newItem = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.id === newItem.id &&
          item.weight === newItem.weight
      );

      if (existingItem) {
        existingItem.quantity +=
          newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }

      // Automatically open cart after adding
      state.isOpen = true;
    },

    // INCREASE QUANTITY
    increaseQuantity: (state, action) => {
      const { id, weight } = action.payload;

      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.weight === weight
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // DECREASE QUANTITY
    decreaseQuantity: (state, action) => {
      const { id, weight } = action.payload;

      const item = state.items.find(
        (item) =>
          item.id === id &&
          item.weight === weight
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (cartItem) =>
              !(
                cartItem.id === id &&
                cartItem.weight === weight
              )
          );
        }
      }
    },

    // REMOVE ITEM
    removeFromCart: (state, action) => {
      const { id, weight } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === id &&
            item.weight === weight
          )
      );
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;