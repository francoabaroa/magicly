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
      fontSize: '24px',
      color: '#002642',
      marginTop: '15px',
      marginBottom: '45px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        marginTop: '35px',
        marginBottom: '35px',
      },
    },
    homePaper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: '#840032',
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #E59500',
    },
    productivityPaper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#02040F',
      backgroundColor: '#E5DADA',
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #02040F',
    },
    financesPaper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #0A7EF2',
    },
    appSection: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '32px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    productivityAppSection: {
      color: '#02040F',
      fontWeight: 'bold',
      fontSize: '32px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    financesAppSection: {
      color: '#02040F',
      fontWeight: 'bold',
      fontSize: '32px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    mainPage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '55px',
    },
    findButton: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '22px',
      margin: '0 auto',
      pointerEvents: 'none',
      display: 'block',
      marginTop: '40px',
      color: '#FFF',
      backgroundColor: '#840032',
      borderRadius: '50px',
      width: '360px',
      height: '60px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '300px',
        height: '40px'
      },
    },
  }),
);

const MainPage = () => {
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

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const getInitialPartOfEmail = (email: string) => {
    if (email && email.length > 0) {
      return ', ' + getCapitalizedString(email.split('@')[0]);
    }
    return '!';
  };


  return (
    <Layout>
      <div className={classes.mainPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h5 className={classes.title}>{'Welcome back' + getInitialPartOfEmail(data.me.email)}</h5>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.homePaper} onClick={routePage.bind(this, 'home')}>
                <h2 className={classes.appSection}>
                  My Home
              </h2>
                <h3 style={{ fontWeight: 'normal' }}>
                  Important information pertaining to your home
              </h3>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.productivityPaper} onClick={routePage.bind(this, 'productivity')}>
                <h2 className={classes.productivityAppSection}>
                  Productivity
              </h2>
                <h3 style={{fontWeight: 'normal'}}>
                  Increase your productivity in a simple way
              </h3>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.financesPaper} onClick={routePage.bind(this, 'finance')}>
                <h2 className={classes.appSection}>
                  Finances
              </h2>
                <h3 style={{ fontWeight: 'normal' }}>
                  Stay on top of your finances easily
              </h3>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12} onClick={routePage.bind(this, 'find')}>
              <Button className={classes.findButton}> Find Products & Services </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(MainPage);