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
import Home from '@material-ui/icons/Home';
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
        executionDate
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
      fontFamily: 'Overpass, serif',
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
      fontSize: '24px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
      },
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '24px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
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
      fontSize: '18px',
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
      <Grid key={key} item xs={12} lg={12} md={12} sm={12}>
        <Home fontSize={'large'} className={classes.toolIcon} />
        <Link href="work/view/[id]" as={`work/view/${homework.id}`}>
          <span className={classes.link}>{homework.title}</span>
        </Link>
        <hr className={classes.horizontalLine} />
      </Grid>
    );
  };

  if (data && data.me && data.me.homeworks) {
    hasHomeWork = true;
    data.me.homeworks.forEach((homework, key) => {
      // TODO: need to update homework_status once it becomes stale
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1);

      if (new Date(homework.executionDate) > yesterday) {
        upcomingWork.push(
          getIndividualHomeWork(
            key,
            homework
          )
        );
      } else {
        pastWork.push(
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

  const getPastHomeWork = (
    hasHomeWork: boolean,
    pastWork: Array<any>,
  ) => {
    if (hasHomeWork) {
      return (
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          {
            pastWork.length > 0 ?
              <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
                <h1 className={classes.sectionTitle}>Past Home Work</h1>
              </Grid> :
              null
          }
          { pastWork }
        </Grid>
      );
    } else {
      return null;
    }
  }

  const getUpcomingHomeWork = (
    hasHomeWork: boolean,
    upcomingWork: Array<any>
  ) => {
    if (hasHomeWork) {
      return (
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          {
            upcomingWork.length > 0 ?
              <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
                <h1 className={classes.sectionTitle}>Upcoming Home Work</h1>
              </Grid> :
              null
          }
          { upcomingWork}
        </Grid>
      );
    } else {
      return null;
    }
  }


  return (
    <Layout>
      <div className={classes.homeWorkPage}>
      <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12}>
            {/* <h1 className={classes.title}>Home Work</h1> */}
          </Grid>

          {/* <Grid item xs={12} lg={12} md={12} sm={12} onClick={routePage.bind(this, 'find')}>
          <Button className={classes.findButton}> Find Products & Services </Button>
        </Grid> */}
        <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
              <AddCircle fontSize={'large'} className={classes.icon} />
              <span className={classes.details}>add home work</span>
            </div>
          </Grid>
        <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature}>
              <Search fontSize={'large'} className={classes.icon} />
              <span className={classes.details}>search</span>
            </div>
          </Grid>
          {getUpcomingHomeWork(hasHomeWork, upcomingWork)}
          {getPastHomeWork(hasHomeWork, pastWork)}
      </Grid>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomeWorkPage);