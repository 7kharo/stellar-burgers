import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearAllIngredients
} from '../../slices/constructorSlice';
import { TIngredient } from '../../utils/types';

describe('Тесты constructorSlice', () => {
  const initialState = {
    bun: null,
    items: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockFilling: TIngredient = {
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
  };

  test('тест инициализации слайса', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('тест добавления булки', () => {
    const action = addIngredient(mockBun);
    const result = constructorReducer(initialState, action);
    
    expect(result.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(result.items).toHaveLength(0);
  });

  test('тест добавления начинки', () => {
    const action = addIngredient(mockFilling);
    const result = constructorReducer(initialState, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      ...mockFilling,
      id: expect.any(String)
    });
    expect(result.bun).toBeNull();
  });

  test('тест удаления ингредиента', () => {
    const stateWithItems = {
      bun: null,
      items: [
        { ...mockFilling, id: '123' },
        { ...mockFilling, id: '456' }
      ]
    };
    
    const action = removeIngredient({ ...mockFilling, id: '123' });
    const result = constructorReducer(stateWithItems, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('456');
  });

  test('тест очистки элементов начинки', () => {
    const stateWithItems = {
      bun: mockBun,
      items: [{ ...mockFilling, id: '123' }]
    };
    
    const result = constructorReducer(stateWithItems, clearAllIngredients());
    expect(result).toEqual(initialState);
  });

  test('тест перемещения начинки вверх', () => {
    const stateWithItems = {
      bun: null,
      items: [
        { ...mockFilling, id: '1' },
        { ...mockFilling, id: '2' },
        { ...mockFilling, id: '3' }
      ]
    };
    
    const action = moveIngredientUp({ ...mockFilling, id: '2' });
    const result = constructorReducer(stateWithItems, action);
    
    expect(result.items[0].id).toBe('2');
    expect(result.items[1].id).toBe('1');
    expect(result.items[2].id).toBe('3');
  });

  test('тест перемещения начинки вниз', () => {
    const stateWithItems = {
      bun: null,
      items: [
        { ...mockFilling, id: '1' },
        { ...mockFilling, id: '2' },
        { ...mockFilling, id: '3' }
      ]
    };
    
    const action = moveIngredientDown({ ...mockFilling, id: '2' });
    const result = constructorReducer(stateWithItems, action);
    
    expect(result.items[0].id).toBe('1');
    expect(result.items[1].id).toBe('3');
    expect(result.items[2].id).toBe('2');
  });
});