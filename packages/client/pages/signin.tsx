import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';

import SignInForm from '../components/SignInForm';
import useSignInForm from '../components/SignInForm_DEPRECATED';

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
  const router = useRouter();
  const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

  if (loading) return <p>Loading...</p>;

  // TODO: show meaningful message if account doesnt exist or credentials are wrong
  if (error && error.message.includes('No user found with these login credentials')) {
    return <p>Error: {error.message}</p>;
  } else if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Layout>
      <h1>SignIn Page</h1>
      <pre> Mutation Data: {JSON.stringify(data)}</pre>
      <SignInForm />
      <h4>
        Don't have an account?
        <Link href="/signup">
          <a>Sign Up</a>
        </Link>
      </h4>
    </Layout>
  );
};

export default withApollo({ ssr: true })(SignInPage);