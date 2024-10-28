import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import { users } from 'api/users';

const UsersComponent = () => {
  const { data, loading } = useQuery(users);

  return <PageLayout loading={loading}>Users page</PageLayout>;
};

export default UsersComponent;
