import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorBurger,
  TConstructorIngredient,
  TIngredient
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

const initialState: TConstructorBurger = {
  bun: null,
  items: []
};

const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4()
        }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.items.push(action.payload);
        }
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    moveIngredientUp(state, action: PayloadAction<TConstructorIngredient>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      const prevItem = state.items[index - 1];
      state.items.splice(index - 1, 2, action.payload, prevItem);
    },
    moveIngredientDown(state, action: PayloadAction<TConstructorIngredient>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      const nextItem = state.items[index + 1];
      state.items.splice(index, 2, nextItem, action.payload);
    },
    clearAllIngredients: (state) => {
      state.bun = null;
      state.items = [];
    }
  },
  selectors: {
    selectConstructorBun: (state) => state.bun,
    selectConstructorItems: (state) => state.items
  }
});

export const {
  addIngredient,
  removeIngredient,
  clearAllIngredients,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;
export const { selectConstructorBun, selectConstructorItems } =
  constructorSlice.selectors;
export default constructorSlice.reducer;
