import React from 'react';
import Layout from '../../components/Layout';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import { withApollo } from '../../apollo/apollo';
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
      marginTop: '20px'
    },
    paper: {
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
      border: '5px #840032 solid',
      borderColor: '#840032',
    },
    premiumPlanPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
  }),
);

const PremiumPlanPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.premiumPlanPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <MagiclyPageTitle
              title={'Premium Plan'}
            />
          </Grid>
          <Grid item xs={12}>
            <h3 className={classes.title}>Coming Soon</h3>
          </Grid>
        </Grid>
        {/* <div className={classes.root}>
      </div> */}
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PremiumPlanPage);