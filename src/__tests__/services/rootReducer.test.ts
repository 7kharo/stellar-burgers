import store from '../../services/store';

describe('rootReducer', () => {
  test('Возврат исходного состояния в сторе для неизвестного экшена', () => {
    const initialState = store.getState();

    expect(initialState).toEqual({
      constructorSlice: {
        bun: null,
        items: []
      },
      ingredientsSlice: {
        isLoading: false,
        errorText: '',
        items: []
      },
      orderSlice: {
        orderData: null,
        orderRequest: false,
        errorText: ''
      },
      feedSlice: {
        data: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        myOrders: [],
        isLoading: false,
        errorText: ''
      },
      userSlice: {
        user: null,
        isAuthCheck: false,
        isLoading: false,
        errorText: ''
      }
    });
  });
});
