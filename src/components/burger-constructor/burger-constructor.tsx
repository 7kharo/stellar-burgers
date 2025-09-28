import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearAllIngredients,
  selectConstructorBun,
  selectConstructorItems
} from '../../slices/constructorSlice';
import {
  clearOrder,
  orderBurger,
  selectOrderData,
  selectOrderRequest
} from '../../slices/orderSlice';
import { selectUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectConstructorItems);
  const bun = useSelector(selectConstructorBun);
  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearOrder());
    }
  }, [dispatch]);

  const onOrderClick = () => {
    if (!user) {
      return navigate('/login', { replace: true });
    }
    if (constructorItems.bun && constructorItems.ingredients.length) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );

      dispatch(
        orderBurger([
          constructorItems.bun._id,
          ...ingredientsIds,
          constructorItems.bun._id
        ])
      );
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearAllIngredients());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
