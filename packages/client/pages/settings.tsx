import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const SettingsPage = () => {
  return (
    <Layout>
      <h1>Settings Page</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(SettingsPage);