import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';

const SIGN_IN = gql`
  mutation SignIn(
    $email: String!,
    $password: String!,
  ) {
    signIn(
      email: $email,
      password: $password,
    ) {
      token
    }
  }
`;

const SignInPage = () => {
  const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <h1>SignIn Page</h1>
      <pre> Mutation Data: {JSON.stringify(data)}</pre>
      <button
        onClick={() => signIn({
          variables: {
            email: 'franco@franco.com',
            password: 'testa123',
          }
        })}
      >
        Sign In
      </button>
    </Layout>
  );
};

export default withApollo({ ssr: true })(SignInPage);