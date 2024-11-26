import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import { GET_CHATS } from 'api/chats';

const Channels = () => {
  const { loading, error, data } = useQuery(GET_CHATS);

  console.log(data);

  return (
    <PageLayout loading={loading} error={error}>
      {/*<AddUser />*/}
      Chats page
    </PageLayout>
  );
};

export default Channels;
