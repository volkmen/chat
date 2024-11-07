import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../api/account';

export default function useIsAuthenticated() {
  const { data } = useQuery(ME_QUERY);

  return data?.GetMe.is_verified === true || data?.GetMe.is_verified === false;
}
