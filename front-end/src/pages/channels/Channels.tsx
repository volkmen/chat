import React from 'react';
import PageLayout from 'components/PageLayout';
import { useQuery } from '@apollo/client';
import { GET_CHANNELS } from 'api/channels';

const Channels = () => {
  const { loading, data, error } = useQuery(GET_CHANNELS);

  return (
    <PageLayout loading={loading} error={error}>
      Channels page
    </PageLayout>
  );
};

export default Channels;
