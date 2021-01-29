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
      padding: theme.spacing(2),
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
      border: '5px #840032 solid',
      borderColor: '#840032',
    },
    freePlanPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
  }),
);

const FreePlanPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.freePlanPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <MagiclyPageTitle
              title={'Free Plan'}
            />
          </Grid>
        </Grid>
        {/* <div className={classes.root}>
      </div> */}
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FreePlanPage);