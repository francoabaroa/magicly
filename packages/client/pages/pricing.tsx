import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const PricingPage = () => {
  return (
    <Layout>
      <h1>Pricing Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PricingPage);