import React from 'react';
import AppBar from '../components/AppBar';
import Layout from '../components/Layout';
import MagiclyPageTitle from '../components/shared/MagiclyPageTitle';
import Button from '@material-ui/core/Button';
import { withApollo } from '../apollo/apollo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    bold: {
      fontWeight: 'bold',
      color: '#840032'
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '48px',
      color: '#002642',
      marginTop: '45px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '30px',
        marginTop: '35px',
      },
    },
    getStartedButton: {
      fontFamily: 'Overpass',
      fontSize: '18px',
      margin: '0 auto',
      display: 'block',
      marginTop: '35px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '180px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        marginTop: '20px',
      },
    },
    subtitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '36px',
      color: '#002642',
      marginTop: '40px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '20px',
      },
    },
    or: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '26px',
      color: '#002642',
      marginTop: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
        marginTop: '5px',
      },
    },
    call: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '28px',
      color: '#0A7EF2',
      marginTop: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '5px',
      },
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: '#840032',
      backgroundColor: "#E5DADA",
      border: '5px #840032 solid',
      borderColor: '#840032',
    },
    indexPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
  }),
);

const Index = () => {
  const router = useRouter();
  const classes = useStyles();

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  if (Cookies.get('signedin')) {
    router.push('/main', undefined);
  }

  return (
    <Layout>
      <div className={classes.indexPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <MagiclyPageTitle
              isLandingPageTitle={true}
              title={'Run Your Life Like Magic'}
            />
          </Grid>
          <Grid item xs={8}>
            <h2 className={classes.subtitle}>Do <span className={classes.bold}>everything in one app</span> to gain the freedom and time to focus on the things you love</h2>
          </Grid>
          <Grid item xs={12}>
            <Button className={classes.getStartedButton} onClick={routePage.bind(this, 'signup')}> Get Started </Button>
          </Grid>
          <Grid item xs={8}>
            <h3 className={classes.or}>or</h3>
          </Grid>
          <Grid item xs={8}>
            <h3 className={classes.call}>Call to Learn More 1-855-MAGICLY</h3>
          </Grid>
        </Grid>
        {/* <div className={classes.root}>
        </div> */}
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Index);