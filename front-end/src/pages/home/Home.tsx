import React from 'react';

import PageLayout from 'components/PageLayout';

function HomeComponent() {
  return (
    <PageLayout loading={false} error={null}>
      <div className='absolute-centered mx-auto'>
        <h2>Welcome to the best app ever exists :) </h2>
        <br />

        <p>Please select or find user you want to talk</p>
      </div>
    </PageLayout>
  );
}

export default HomeComponent;
