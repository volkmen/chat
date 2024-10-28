import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import { groups } from 'api/groups';

const UsersComponent = () => {
  const { data, loading } = useQuery(groups);

  return <PageLayout loading={loading}>Groups page</PageLayout>;
};

export default UsersComponent;
