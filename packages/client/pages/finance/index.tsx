import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import PlaidLink from '../../components/PlaidLink';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    pageHeading: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      lineHeight: '64px',
      letterSpacing: '0em',
      textAlign: 'center',
      marginBottom: '0px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '28px',
      },
    },
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#02040F',
      backgroundColor: "#E5DADA",
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #02040F',
      marginBottom: '10px',
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '30px',
      color: '#FFF',
      marginTop: '0px',
      marginBottom: '25px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
        marginBottom: '15px',
      },
    },
    subtitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '24px',
      color: '#FFF',
      marginTop: '0px',
      marginBottom: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        marginTop: '0px',
        marginBottom: '5px',
      },
    },
    policy: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '18px',
      color: '#FFF',
      marginTop: '0px',
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        marginTop: '0px',
        marginBottom: '15px',
      },
    },
    financePage: {
      boxShadow: '15px 15px 0 0px #0A7EF2',
      marginRight: '160px',
      marginLeft: '160px',
      padding: '25px',
      marginBottom: '60px',
      backgroundColor: '#002642',
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        marginRight: '0px',
        marginLeft: '0px',
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const fetchLinkToken = async () => {
  const response = await fetch('/create_link_token', { method: 'POST' });
  const responseJSON = await response.json();
  return responseJSON.link_token;
};

const fetchHasPlaidAccounts = async () => {
  const response = await fetch('/finance/hasPlaidAccounts', { method: 'GET' });
  const responseJSON = await response.json();
  return responseJSON.hasPlaidAccounts;
};

const FinancePage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [token, setToken] = useState('');
  const [open, setOpen] = React.useState(false);
  const { data, loading, error, refetch } = useQuery(QUERY);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    async function linkToken() {
      let token = await fetchLinkToken();
      setToken(token);
    }
    async function hasPlaidAccounts() {
      handleToggle();
      const hasPlaidAccountsVerdict = await fetchHasPlaidAccounts();
      if (hasPlaidAccountsVerdict) {
        router.push('/finance/dashboard', undefined, { shallow: true });
      } else {
        handleClose();
        linkToken();
      }
    }
    hasPlaidAccounts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  return (
    <Layout>
      <div style={{ textAlign: 'center' }}>
        <h2 className={classes.pageHeading}>Finances</h2>
      </div>
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h2
              className={classes.title}>
              <span style={{ fontWeight: 'normal', color: '#FFF' }}>Secure. </span>
              <span style={{ fontWeight: 'bold', color: '#FFF' }}>Easy. </span>
              <span style={{ color: '#E59500' }}>Quick. </span>
          </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={8}>
              <h4 className={classes.subtitle}>Sync your accounts so you can track your finances in one place.</h4>
            </Grid>
            <Grid item xs={8}>
              <h4 className={classes.subtitle}>Don’t worry, we’ll never save any of your financial information.</h4>
            </Grid>
            <Grid item xs={8}>
              <h4 className={classes.policy}>Read more about our privacy policy regarding the finance section <Link href="/privacy">
                <a>here.</a>
              </Link></h4>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              {token ? <PlaidLink token={token} /> : null}
            </Grid>
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FinancePage);