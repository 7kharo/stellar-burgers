import { getIngredientsApi } from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IIngredientsState {
  isLoading: boolean;
  errorText: string;
  items: TIngredient[];
}

const initialState: IIngredientsState = {
  isLoading: false,
  errorText: '',
  items: []
};

const getIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredientsSlice',
  initialState,
  reducers: {
    clearError: (state) => {
      state.errorText = '';
    }
  },
  selectors: {
    selectIngredientsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.errorText,
    selectIngredientsItems: (state) => state.items
  },

  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message as string;
      });
  }
});

export const { clearError } = ingredientsSlice.actions;
export const {
  selectIngredientsLoading,
  selectIngredientsError,
  selectIngredientsItems
} = ingredientsSlice.selectors;
export { getIngredients };
export default ingredientsSlice.reducer;
