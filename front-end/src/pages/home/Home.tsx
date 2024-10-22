import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';
import SignOut from '../../components/SignOut';

const Home = () => (
  <div className='text-red-600'>
    <SignOut />
  </div>
);

export default Home;
