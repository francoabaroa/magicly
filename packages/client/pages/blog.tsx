import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const BlogPage = () => {
  return (
    <Layout>
      <h1>Blog Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(BlogPage);