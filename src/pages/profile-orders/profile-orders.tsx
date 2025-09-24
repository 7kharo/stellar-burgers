import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyOrders,
  selectFeedData,
  selectMyOrders
} from '../../slices/feedSlice';
import { AppDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectMyOrders);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getMyOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
