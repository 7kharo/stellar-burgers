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
import { deleteCookie, setCookie } from '../utils/cookie';

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

const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: any) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Ошибка авторизации');
    }
  }
);

export type TUserState = {
  user: TUser;
  isAuth: boolean;
  isAuthCheck: boolean;
  isLoading: boolean;
  errorText: string;
};

const initialState: TUserState = {
  user: {
    email: '',
    name: ''
  },
  isAuth: false,
  isAuthCheck: false,
  isLoading: false,
  errorText: ''
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectAuthUser: (state) => state.isAuth,
    selectUserError: (state) => state.errorText,
    selectUserLoading: (state) => state.isLoading,
    selectIsUserAuth: (state) =>
      state.user.name !== '' && state.user.email !== '',
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
          state.isAuth = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Ошибка регистрации';
        state.isAuth = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = (action.payload as string) || 'Ошибка входа';
        state.isAuth = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
        state.isAuth = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = {
          email: '',
          name: ''
        };
        state.isAuth = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText = action.error.message || 'Ошибка выхода из системы';
        state.isAuth = false;
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
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.errorText = '';
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthCheck = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorText =
          action.error.message || 'Ошибка запроса данных пользователя';
        state.user = { email: '', name: '' };
        state.isAuth = false;
        state.isAuthCheck = true;
      });
  }
});

export const { setAuthUser } = userSlice.actions;
export const {
  selectUser,
  selectAuthUser,
  selectUserError,
  selectUserLoading,
  selectIsUserAuth,
  selectIsAuthCheck
} = userSlice.selectors;
export { loginUser, logoutUser, registerUser, updateUser, getUser };
export default userSlice.reducer;
