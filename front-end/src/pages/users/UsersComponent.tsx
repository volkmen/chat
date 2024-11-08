import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import AddUser from 'mocks/AddUser';
import { GET_USERS } from 'api/users';

const UsersComponent = () => {
  const { data, loading } = useQuery(GET_USERS);

  return (
    <PageLayout loading={loading}>
      {/*<AddUser />*/}
      Users page
    </PageLayout>
  );
};

export default UsersComponent;
