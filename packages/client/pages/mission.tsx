import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const MissionPage = () => {
  return (
    <Layout>
      <h1>Mission Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(MissionPage);