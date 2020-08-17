import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
      homeworks {
        title
        status
      }
    }
  }
`;

const MainPage = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  // TODO: a user should not even be able to hit this page if token is expired, not valid or no one is logged in
  if (process.browser && (error || (data && data.me === null))) {
    // TODO: this is janky
    // localStorage.removeItem('token');
    // router.push('/signin', undefined, { shallow: true });
  }

  return (
    <Layout>
      <h1>Main Page</h1>
      <pre>Data: {JSON.stringify(data)}</pre>
      <button onClick={() => refetch()}>Refetch</button>
    </Layout>
  );
};

export default withApollo({ ssr: false })(MainPage);