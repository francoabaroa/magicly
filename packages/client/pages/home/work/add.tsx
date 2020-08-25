import React from 'react';
import Layout from '../../../components/Layout';
import NewHomeWorkForm from '../../../components/home/NewHomeWorkForm';
import { withApollo } from '../../../apollo/apollo';

const AddHomeWork = () => {
  return (
    <Layout>
      <h1>Add New Home Work</h1>
      <NewHomeWorkForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddHomeWork);