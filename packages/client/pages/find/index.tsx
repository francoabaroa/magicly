import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

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
    findPage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '15px',
    },
    viewProdsServs: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '18px',
      margin: '0 auto',
      display: 'block',
      marginTop: '40px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '400px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '150px',
        height: '30px'
      },
    },
    centerText: {
      textAlign: 'center',
    }
  }),
);

const FindPage = () => {
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
      <div className={classes.findPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Button className={classes.viewProdsServs}> View Saved Services & Products </Button>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={8} className={classes.centerText}>
              <h4 className={classes.subtitle}>What kind of product or service are you looking for today?</h4>
              <input type='text' onChange={() => {}} required />
              <Button>Search</Button>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FindPage);