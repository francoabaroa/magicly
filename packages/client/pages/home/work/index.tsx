import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import Search from '@material-ui/icons/Search';
import Build from '@material-ui/icons/Build';
import Edit from '@material-ui/icons/Edit';

import { HOME_WORK_STATUS } from '../../../constants/appStrings';

// todo: missing executionDate cause of date bug
const QUERY = gql`
  query GetMyHomeworks {
    me {
      id
      firstName
      lastName
      email
      homeworks {
        id
        title
        status
        type
        notificationType
        keywords
        cost
        costCurrency
        notes
        executor
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '32px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '30px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '10px',
      },
    },
    sectionTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '26px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '30px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
        marginTop: '15px',
        marginBottom: '10px',
      },
    },
    findButton: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '14px',
      margin: '0 auto',
      pointerEvents: 'none',
      display: 'block',
      marginTop: '20px',
      marginBottom: '20px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '250px',
      height: '35px',
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '5px',
    },
    details: {
      color: '#0A7EF2',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '12px',
    },
    homeWorkPage: {
      marginRight: '50px',
      marginLeft: '50px',
    },
    link: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
    },
    horizontalLine: {
      marginTop: '20px'
    },
    toolIcon: {
      color: '#002642',
      fontSize: '14px',
    },
  }),
);

const HomeWorkPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(QUERY);

  let pastWork: Array<any> = [];
  let upcomingWork: Array<any> = [];
  let hasHomeWork: boolean = false;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const getIndividualHomeWork = (key: any, homework: any) => {
    return (
      <span key={key}>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <Build className={classes.toolIcon} />
          <Link href="work/view/[id]" as={`work/view/${homework.id}`}>
            <span className={classes.link}>{homework.title}</span>
          </Link>
        </Grid>
        <hr className={classes.horizontalLine} />
      </span>
    );
  };

  if (data && data.me && data.me.homeworks) {
    hasHomeWork = true;
    data.me.homeworks.forEach((homework, key) => {
      if (homework.status === HOME_WORK_STATUS.PAST) {
        pastWork.push(
          getIndividualHomeWork(
            key,
            homework
          )
        );
      } else {
        upcomingWork.push(
          getIndividualHomeWork(
            key,
            homework
          )
        );
      }
    });
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getMainUI = (
    hasHomeWork: boolean,
    pastWork: Array<any>,
    upcomingWork: Array<any>
  ) => {
    if (hasHomeWork) {
      return (
        <div>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.sectionTitle}>Upcoming Home Work</h1>
          </Grid>
          { upcomingWork }
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.sectionTitle}>Past Home Work</h1>
          </Grid>
          { pastWork }
        </div>
      );
    } else {
      return (
        <div>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.sectionTitle}>Upcoming Home Work</h1>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.sectionTitle}>Past Home Work</h1>
          </Grid>
        </div>
      );
    }
  }


  return (
    <Layout>
      <div className={classes.homeWorkPage}>
      <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>Home Work</h1>
          </Grid>

          {/* <Grid item xs={12} lg={12} md={12} sm={12} onClick={routePage.bind(this, 'find')}>
          <Button className={classes.findButton}> Find Products & Services </Button>
        </Grid> */}
        <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add home work event</span>
            </div>
          </Grid>
        <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature}>
              <Search fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>search home work</span>
            </div>
          </Grid>
          {getMainUI(hasHomeWork, pastWork, upcomingWork)}
      </Grid>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomeWorkPage);