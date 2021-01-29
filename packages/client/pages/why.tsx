import React from 'react';
import Layout from '../components/Layout';
import MagiclyPageTitle from '../components/shared/MagiclyPageTitle';
import { withApollo } from '../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Home from '@material-ui/icons/Home';
import CheckBox from '@material-ui/icons/CheckBox';
import AttachMoney from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      fontSize: '50px',
      color: '#002642',
      [theme.breakpoints.down('sm')]: {
        fontSize: '30px',
      },
    },
    whyPage: {
      [theme.breakpoints.down('sm')]: {
        marginLeft: '20px',
        marginRight: '20px'
      },
    },
    root: {
      flexGrow: 1,
      marginTop: '50px'
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
    marginBottom: {
     marginBottom: '50px',
     fontFamily: 'Playfair Display, serif',
     color: '#02040F',
     boxShadow: 'none',
     backgroundColor: "#E6EAED",
     borderRadius: '0px',
    },
    sectionLeft: {
      marginBottom: '50px',
      fontFamily: 'Playfair Display, serif',
      color: '#02040F',
      boxShadow: 'none',
      backgroundColor: "#E6EAED",
      borderRadius: '0px 50px 50px 0px',
      [theme.breakpoints.down('sm')]: {
        borderRadius: '50px',
      },
    },
    section: {
      marginBottom: '50px',
      fontFamily: 'Playfair Display, serif',
      color: '#02040F',
      boxShadow: 'none',
      backgroundColor: "#E6EAED",
      borderRadius: '50px 0px 0px 50px',
      [theme.breakpoints.down('sm')]: {
        borderRadius: '50px',
      },
    }
  }),
);

const WhyPage = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.whyPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={10}>
            <MagiclyPageTitle
              title={'Optimize Your Life In One Place'}
            />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container alignItems="flex-end" justify="flex-end" direction="row">
            <Grid item xs={12} lg={8} md={8} sm={12} className={classes.section}>
              <Grid container alignItems="flex-start" justify="flex-start" direction="row">
                <Grid item xs={12} lg={3} md={3} sm={12} style={{ textAlign: 'center' }}>
                  <h2 className={classes.valueProp}>
                    Home
                  </h2>
                  <Home fontSize={'large'} className={classes.icon} />
                </Grid>
                <Grid item xs={12} lg={9} md={9} sm={12}>
                  <ul>
                    <li className={classes.subheader}>
                      Manage and organize all your home upkeep
                    </li>
                    <li className={classes.subheader}>
                      Know exactly  what costs and work you put into your home
                    </li>
                    <li className={classes.subheader}>
                      Save time by uploading and organizing  important home documents
                    </li>
                    <li className={classes.subheader}>
                      Find and book professional, reliable home service providers
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-start" direction="row">
            <Grid item xs={12} lg={8} md={8} sm={12} className={classes.sectionLeft}>
              <Grid container alignItems="flex-start" justify="flex-start" direction="row">
                <Grid item xs={12} lg={4} md={4} sm={12} style={{ textAlign: 'center' }}>
                  <h2 className={classes.valueProp}>
                    Productivity
                  </h2>
                  <CheckBox fontSize={'large'} className={classes.icon} />
                </Grid>
                <Grid item xs={12} lg={8} md={8} sm={12}>
                  <ul>
                    <li className={classes.subheader}>
                      Get better at managing your time with helpful lists
                    </li>
                    <li className={classes.subheader}>
                      Get reliable answers to your tech questions
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-end" justify="flex-end" direction="row">
            <Grid item xs={12} lg={8} md={8} sm={12} className={classes.section}>
              <Grid container alignItems="flex-start" justify="flex-start" direction="row">
                <Grid item xs={12} lg={3} md={3} sm={12} style={{textAlign: 'center'}}>
                  <h2 className={classes.valueProp}>
                    Finances
                  </h2>
                  <AttachMoney fontSize={'large'} className={classes.icon} />
                </Grid>
                <Grid item xs={12} lg={9} md={9} sm={12}>
                  <ul>
                    <li className={classes.subheader}>
                      Easily manage multiple finance accounts in one place
                    </li>
                    <li className={classes.subheader}>
                      Store and manage receipts and expenses
                    </li>
                  </ul>
                </Grid>
              </Grid>
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