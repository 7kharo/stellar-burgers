import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import {
  loginUser,
  selectUserError,
  selectUserLoading
} from '../../slices/userSlice';
import { Preloader } from '@ui';
import { AppDispatch } from 'src/services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const errorText = useSelector(selectUserError);
  const userLoading = useSelector(selectUserLoading);

  const pathFrom = location.state?.from || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!password || !email) {
      return;
    }

    dispatch(loginUser({ email, password })).then((data) => {
      navigate(pathFrom, { replace: true });
    });
  };

  if (userLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
