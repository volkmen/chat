import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageRoutes } from '../consts/routes';
import { Button } from 'flowbite-react';

const SignOut = () => {
  const navigate = useNavigate();
  const onSignOut = () => {
    localStorage.removeItem('token');
    navigate(PageRoutes.Home);
  };

  return (
    <Button onClick={onSignOut} className='uppercase' color='light' size='xs'>
      sign out
    </Button>
  );
};

export default SignOut;
