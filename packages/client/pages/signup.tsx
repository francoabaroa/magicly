import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../apollo/apollo';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { APP_CONFIG } from '../constants/appStrings';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '40px',
      color: '#002642',
      marginTop: '45px',
      marginBottom: '25px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '35px',
        marginBottom: '35px',
      },
    },
    signUpButton: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '0px',
      marginBottom: '30px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '90px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        width: '80px',
        height: '35px'
      },
    },
    signUpPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    options: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      color: '#002642',
      margin: 'auto',
      textAlign: 'center',
      marginTop: '10px'
    },
    link: {
      fontFamily: 'Playfair Display, serif',
      color: '#E59500',
      textDecoration: 'none',
    },
    inputs: {
      margin: 'auto',
      textAlign: 'center',
    },
    password: {
      margin: 'auto',
      textAlign: 'center',
      marginBottom: '45px',
    },
    label: {
      fontFamily: 'Playfair Display, serif',
      width: '350px',
      [theme.breakpoints.down('sm')]: {
        width: '200px',
      },
    },
  })
);

const SignUpPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [emailConfirmation, setEmailConfirmation] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [firstName, setFirstName] = useState('');
  const [hasSocialAuthLogin, setHasSocialAuthLogin] = useState(false);
  const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

  if (loading) return <p>Loading...</p>;

  // TODO: show meaningful error message
  if (error && error.message.includes('SequelizeUniqueConstraintError')) {
    return <p>Error: {'This email already exists in our system. Please reset your password.'}</p>
  } else if (error) {
    return <p>Error: {error.message}</p>;
  }

  const submitForm = event => {
    event.preventDefault();

    if (password1 !== password2) {
      alert('Passwords are not the same. Please fix.');
      setPassword1('');
      setPassword2('');
      return;
    }

    if (email !== emailConfirmation) {
      alert('Emails are not the same. Please fix.');
      setEmail('');
      setEmailConfirmation('');
      return;
    }

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password1}&firstName=${firstName}&currentCity=${currentCity}&hasSocialAuthLogin=${hasSocialAuthLogin}`
    };

    fetch(url + 'signup', options)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            // TODO: Remove these
            alert('SignUp 404 Error');
          }
          if (response.status === 401) {
            // TODO: Remove these
            alert('SignUp 401 Error');
          }
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.cookie = 'signedin=true';
          window.location.replace(url + 'main?new=true');
        }
      })
  };

  return (
    <Layout>
      <div className={classes.signUpPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>Welcome</h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <form onSubmit={submitForm}>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="First Name"
                    onChange={event => setFirstName(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Current City"
                    onChange={event => setCurrentCity(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Email"
                    onChange={event => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Re-enter Email"
                    onChange={event => setEmailConfirmation(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Password"
                    type="password"
                    onChange={event => setPassword1(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.password}>
                  <TextField
                    className={classes.label}
                    label="Re-enter Password"
                    type="password"
                    onChange={event => setPassword2(event.target.value)}
                    required
                  />
                </div>
                <Button className={classes.signUpButton} type="submit"> Sign Up </Button>
              </form>
              <h4 className={classes.options}>
                Already have an account?
                <Link href="/signin">
                  <a className={classes.link}> Sign In</a>
                </Link>
              </h4>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(SignUpPage);