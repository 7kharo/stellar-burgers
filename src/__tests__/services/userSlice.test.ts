import userReducer, {
  setUser,
  setIsAuthChecked,
  loginUser,
  registerUser,
  logoutUser,
  updateUser
} from '../../slices/userSlice';
import { TUser } from '../../utils/types';

jest.mock('../../utils/cookie', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn(),
  getUserApi: jest.fn()
}));

describe('Тесты userSlice', () => {
  const initialState = {
    user: null,
    isAuthCheck: false,
    isLoading: false,
    errorText: ''
  };

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('тест инициализации слайса', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Тесты синхронных экшенов', () => {
    test('установка пользователя в state', () => {
      const action = setUser(mockUser);
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    test('установка флажка проверки авторизации', () => {
      const action = setIsAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthCheck).toBe(true);
    });
  });

  describe('Тесты проверки регистрации пользователя', () => {
    test('тест загрузки во время отправки пользователя на сервер', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест получения данных при регистрации пользователя', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.errorText).toBe('');
    });

    test('тест ошибки при регистрации пользователя', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Registration failed' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('Registration failed');
    });
  });

  describe('тесты процесса логина пользователя', () => {
    test('тест загрузки во время отправки пользователя на сервер', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест получения данных при логине пользователя', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.errorText).toBe('');
    });

    test('тест ошибки при логине пользователя', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: 'Invalid credentials'
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('Invalid credentials');
    });
  });

  describe('тесты выхода пользователя из аккаунта', () => {
    test('тест загрузки при выходе пользователя из аккаунта', () => {
      const stateWithUser = {
        user: mockUser,
        isAuthCheck: true,
        isLoading: false,
        errorText: ''
      };

      const action = { type: logoutUser.pending.type };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест успешного выхода пользователя из аккаунта', () => {
      const stateWithUser = {
        user: mockUser,
        isAuthCheck: true,
        isLoading: true,
        errorText: ''
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
    });

    test('тест ошибки при выходе пользователя из аккаунта', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'Logout failed' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('Logout failed');
    });
  });

  describe('тесты изменения данных пользователя', () => {
    test('тест загрузки при запросе на изменение данных пользователя', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест успешного изменения данных пользователя', () => {
      const updatedUser = { ...mockUser, name: 'Updated User' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
      expect(state.errorText).toBe('');
    });

    test('тест ошибки при запросе на изменение данных пользователя', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Update failed' }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('Update failed');
    });
  });
});
