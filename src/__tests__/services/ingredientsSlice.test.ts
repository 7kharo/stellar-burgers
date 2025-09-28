import ingredientsReducer, {
  clearError,
  getIngredients
} from '../../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('Тестs ingredientsSlice', () => {
  const initialState = {
    isLoading: false,
    errorText: '',
    items: []
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
    },
    {
      _id: '2',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
    }
  ];

  test('тест инициализации слайса', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('тест процесса запроса ингредиентов', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.errorText).toBe('');
    expect(state.items).toEqual([]);
  });

  test('тест процесса получения ингредиентов', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.errorText).toBe('');
    expect(state.items).toEqual(mockIngredients);
  });

  test('тест ошибки при запросе ингредиентов', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ingredients loading failed' }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.errorText).toBe('Ingredients loading failed');
    expect(state.items).toEqual([]);
  });
});
