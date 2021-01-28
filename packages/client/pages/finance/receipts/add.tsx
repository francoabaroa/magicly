import React from 'react';
import Layout from '../../../components/Layout';
import UploadDocument from '../../../components/home/UploadDocument';
import { withApollo } from '../../../apollo/apollo';

const AddReceipt = () => {
  return (
    <Layout>
      <UploadDocument />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddReceipt);