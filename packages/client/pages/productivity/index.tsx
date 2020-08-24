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
      color: '#840032',
      backgroundColor: "#E5DADA",
      borderRadius: '10px',
    },
    sectionTitle: {
      color: '#840032',
      fontWeight: 'bold',
      fontSize: '28px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '20px',
      },
    },
    description: {
      fontWeight: 'normal'
    }
  }),
);

const ProductivityPage = () => {
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
      <h3 style={{ color: 'white' }}>Productivity Page</h3>
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'productivity/lists')}>
            <h2 className={classes.sectionTitle}>
              To-Do Lists
              </h2>
            <h3 className={classes.description}>
              Stay productive and organized with your tasks
              </h3>
          </Paper>
        </Grid>
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'productivity/recommendations')}>
            <h2 className={classes.sectionTitle}>
              Recommendations
              </h2>
            <h3 className={classes.description}>
              Save TV series, movies, books, travels, food or any recommendation you get
              </h3>
          </Paper>
        </Grid>
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'productivity/help')}>
            <h2 className={classes.sectionTitle}>
              Ask a Tech Question
              </h2>
            <h3 className={classes.description}>
              Answer questions, concerns or doubts you might have about technology
              </h3>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ProductivityPage);