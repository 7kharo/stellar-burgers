import feedReducer, { getFeed, getMyOrders } from '../../slices/feedSlice';
import { TOrder, TOrdersData } from '../../utils/types';

describe('Тесты feedSlice', () => {
  const initialState = {
    data: {
      orders: [],
      total: 0,
      totalToday: 0
    },
    myOrders: [],
    isLoading: false,
    errorText: ''
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Space флюоресцентный бургер',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 12345,
      ingredients: ['1', '2', '1']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Люминесцентный краторный бургер',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 12346,
      ingredients: ['3', '4']
    }
  ];

  const mockFeedData: TOrdersData = {
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  test('тест инициализации слайса', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Проверка результатов получения списка заказов', () => {
    test('тест загрузки заказов', () => {
      const action = { type: getFeed.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест получения заказов', () => {
      const action = {
        type: getFeed.fulfilled.type,
        payload: mockFeedData
      };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockFeedData);
      expect(state.errorText).toBe('');
    });

    test('тест ошибки при получении заказов', () => {
      const action = {
        type: getFeed.rejected.type,
        error: { message: 'Feed loading failed' }
      };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('Feed loading failed');
    });
  });

  describe('Проверка результатов получения списка личных заказов', () => {
    test('тест загрузки личных заказов', () => {
      const action = { type: getMyOrders.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест получения личных заказов', () => {
      const action = {
        type: getMyOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.myOrders).toEqual(mockOrders);
      expect(state.errorText).toBe('');
    });

    test('тест ошибки получения личных заказов', () => {
      const action = {
        type: getMyOrders.rejected.type,
        error: { message: 'My orders loading failed' }
      };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errorText).toBe('My orders loading failed');
    });
  });
});
