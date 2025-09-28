import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getMyOrders,
  selectFeedError,
  selectFeedLoading,
  selectMyOrders
} from '../../slices/feedSlice';
import { Preloader } from '../../components/ui/preloader/preloader';
import { selectUser } from '../../slices/userSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectMyOrders);
  const dispatch = useDispatch();

  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      dispatch(getMyOrders());
    }
  }, [dispatch, user]);

  console.log('ProfileOrders debug:', { orders, isLoading, error });

  if (isLoading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
