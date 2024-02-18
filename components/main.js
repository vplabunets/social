import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { useRouter } from '../router';
import { authStateChangeUser } from '../redux/auth/authOperations';

const Main = () => {
  const dispatch = useDispatch();

  let { stateChange } = useSelector((state) => state.auth);
  const routing = useRouter(stateChange);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
