import React from 'react';
import Layout from '../../components/Layout';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import MagiclyButton from '../../components/shared/MagiclyButton';
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
      color: '#002642',
      marginTop: '45px',
      marginBottom: '35px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '35px',
        marginBottom: '35px',
      },
    },
    paper: {
      textAlign: 'center',
      color: '#002642',
      backgroundColor: "#FFF",
      border: '1px #002642 solid',
      padding: '5px',
      margin: '5px'
    },
    planName: {
      fontSize: '26px',
      fontFamily: 'Playfair Display, serif',
      color: '#002642',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    pricingAmt: {
      fontSize: '22px',
      fontFamily: 'Playfair Display, serif',
      color: '#0A7EF2',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    pricingAmtHidden: {
      fontSize: '22px',
      fontFamily: 'Playfair Display, serif',
      color: '#E5DADA',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    pricingPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    getStarted: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '40px',
      color: '#E5DADA',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '180px',
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
      textAlign: 'left'
    },
    details: {
      marginLeft: '20px',
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      color: '#002642'
    },
    individualFeature: {
      marginBottom: '15px',
    },
    checkmark: {
      color: '#002642',
    }
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
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Pricing'}
            />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.planName}>
                  FREE
              </h2>
                <h3 className={classes.pricingAmt}>
                  FREE
              </h3>
                <MagiclyButton
                  btnLabel={'Get Started'}
                  onClick={routePage.bind(this, 'signup')}
                />
                <div className={classes.features}>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark}/>
                    <span className={classes.details}>1 GB Document Storage</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark}/>
                    <span className={classes.details}>2 Tech Questions</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark} />
                    <span className={classes.details}>Ads</span>
                  </div>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <Paper className={classes.paper}>
                <h2 className={classes.planName}>
                  Basic
              </h2>
                <h3 className={classes.pricingAmt}>
                  $4.99/month
              </h3>
                <MagiclyButton
                  btnLabel={'Get Started'}
                  onClick={routePage.bind(this, 'plans/basic')}
                />
                <div className={classes.features}>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark}/>
                    <span className={classes.details}>10 GB Document Storage</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark}/>
                    <span className={classes.details}>10 Tech Questions</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark} />
                    <span className={classes.details}>No Ads</span>
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
                  $9.99/month
              </h3>
                <MagiclyButton
                  btnLabel={'Get Started'}
                  onClick={routePage.bind(this, 'plans/premium')}
                />
                <div className={classes.features}>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark}/>
                    <span className={classes.details}>25 GB Document Storage</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark}/>
                    <span className={classes.details}>20 Tech Questions</span>
                  </div>
                  <div className={classes.individualFeature}>
                    <DoneOutline fontSize={'small'} className={classes.checkmark} />
                    <span className={classes.details}>No Ads</span>
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