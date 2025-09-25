import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../slices/ingredientsSlice';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getUser, setAuthUser } from '../../slices/userSlice';
import { getCookie } from '../../utils/cookie';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const background = location.state?.background;

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleClose = () => {
    navigate(-1);
  };
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute authOnly={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute authOnly={false}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute authOnly={false}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute authOnly={false}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute authOnly>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute authOnly>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute authOnly>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Детали заказа'} onClose={handleClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute authOnly>
                <Modal title={'Информация о заказе'} onClose={handleClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
