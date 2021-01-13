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
      color: '#002642',
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
      fontFamily: 'Overpass, serif',
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
      color: '#02040F',
      boxShadow: 'none',
      backgroundColor: "#E6EAED",
      borderRadius: '0px',
    },
    valueProp: {
      color: '#02040F',
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
    },
    whyPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    marginBottom: {
     marginBottom: '50px',
     fontFamily: 'Playfair Display, serif',
     color: '#02040F',
     boxShadow: 'none',
     backgroundColor: "#E6EAED",
     borderRadius: '0px',
    },
    section: {
      marginBottom: '50px',
      fontFamily: 'Playfair Display, serif',
      color: '#02040F',
      boxShadow: 'none',
      backgroundColor: "#E6EAED",
      borderRadius: '0px',
    }
  }),
);

const WhyPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.whyPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={10}>
            <h1 className={classes.title}>Optimize Your Life In One Place</h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <Grid item xs={6} lg={12} md={12} sm={6} className={classes.section}>
              <Paper className={classes.paper}>
                <div>
                  <h2 className={classes.valueProp}>
                    Home
                  </h2>
                </div>
                <div>
                  <ul>
                    <li className={classes.subheader}>
                      Manage and stay on top of all your home upkeep to know exactly the costs and work you put into your home.
                    </li>
                    <li className={classes.subheader}>
                      Save time finding important home documents and never misplace them again.
                    </li>
                    <li className={classes.subheader}>
                      Don’t rely on word of mouth references to find professional, reliable service providers anymore - find and book what you need on Magicly.
                    </li>
                  </ul>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-start" direction="row">
            <Grid item xs={6} lg={12} md={12} sm={6} className={classes.section}>
              <Paper className={classes.paper}>
                <div>
                  <h2 className={classes.valueProp}>
                    Productivity
                  </h2>
                </div>
                <div>
                  <ul>
                    <li className={classes.subheader}>
                      Get better at managing your time, while getting more things done.
                    </li>
                    <li className={classes.subheader}>
                      Take back your time and have more time to do the things you enjoy.
                    </li>
                  </ul>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <Grid item xs={6} lg={12} md={12} sm={6} className={classes.section}>
              <Paper className={classes.paper}>
                <div>
                  <h2 className={classes.valueProp}>
                    Finances
                  </h2>
                </div>
                <div>
                  <ul>
                    <li className={classes.subheader}>
                      Easily view and manage multiple finance accounts in one place to get an overview of your wealth's health.
                    </li>
                    <li className={classes.subheader}>
                      Instead of saving endless paper receipts, store and manage them on Magicly.
                    </li>
                  </ul>
                </div>
              </Paper>
            </Grid>
            {/* <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <p className={classes.subheader}>
                  Easily view and manage multiple finance accounts in one place to get an overview of your wealth's health.
                </p>
                <p className={classes.subheader}>
                  Instead of saving endless paper receipts, store and manage them on Magicly.
                </p>
              </Paper>
            </Grid>
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  Finances
              </h2>
              </Paper>
            </Grid> */}
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(WhyPage);