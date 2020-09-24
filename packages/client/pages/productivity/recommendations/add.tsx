import React from 'react';
import Layout from '../../../components/Layout';
import NewRecommendationForm from '../../../components/productivity/NewRecommendationForm';
import { withApollo } from '../../../apollo/apollo';

const AddRecommendation = () => {
  return (
    <Layout>
      <NewRecommendationForm />
    </Layout>
  );
};

export default withApollo({ ssr: false })(AddRecommendation);