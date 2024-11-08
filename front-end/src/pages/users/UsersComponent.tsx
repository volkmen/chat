import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import { users } from 'api/users';
import AddUser from 'mocks/AddUser';

const UsersComponent = () => {
  const { data, loading } = useQuery(users);

  console.log(users);

  return (
    <PageLayout loading={loading}>
      <AddUser />
      Users page
    </PageLayout>
  );
};

export default UsersComponent;
