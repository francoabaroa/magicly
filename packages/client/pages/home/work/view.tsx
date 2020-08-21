import React from 'react';
import Layout from '../../../components/Layout';
import { withApollo } from '../../../apollo/apollo';

const ViewHomeWork = () => {
  return (
    <Layout>
      <h1>Add View Home Work</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ViewHomeWork);