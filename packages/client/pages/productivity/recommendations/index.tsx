import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';

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

const RecommendationsPage = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  return (
    <Layout>
      <h1>Recommendations Page</h1>
      {/* <pre>Data: {JSON.stringify(data)}</pre> */}
      {/* <button onClick={() => refetch()}>Refetch</button> */}
      <Link href="recommendations/add">
        <a>tap here to start adding recommendations you’ve gotten, such as tv series or movies, restaurants, hotels, and more </a>
      </Link>
    </Layout>
  );
};

export default withApollo({ ssr: false })(RecommendationsPage);