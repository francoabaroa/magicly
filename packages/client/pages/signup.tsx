import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';

const SIGN_UP = gql`
  mutation SignUp(
    $email: String!,
    $currentCity: String!,
    $hasSocialAuthLogin: Boolean!
    $firstName: String,
    $lastName: String,
    $displayName: String,
    $socialAuthId: String,
    $preferredSocialAuth: SocialAuth,
    $salt: String,
    $password: String,
    $gender: String,
    $cellphone: String,
    $dob: Date,

  ) {
    signUp(
      email: $email,
      currentCity: $currentCity,
      hasSocialAuthLogin: $hasSocialAuthLogin,
      firstName: $firstName,
      lastName: $lastName,
      displayName: $displayName,
      socialAuthId: $socialAuthId,
      preferredSocialAuth: $preferredSocialAuth,
      salt: $salt,
      password: $password,
      gender: $gender,
      cellphone: $cellphone,
      dob: $dob,
    ) {
      token
    }
  }
`;

const SignUpPage = () => {
  const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <h1>SignUp Page</h1>
      <pre> Mutation Data: {JSON.stringify(data)}</pre>
      <button
        onClick={() => signUp({
          variables: {
            email: 'ale@ale.com',
            currentCity: 'Dallas',
            hasSocialAuthLogin: false,
            password: '50dfjdfwo',
            firstName: 'Ale',
            lastName: 'Aleee',
            displayName: 'Ale',
            socialAuthId: null,
            preferredSocialAuth: null,
            salt: null,
            gender: null,
            cellphone: '7864333444',
            dob: null,
          }
        })}
      >
        Sign Up
      </button>
    </Layout>
  );
};

export default withApollo({ ssr: true })(SignUpPage);