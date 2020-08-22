import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '40px',
      color: '#840032',
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
    findButton: {
      fontFamily: 'Fredoka One',
      margin: '0 auto',
      display: 'block',
      marginTop: '35px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '400px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px',
      },
    },
    paper: {
      padding: theme.spacing(2),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px'
    },
    valueProp: {
      color: '#0A7EF2'
    },
    pricingPage: {
      marginRight: '30px',
      marginLeft: '30px',
    }
  }),
);

const WhyPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.pricingPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>Manage and control your digital and physical life in one place</h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2>
                  my home
              </h2>
                <h3 className={classes.valueProp}>
                  VALUE PROP
              </h3>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2>
                  finances
              </h2>
                <h3 className={classes.valueProp}>
                  VALUE PROP
              </h3>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2>
                  productivity
              </h2>
                <h3 className={classes.valueProp}>
                  VALUE PROP
              </h3>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Button className={classes.findButton}> Find Products & Services </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(WhyPage);