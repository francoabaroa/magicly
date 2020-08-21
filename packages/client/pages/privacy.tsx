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
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const PrivacyPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <h1>Privacy Page</h1>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(PrivacyPage);