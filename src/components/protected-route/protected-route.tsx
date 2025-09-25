import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import {
  selectAuthUser,
  selectIsAuthCheck,
  selectIsUserAuth,
  selectUserLoading
} from '../../slices/userSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  authOnly?: boolean;
};

export const ProtectedRoute = ({
  children,
  authOnly = false
}: ProtectedRouteProps) => {
  const isAuthUser = useSelector(selectIsUserAuth);
  const isAuthCheck = useSelector(selectIsAuthCheck);
  const location = useLocation();

  if (!isAuthCheck) {
    return <Preloader />;
  }

  if (authOnly) {
    if (!isAuthUser) {
      return <Navigate replace to='/login' state={{ from: location }} />;
    }
    return children;
  }

  if (isAuthUser) {
    const from = location.state?.from || '/';
    return <Navigate replace to={from} />;
  }

  return children;
};
