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
      textAlign: 'center',
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
            <h1 className={classes.title}>Optimize your Digital and Physical Life in One Place</h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  My Home
              </h2>
              </Paper>
            </Grid>
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <p className={classes.subheader}>
                  Offload many household routines to Magicly. You can save any documents such as insurance papers, medical records, employee contracts, receipts, manuals and so much more, to give you the peace of mind (and storage space) you need.
                </p>
                <p className={classes.subheader}>
                  You can also keep up with maintenance and repairs done to your home, so you can know exactly what work has been done to your home, why, by who, and how much it cost.
                </p>
                <p className={classes.subheader}>
                  Additionally, for when you have a maintenance or repair coming up (which Magicly can remind you of) you can search for and find trusted home service-providers on our platform.
                </p>
              </Paper>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-start" direction="row">
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <p className={classes.subheader}>
                  Magicly empowers you to stay on top of your finances in a simple and secure way by creating a dashboard with high-level information about your accounts. Don't worry, your finance dashboard will only be reflecting to you and we will never save or use that data.
                </p>
              </Paper>
            </Grid>
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  Finances
              </h2>
              </Paper>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  Productivity
              </h2>
              </Paper>
            </Grid>
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <p className={classes.subheader}>With Magicly, you'll be able to increase your productivity in a simple and organized way that allows you to track your tasks, set reminders, and ask us any tech question you might have. Oh and a little cherry on top: you'll finally have a place to save all the recommendations you get - from movies to restaurants, you'll never lose them again.</p>
              </Paper>
            </Grid>
          </Grid>
          <Grid container alignItems="flex-start" justify="flex-start" direction="row">
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <p className={classes.subheader}>You won't have to rely on word of mouth recommendations anymore when you're looking for a trusted home service-provider or products. On Magicly, you can find the services and products you need to run your home and life efficiently.</p>
              </Paper>
            </Grid>
            <Grid item xs={4} lg={4} md={4} sm={4} className={classes.section}>
              <Paper className={classes.paper}>
                <h2 className={classes.valueProp}>
                  Services & Products
              </h2>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(WhyPage);