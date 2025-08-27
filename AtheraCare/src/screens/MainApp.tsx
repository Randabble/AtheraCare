import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RoleRouter from '../navigation/RoleRouter';

const MainApp = () => {
  return (
    <NavigationContainer>
      <RoleRouter />
    </NavigationContainer>
  );
};

export default MainApp;
