import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { selectIsAuthCheck, selectUser } from '../../slices/userSlice';
import { ReactElement } from 'react';

type TProtectedProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthCheck);
  const user = useSelector(selectUser);
  const location = useLocation();

  // console.log('ProtectedRoute debug:', { isAuthChecked, user, onlyUnAuth });

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // for authorized, but unauthorized
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // for unauthorized, but authorized
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return children;
};
