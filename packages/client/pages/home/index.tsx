import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px',
      '&:hover': {
        background: '#002642',
      },
    },
    sectionTitle: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '28px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    description: {
      fontWeight: 'normal'
    }
  }),
);

const HomePage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  return (
    <Layout>
      <h3 style={{color: 'white'}}>Home Page</h3>
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'home/work')}>
            <h2 className={classes.sectionTitle}>
              Home Work Events
              </h2>
            <h3 className={classes.description}>
              Save any work you’ve had done to your home, such as repairs, maintenances, installations and more
              </h3>
          </Paper>
        </Grid>
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'home/documents')}>
            <h2 className={classes.sectionTitle}>
              Important Documents
              </h2>
            <h3 className={classes.description}>
              Upload important documents to stay organized
              </h3>
          </Paper>
        </Grid>
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'home/providers')}>
            <h2 className={classes.sectionTitle}>
              Find Home Service Providers
              </h2>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomePage);