import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageRoutes } from '../consts/routes';

const SignOut = () => {
  const navigate = useNavigate();

  const onSignOut = () => {
    localStorage.removeItem('token');
    navigate(PageRoutes.SignIn);
  };

  return (
    <p className='text-sm text-gray-400'>
      <Link to={PageRoutes.SignIn}>
        <span className='uppercase text-blue-700 underline'>sign in</span>
      </Link>
    </p>
  );
};

export default SignOut;
