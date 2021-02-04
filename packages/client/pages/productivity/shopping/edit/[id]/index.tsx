import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../../components/Layout';
import EditShoppingListForm from '../../../../../components/productivity/EditShoppingListForm';
import { withApollo } from '../../../../../apollo/apollo';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const QUERY = gql`
  query GetList ($id: ID!) {
    list(id: $id) {
      id
      name
      type
      listItems {
        id
        name
        type
        complete
      }
    }
  }
`;

const EditShoppingList = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  if (data && data.list) {
    return (
      <Layout>
        <EditShoppingListForm
          list={data.list}
        />
      </Layout>
    );
  }
  return (
    <Layout></Layout>
  );

};

export default withApollo({ ssr: false })(EditShoppingList);