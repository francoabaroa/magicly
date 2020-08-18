import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import useSignUpForm from '../components/SignUpForm_DEPRECATED';
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
  const router = useRouter();
  // TODO: check if pw1 === pw2
  // TODO: need node service to check if email is valid by sending confirmation email.
  // TODO: show meaningful message if user email already exists
  // const signup = () => {
  //   signUp({
  //     variables: {
  //       email: inputs.email,
  //       currentCity: inputs.city,
  //       hasSocialAuthLogin: false,
  //       password: inputs.password1,
  //       firstName: null,
  //       lastName: null,
  //       displayName: null,
  //       socialAuthId: null,
  //       preferredSocialAuth: null,
  //       salt: null,
  //       gender: null,
  //       cellphone: null,
  //       dob: null,
  //     }
  //   });
  // };

  const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

  if (loading) return <p>Loading...</p>;
  if (error && error.message.includes('SequelizeUniqueConstraintError')) {
    return <p>Error: {'This email already exists in our system. Please reset your password.'}</p>
  } else if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Layout>
      <h1>SignUp Page</h1>
      <pre> Mutation Data: {JSON.stringify(data)}</pre>
      <h4>
        Already have an account?
        <Link href="/signin">
          <a>Sign In</a>
        </Link>
      </h4>
    </Layout>
  );
};

export default withApollo({ ssr: true })(SignUpPage);