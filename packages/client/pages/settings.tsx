import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

const SettingsPage = () => {
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <h1>Settings Page</h1>
      <pre>Data: {data.firstName}</pre>
      <button onClick={() => refetch()}>Refetch</button>
    </Layout>
  );
};

export default withApollo({ ssr: true })(SettingsPage);