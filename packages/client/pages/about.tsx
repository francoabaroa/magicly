import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';

const QUERY = gql`
  query GetHello {
    hello
  }
`;

const AboutPage = () => {
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <h1>About Page</h1>
      <pre>Data: {data.hello}</pre>
      <button onClick={() => refetch()}>Refetch</button>
    </Layout>
  );
};

export default withApollo({ ssr: true })(AboutPage);