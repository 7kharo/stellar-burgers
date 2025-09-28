import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getFeed,
  selectFeedData,
  selectFeedLoading
} from '../../slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const feedData = useSelector(selectFeedData);
  const orders: TOrder[] = feedData.orders;
  const feedLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(getFeed());
  }, []);

  if (!orders.length || feedLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeed())} />;
};
