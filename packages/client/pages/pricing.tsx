import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
      border: '5px #840032 solid',
      borderColor: '#840032',
    },
    pricingAmt: {
      color: '#0A7EF2'
    },
    pricingPage: {
      backgroundColor: '#000',
    }
  }),
);

const PricingPage = () => {
  const classes = useStyles();
  return (
    <Layout className={classes.pricingPage}>
      <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12}>
          <h1 className={classes.title}>Pricing</h1>
        </Grid>
      </Grid>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} md={4} sm={4}>
            <Paper className={classes.paper}>
              <h2>
                Free Plan
              </h2>
              <h3 className={classes.pricingAmt}>
                FREE
              </h3>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={4}>
            <Paper className={classes.paper}>
              <h2>
                Basic Plan
              </h2>
              <h3 className={classes.pricingAmt}>
                $9.99/month
              </h3>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={4}>
            <Paper className={classes.paper}>
              <h2>
                Premium Plan
              </h2>
              <h3 className={classes.pricingAmt}>
                $14.99/month
              </h3>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PricingPage);