import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const SupportPage = () => {
  return (
    <Layout>
      <h1>Support Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(SupportPage);