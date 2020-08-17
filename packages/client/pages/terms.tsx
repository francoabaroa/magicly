import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const TermsPage = () => {
  return (
    <Layout>
      <h1>Terms Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(TermsPage);