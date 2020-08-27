import React from 'react';
import Layout from '../../../components/Layout';
import NewQuestionForm from '../../../components/productivity/NewQuestionForm';
import { withApollo } from '../../../apollo/apollo';

const AddQuestion = () => {
  return (
    <Layout>
      <NewQuestionForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddQuestion);