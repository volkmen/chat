import React from 'react';
import { Link } from 'react-router-dom';
import { PageRoutes } from '../consts/routes';

const SignOut = () => {
  const onSignOut = () => {
    localStorage.removeItem('token');
  };

  return (
    <p className='text-sm text-gray-400' onClick={onSignOut}>
      <Link to={PageRoutes.SignIn}>
        <span className='uppercase text-blue-700 underline'>sign out</span>
      </Link>
    </p>
  );
};

export default SignOut;
