import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  registerUser,
  selectUserError,
  selectUserLoading
} from '../../slices/userSlice';
import { Preloader } from '@ui';
import { register } from 'module';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isRegLoading = useSelector(selectUserLoading);
  const userError = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !password || !email) {
      return;
    }

    dispatch(
      registerUser({
        email: email,
        name: userName,
        password: password
      })
    )
      .unwrap()
      .then(() => {
        navigate('/login');
      });
  };

  if (isRegLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={userError}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
