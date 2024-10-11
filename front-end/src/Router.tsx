import React from 'react';
import { Route, Routes as RoutesComponent } from 'react-router-dom';
import Signup from './pages/signup/Signup';
import Signin from './pages/signin/Signin';
import Home from './pages/home/Home';
import { Routes } from 'consts/routes';

const Router = () => {
  const a = 10;

  return (
    <RoutesComponent>
      <Route path={Routes.home} element={<Home />} />
      <Route path={Routes.signIn} element={<Signin />} />
      <Route path={Routes.signUp} element={<Signup />} />
    </RoutesComponent>
  );
};

export default Router;
