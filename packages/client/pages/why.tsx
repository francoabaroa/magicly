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
      fontFamily: 'Fredoka One, cursive',
      fontSize: '28px',
      margin: '0 auto',
      pointerEvents: 'none',
      display: 'block',
      marginTop: '0px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '550px',
      height: '60px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '300px',
        height: '40px'
      },
    },
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px',
    },
    valueProp: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '32px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    subheader: {
      fontFamily: 'Playfair Display, serif',
      margin: '10px',
      marginTop: '20px',
      marginBottom: '0px',
      fontSize: '20px',
      textAlign: 'center',
    },
    whyPage: {
      marginRight: '30px',
      marginLeft: '30px',
    }
  }),
);

const WhyPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.whyPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>Manage and control your digital and physical life in one place</h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  my home
              </h2>
                <h3>
                  value proposition of section
              </h3>
              </Paper>
              <p className={classes.subheader}>save time and avoid mental exhaustion by offloading many of your routines to Magicly</p>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  finances
              </h2>
                <h3>
                  value proposition of section
              </h3>
              </Paper>
              <p className={classes.subheader}>empower you by helping you stay on top of your finances easily</p>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  productivity
              </h2>
                <h3>
                  value proposition of section
              </h3>
              </Paper>
              <p className={classes.subheader}>save time by increasing productivity in a simple and organized way</p>
            </Grid>
            <Grid item xs={12}>
              <Button className={classes.findButton}> Find Products & Services </Button>
              <p className={classes.subheader}>find trustworthy service-providers and products to keep your home running efficiently</p>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(WhyPage);