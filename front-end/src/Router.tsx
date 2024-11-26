import React from 'react';
import { Navigate, Route, Routes as RoutesComponent } from 'react-router-dom';
import SignUp from './pages/signup/Signup';
import SignIn from './pages/signin/Signin';
import { PageRoutes } from 'consts/routes';
import { useIsAuthenticated } from './hooks/useAuth';
import Spinner from './components/Spinner';
import Verify from './pages/verify/Verify';
import Channels from './pages/channels/Channels';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';

const Router = () => {
  const { isLoading } = useIsAuthenticated();

  if (isLoading) {
    return (
      <div className='h-full w-full bg-red-400'>
        <Spinner />
      </div>
    );
  }

  return (
    <RoutesComponent>
      <Route path={PageRoutes.Home} element={<Home />} />
      <Route path={PageRoutes.SignIn} element={<SignIn />} />
      <Route path={PageRoutes.SignUp} element={<SignUp />} />
      <Route path={PageRoutes.Verify} element={<Verify />} />
      {/*<Route path={PageRoutes.Channels} element={<Channels />} />*/}
      <Route path={PageRoutes.Chat} element={<Chat />} />
      {/*<Route path={PageRoutes.Users} element={<UsersComponent />} />*/}
      {/*<Route path={PageRoutes.Groups} element={<GroupsComponent />} />*/}
      <Route path='*' element={<Navigate to={PageRoutes.Home} replace />} />

      {/*<Route path='*' element={<Navigate to={Routes.home} />} />*/}
    </RoutesComponent>
  );
};

export default Router;
