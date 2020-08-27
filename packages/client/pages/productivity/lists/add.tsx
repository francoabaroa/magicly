import React from 'react';
import Layout from '../../../components/Layout';
import NewTodoListItemForm from '../../../components/productivity/NewTodoListItemForm';
import { withApollo } from '../../../apollo/apollo';

const AddTodoListItem = () => {
  return (
    <Layout>
      <NewTodoListItemForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddTodoListItem);