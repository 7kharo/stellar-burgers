import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export const getFeed = createAsyncThunk('feeds/fetchFeeds', async () =>
  getFeedsApi()
);

export const getMyOrders = createAsyncThunk('feeds/fetchMyOrders', async () =>
  getOrdersApi()
);

export type IFeedState = {
  data: TOrdersData;
  myOrders: TOrder[];
  isLoading: boolean;
  errorText: string;
};

const initialState: IFeedState = {
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  myOrders: [],
  isLoading: false,
  errorText: ''
};

const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {},
  selectors: {
    selectFeedData: (state) => state.data,
    selectMyOrders: (state) => state.myOrders,
    selectFeedLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        (state.isLoading = true), (state.errorText = '');
      })
      .addCase(
        getFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          (state.isLoading = false),
            (state.data = action.payload),
            (state.errorText = '');
        }
      )
      .addCase(getFeed.rejected, (state, action) => {
        (state.isLoading = false),
          (state.errorText =
            action.error.message || 'Не удалось загрузить данные с сервера');
      })
      .addCase(getMyOrders.pending, (state) => {
        (state.isLoading = true), (state.errorText = '');
      })
      .addCase(
        getMyOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          (state.isLoading = false),
            (state.myOrders = action.payload),
            (state.errorText = '');
        }
      )
      .addCase(getMyOrders.rejected, (state, action) => {
        (state.isLoading = false),
          (state.errorText =
            action.error.message || 'Не удалось загрузить данные с сервера');
      });
  }
});

export const {
  selectFeedData,
  selectMyOrders,
  selectFeedLoading,
  selectFeedError
} = feedSlice.selectors;
export default feedSlice.reducer;
