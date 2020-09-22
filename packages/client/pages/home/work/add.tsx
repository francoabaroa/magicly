import React from 'react';
import Layout from '../../../components/Layout';
import NewHomeWorkForm from '../../../components/home/NewHomeWorkForm';
import { withApollo } from '../../../apollo/apollo';

const AddHomeWork = () => {
  return (
    <Layout>
      <NewHomeWorkForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddHomeWork);