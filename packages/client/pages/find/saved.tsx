import React from 'react';
import Layout from '../../components/Layout';
import { withApollo } from '../../apollo/apollo';

const SavedProductsServicesPage = () => {
  return (
    <Layout>
      <h1>Saved Products & Services Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(SavedProductsServicesPage);