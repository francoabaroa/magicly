import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const AboutPage = () => {
  return (
    <Layout>
      <h1>About Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(AboutPage);