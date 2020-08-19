import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const WhyPage = () => {
  return (
    <Layout>
      <h1>Why Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(WhyPage);