import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import MagiclyLoading from '../../components/shared/MagiclyLoading';
import MagiclyError from '../../components/shared/MagiclyError';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { APP_CONFIG } from '../../constants/appStrings';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

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
    signInButton: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '30px',
      marginBottom: '30px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '90px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        width: '80px',
        height: '35px'
      },
    },
    signInPage: {
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
      color: '#0A7EF2',
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

const ForgotPasswordPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

  if (loading) return <MagiclyLoading open={true} />;

  // TODO: show meaningful message if account doesnt exist or credentials are wrong
  if (error && error.message.includes('No user found with these login credentials')) {
    return <MagiclyError message={error.message} />;
  } else if (error) {
    return <MagiclyError message={error.message} />;
  }

  const submitForm = event => {
    event.preventDefault();

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}`
    };

    // TODO: ON SUBMIT, SHOW DIALOG TO TELL USER TO EXPECT AN EMAIL!!

    fetch(url + 'signin/forgot/verify', options)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            // TODO: Remove these
            alert('Email not found, please retry');
          }
          if (response.status === 401) {
            // TODO: Remove these
            alert('Email and password do not match, please retry');
          }
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.cookie = 'signedin=true';
          window.location.replace(url + 'main');
        }
      });
  };

  return (
    <Layout>
      <div className={classes.signInPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Forgot Password?'}
            />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <form onSubmit={submitForm}>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Enter account email"
                    autoComplete="email"
                    onChange={event => setEmail(event.target.value)}
                    required
                  />
                </div>
                <Button disabled className={classes.signInButton} type="submit"> Submit </Button>
              </form>
              <h4 className={classes.options}>
                New to Magicly?
                <Link href="/signup">
                  <a className={classes.link}> Sign Up</a>
                </Link>
              </h4>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(ForgotPasswordPage);