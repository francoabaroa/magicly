import React from 'react';
import Layout from '../../../components/Layout';
import NewShoppingListForm from '../../../components/productivity/NewShoppingListForm';
import { withApollo } from '../../../apollo/apollo';

const AddShopping = () => {
  return (
    <Layout>
      <NewShoppingListForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddShopping);