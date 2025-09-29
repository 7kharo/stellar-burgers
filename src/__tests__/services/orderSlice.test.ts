import orderReducer, {
  clearOrder,
  orderBurger,
  getOrderByNumber
} from '../../slices/orderSlice';
import { TOrder } from '../../utils/types';

describe('Тесты orderSlice', () => {
  const initialState = {
    orderData: null,
    orderRequest: false,
    errorText: ''
  };

  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['1', '2', '1']
  };

  test('тест инициализации слайса', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Тесты процесса заказа бургера', () => {
    test('тест загрузки во время отправки заказа', () => {
      const action = { type: orderBurger.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.errorText).toBe('');
      expect(state.orderData).toBeNull();
    });

    test('тест получения успешного ответа при заказе', () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
      expect(state.errorText).toBe('');
    });

    test('тест получения ошибки при заказе', () => {
      const action = {
        type: orderBurger.rejected.type,
        error: { message: 'Order failed' }
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.errorText).toBe('Order failed');
      expect(state.orderData).toBeNull();
    });
  });

  describe('Тесты получения заказа по его номеру', () => {
    test('тест загрузки во время отправки запроса', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.errorText).toBe('');
    });

    test('тест получения успешного ответа при запросе заказа', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
      expect(state.errorText).toBe('');
    });

    test('тест получения ошибки при запросе заказа', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Order not found' }
      };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.errorText).toBe('Order not found');
    });
  });

  describe('Тесты очистки заказа', () => {
    test('тест функции очистки заказа', () => {
      const stateWithOrder = {
        orderData: mockOrder,
        orderRequest: false,
        errorText: 'Error'
      };

      const state = orderReducer(stateWithOrder, clearOrder());
      expect(state).toEqual(initialState);
    });
  });
});
