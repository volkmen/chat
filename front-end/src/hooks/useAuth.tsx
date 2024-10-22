import React from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ME_QUERY } from 'api/account';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageRoutes } from 'consts/routes';

function getAccountVerified(data?: { Me: { is_verified: boolean } }) {
  return Boolean(data?.Me.is_verified);
}

export const useIsAuthenticated = () => {
  const [fetchMe, { loading, data, error }] = useLazyQuery(ME_QUERY);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoaded = !loading;
  const isSuccess = !error && !loading && data;
  const isError = Boolean(error);
  const isVerified = getAccountVerified(data);

  const token = localStorage.getItem('token');

  // console.log(token, data);

  // console.log(token);
  React.useEffect(() => {
    console.log('BEFORE REFETCH', token);
    fetchMe({ fetchPolicy: 'network-only' });
    console.log('AFTER REFETCH', token);
  }, [token]);

  const shouldRenderVerifyPage = isSuccess && !isVerified && location.pathname !== PageRoutes.Verify;
  const shouldRenderSignInPage =
    isError && location.pathname !== PageRoutes.SignIn && location.pathname !== PageRoutes.SignUp;

  const shouldRenderHomePage =
    isSuccess && isVerified && (location.pathname === PageRoutes.SignIn || location.pathname === PageRoutes.SignUp);

  console.log(shouldRenderVerifyPage, shouldRenderSignInPage, shouldRenderHomePage, data);

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
