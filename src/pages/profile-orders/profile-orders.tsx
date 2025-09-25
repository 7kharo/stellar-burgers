import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getMyOrders,
  selectFeedData,
  selectMyOrders
} from '../../slices/feedSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectMyOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
