import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import { GET_CHANNELS } from 'api/channels';

const Channels = () => {
  const { loading, error } = useQuery(GET_CHANNELS);

  return (
    <PageLayout loading={loading} error={error}>
      {/*<AddUser />*/}
      Channels page
    </PageLayout>
  );
};

export default Channels;
