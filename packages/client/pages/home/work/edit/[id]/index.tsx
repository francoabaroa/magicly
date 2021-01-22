import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../../components/Layout';
import EditHomeWorkForm from '../../../../../components/home/EditHomeWorkForm';
import { withApollo } from '../../../../../apollo/apollo';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  query GetHomework ($id: ID!) {
    homework(id: $id) {
      id
      title
      status
      type
      notificationType
      cost
      costCurrency
      keywords
      notes
      executor
      executionDate
      documents {
        id
        name
        type
      }
    }
  }
`;

const EditHomework = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  if (data && data.homework) {
    return (
      <Layout>
        <EditHomeWorkForm
          homework={data.homework}
        />
      </Layout>
    );
  }
  return (
    <Layout></Layout>
  );

};

export default withApollo({ ssr: false })(EditHomework);