import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import useSignInForm from '../components/SignInForm';
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
  const router = useRouter();
  // TODO: show meaningful message if account doesnt exist
  const signin = () => {
    signIn({
      variables: {
        email: inputs.email,
        password: inputs.password,
      }
    });
  };

  const { inputs, handleInputChange, handleSubmit } = useSignInForm({ email: '', password: '' }, signin);
  const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data && data.signIn && data.signIn.token) {
    localStorage.setItem('token', data.signIn.token);
    router.push('/main', undefined, { shallow: true });
  }

  return (
    <Layout>
      <h1>SignIn Page</h1>
      <pre> Mutation Data: {JSON.stringify(data)}</pre>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>Email Address</label>
          <input type="email" name="email" onChange={handleInputChange} value={inputs.email} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" onChange={handleInputChange} value={inputs.password} autoComplete="on" required />
        </div>
        <button type="submit">
          Sign In
      </button>
      </form>
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