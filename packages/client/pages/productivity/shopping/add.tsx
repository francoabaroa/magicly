import React from 'react';
import Layout from '../../../components/Layout';
import NewShoppingForm from '../../../components/productivity/NewShoppingForm';
import { withApollo } from '../../../apollo/apollo';

const AddShopping = () => {
  return (
    <Layout>
      <NewShoppingForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddShopping);