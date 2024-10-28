import React from 'react';
import { Link } from 'react-router-dom';
import { PageRoutes } from '../consts/routes';
import { Button } from 'flowbite-react';

const SignOut = () => {
  const onSignOut = () => {
    localStorage.removeItem('token');
  };

  return (
    <Button onClick={onSignOut} className='uppercase' color='light' size='xs'>
      <Link to={PageRoutes.SignIn}>sign out</Link>
    </Button>
  );
};

export default SignOut;
