import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import MagiclyPageTitle from '../components/shared/MagiclyPageTitle';
import MagiclyButton from '../components/shared/MagiclyButton';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from '../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      paddingTop: '10px',
      margin: 'auto',
      textAlign: 'center',
    },
    submitBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '0px',
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
    paper: {
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
      border: '5px #840032 solid',
      borderColor: '#840032',
    },
    supportAmt: {
      color: '#0A7EF2'
    },
    supportPage: {
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
  }),
);

const SupportPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(QUERY);
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isMagiclyUser, setIsMagiclyUser] = useState(false);

  if  (data && data.me) {
    if (email !== data.me.email && data.me.email.length > 0) {
      setIsMagiclyUser(true);
      setEmail(data.me.email);
    }
    if (firstName !== data.me.firstName && data.me.firstName.length > 0) {
      setFirstName(data.me.firstName);
    }
  }

  const submitForm = () => {
    async function submitCustomerQuery() {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `email=${email}&firstName=${firstName}&body=${body}`
      };

      fetch('/support/submit', options)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              // TODO: Remove these
              alert('Submission 404 Error');
            }
            if (response.status === 401) {
              // TODO: Remove these
              alert('Submission 401 Error');
            }
          }
          return response;
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            router.push('/', undefined, { shallow: true });
          }
        })
    }
    submitCustomerQuery();
  }

  return (
    <Layout>
      <div className={classes.supportPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Contact Us'}
            />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={4} md={4} sm={4}>
              {
                !isMagiclyUser ?
                  <div className={classes.inputs}>
                    <TextField
                      className={classes.label}
                      label="First Name"
                      defaultValue={firstName}
                      onChange={event => setFirstName(event.target.value)}
                      required
                    />
                  </div> :
                  null
              }

              {
                !isMagiclyUser ?
                  <div className={classes.inputs}>
                    <TextField
                      className={classes.label}
                      label="Email"
                      defaultValue={email}
                      onChange={event => setEmail(event.target.value)}
                      required
                    />
                  </div> :
                  null
              }

              <div className={classes.password}>
                <TextField
                  className={classes.label}
                  label="Question or Comment"
                  onChange={event => setBody(event.target.value)}
                  required
                />
              </div>
              <MagiclyButton
                btnLabel={'Submit'}
                onClick={submitForm}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(SupportPage);