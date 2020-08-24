import React from 'react';
import Layout from '../../components/Layout';
import { withApollo } from '../../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DoneOutline from '@material-ui/icons/DoneOutline';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '40px',
      color: '#E5DADA',
      marginTop: '45px',
      marginBottom: '45px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '35px',
        marginBottom: '35px',
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
    },
    planName: {
      fontSize: '30px',
      fontFamily: 'Playfair Display, serif',
      color: '#002642',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
      },
    },
    pricingAmt: {
      fontSize: '30px',
      fontFamily: 'Playfair Display, serif',
      color: '#840032',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
      },
    },
    pricingAmtHidden: {
      fontSize: '30px',
      fontFamily: 'Playfair Display, serif',
      color: '#E5DADA',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
      },
    },
    pricingPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    getStarted: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '18px',
      margin: '0 auto',
      display: 'block',
      marginTop: '40px',
      color: '#E5DADA',
      backgroundColor: '#840032',
      borderRadius: '50px',
      width: '220px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        width: '150px',
        height: '30px',
        marginTop: '0px',
      },
    },
    features: {
      marginTop: '35px',
      marginBottom: '25px',
    },
    details: {
      marginLeft: '20px',
      fontFamily: 'Playfair Display, serif',
      fontSize: '24px',
      color: '#002642'
    },
    individualFeature: {
      marginBottom: '5px',
    },
  }),
);

const PricingPage = () => {
  const classes = useStyles();
  const router = useRouter();

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  return (
    <Layout>
      <div className={classes.pricingPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>Pricing</h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.planName}>
                  FREE
              </h2>
                <h3 className={classes.pricingAmtHidden}>
                  FREE
              </h3>
                <Button className={classes.getStarted} onClick={routePage.bind(this, 'plans/free')}>Get started</Button>
                <div className={classes.features}>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.planName}>
                  The Basics
              </h2>
                <h3 className={classes.pricingAmt}>
                  $9.99/month
              </h3>
                <Button className={classes.getStarted} onClick={routePage.bind(this, 'plans/basic')}>Get started</Button>
                <div className={classes.features}>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.planName}>
                  Premium
              </h2>
                <h3 className={classes.pricingAmt}>
                  $14.99/month
              </h3>
                <Button className={classes.getStarted} onClick={routePage.bind(this, 'plans/premium')}>Get started</Button>
                <div className={classes.features}>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} />
                    <span className={classes.details}>details</span>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PricingPage);