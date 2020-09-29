import React from 'react';
import Layout from '../../../components/Layout';
import UploadFile from '../../../components/UploadFile';
import { withApollo } from '../../../apollo/apollo';

const AddReceipt = () => {
  return (
    <Layout>
      <UploadFile />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddReceipt);