import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const PrivacyPage = () => {
  return (
    <Layout>
      <h1>Privacy Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PrivacyPage);