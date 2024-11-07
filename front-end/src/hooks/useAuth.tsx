import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { ME_QUERY } from 'api/account';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';

function getAccountVerified(data?: { Me: { is_verified: boolean } }) {
  return Boolean(data?.Me.is_verified);
}

export const useIsAuthenticated = () => {
  const [fetchMe, { loading, data, error }] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'cache-and-network'
  });
  const location = useLocation();
  const navigate = useNavigate();
  const isSuccess = data && !error && !loading;
  const isError = Boolean(error);
  const isVerified = getAccountVerified(data);

  const token = localStorage.getItem('token');

  React.useEffect(() => {
    fetchMe({ fetchPolicy: 'network-only' });
  }, [token]);

  const shouldRenderVerifyPage = isSuccess && !isVerified && location.pathname !== PageRoutes.Verify;

  const shouldRenderSignInPage =
    isError && location.pathname !== PageRoutes.SignIn && location.pathname !== PageRoutes.SignUp;

  console.log(isSuccess, isVerified);
  const shouldRenderHomePage =
    isSuccess &&
    isVerified &&
    (location.pathname === PageRoutes.SignIn ||
      location.pathname === PageRoutes.SignUp ||
      location.pathname === PageRoutes.Verify);

  if (shouldRenderVerifyPage) {
    navigate(PageRoutes.Verify);
  } else if (shouldRenderSignInPage) {
    navigate(PageRoutes.SignIn);
  } else if (shouldRenderHomePage) {
    navigate(PageRoutes.Home);
  }

  return {
    isLoading: loading,
    isVerified: data?.Me?.is_verified
  };
};
