import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

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
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '30px',
      color: '#002642',
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
      color: '#002642',
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
      color: '#002642',
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
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '55px',
    },
    getStartedBtn: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '22px',
      margin: '0 auto',
      display: 'block',
      marginTop: '40px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '250px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '150px',
        height: '30px'
      },
    },
  }),
);

const FinancePage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);

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
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h2
              className={classes.title}>
              <span style={{ color: '#002642' }}>Secure. </span>
              <span style={{ color: '#034F87' }}>Easy. </span>
              <span style={{ color: '#0A7EF2' }}>Quick. </span>
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
              <Button className={classes.getStartedBtn}> Get Started </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FinancePage);