import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getCookie } from '../utils/cookie';

const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        return rejectWithValue('Требуется авторизация');
      }
      const response = await orderBurgerApi(ingredients);
      if (!response.success) {
        return rejectWithValue('Ошибка оформления заказа');
      }

      return response.order;
    } catch (error: any) {
      return rejectWithValue('Ошибка сервера');
    }
  }
);

const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (orderNumber: number) =>
    (await getOrderByNumberApi(orderNumber)).orders[0]
);

export type TOrderState = {
  orderData: TOrder | null;
  orderRequest: boolean;
  errorText: string;
};

const initialState: TOrderState = {
  orderData: null,
  orderRequest: false,
  errorText: ''
};

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    clearOrder(state) {
      (state.orderData = null),
        (state.orderRequest = false),
        (state.errorText = '');
    }
  },
  selectors: {
    selectOrderData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderError: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.errorText = '';
      })
      .addCase(
        orderBurger.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
          state.orderRequest = false;
          state.errorText = '';
        }
      )
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.errorText =
          action.error.message || 'Не удалось отправить данные на сервер';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.errorText = '';
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
          state.orderRequest = false;
          state.errorText = '';
        }
      )
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.errorText =
          action.error.message || 'Не удалось получить данные с сервера';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrderData, selectOrderRequest, selectOrderError } =
  orderSlice.selectors;
export { orderBurger, getOrderByNumber };
export default orderSlice.reducer;
