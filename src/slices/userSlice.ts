import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        'Ошибка входа: возможно неправильный e-mail или пароль'
      );
    }
  }
);

const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => (await updateUserApi(data)).user
);

const getUser = createAsyncThunk('user/getUser', async (_, { dispatch }) => {
  const isTokenExists = (): boolean => !!getCookie('accessToken');

  try {
    if (isTokenExists()) {
      const user = await getUserApi();
      dispatch(setUser(user.user));
    }
  } catch (error: any) {
    if (error.message.includes('403') || error.message.includes('401')) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  } finally {
    dispatch(setIsAuthChecked(true));
  }
});

export type TUserState = {
  user: TUser | null;
  isAuthCheck: boolean;
  isLoading: boolean;
  errorText: string;
};

const initialState: TUserState = {
  user: null,
  isAuthCheck: false,
  isLoading: false,
  errorText: ''
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
    },
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthCheck = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectUserError: (state) => state.errorText,
    selectUserLoading: (state) => state.isLoading,
    selectIsAuthCheck: (state) => state.isAuthCheck
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = (action.payload as string) || 'Ошибка входа';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Ошибка выхода из системы';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText =
          action.error.message || 'Ошибка обновления данных пользователя';
      });
  }
});

export const { setUser, setIsAuthChecked } = userSlice.actions;
export const {
  selectUser,
  selectUserError,
  selectUserLoading,
  selectIsAuthCheck
} = userSlice.selectors;
export { loginUser, logoutUser, registerUser, updateUser, getUser };
export default userSlice.reducer;
