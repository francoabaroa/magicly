import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import MagiclyAddIconLabel from '../../../components/shared/MagiclyAddIconLabel';
import MagiclySearchIconLabel from '../../../components/shared/MagiclySearchIconLabel';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import MagiclyLoading from '../../../components/shared/MagiclyLoading';
import MagiclyError from '../../../components/shared/MagiclyError';
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
    paper: {
      fontFamily: 'Playfair Display, serif',
      color: '#FFF',
      textAlign: 'left',
      backgroundColor: "#E5DADA",
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #02040F',
      marginBottom: '20px',
      maxWidth: '400px'
    },
    emptyMarginTopBlock: {
      marginTop: '50px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px'
      },
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
    description: {
      fontWeight: 'normal'
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
    leftText: {
      textAlign: 'left',
    },
    hwType: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    examples: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '16px',
      color: '#002642',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
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
      marginBottom: '15px',
      whiteSpace: 'nowrap',
    },
    tap: {
      color: '#02040F',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    someExamples: {
      color: '#02040F',
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
    suggestion: {
      color: 'rgba(0, 38, 66, 0.5)',
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
    suggestionBold: {
      color: 'rgba(0, 38, 66, 0.5)',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
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
    hugeIcon: {
      color: '#E5DADA',
      fontSize: '120px',
      marginTop: '60px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '80px',
      },
    },
    type: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Overpass, serif',
      color: '#840032',
      padding: '8px',
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '24px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    link: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
      [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
      },
    },
    horizontalLine: {
      marginTop: '20px',
      maxWidth: '900px',
    },
    toolIcon: {
      color: '#002642',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
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

  if (loading) return <MagiclyLoading open={true} />;
  if (error) return <MagiclyError message={error.message} />;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const getIndividualHomeWork = (key: any, homework: any) => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.leftText}>
        <Grid item xs={1} lg={1} md={1} sm={1} style={{ maxWidth: '40px' }}>
          <Home fontSize={'large'} className={classes.toolIcon} />
        </Grid>
        <Grid item xs={10} lg={5} md={5} sm={10}>
          <Link href="work/view/[id]" as={`work/view/${homework.id}`}>
            <span className={classes.link}>{homework.title}</span>
          </Link>
        </Grid>
        <Grid item xs={1} lg={1} md={1} sm={1} className={classes.hwType}>
          <Link href="work/view/[id]" as={`work/view/${homework.id}`}>
            <a className={classes.type}>{homework.type}</a>
          </Link>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <hr className={classes.horizontalLine} />
        </Grid>
      </Grid>
    );
  };

  if (data && data.me && data.me.homeworks && data.me.homeworks.length > 0) {
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
        <Grid container justify="center" alignContent="center" alignItems="center">
          {
            pastWork.length > 0 ?
              <Grid item xs={12} lg={12} md={12} sm={12} xl={12} style={{ paddingBottom: '30px' }}>
                <MagiclyPageTitle
                  title={'Past Home Work'}
                />
              </Grid> :
              null
          }
          { pastWork}
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
        <Grid container justify="center" alignContent="center" alignItems="center">
          {
            upcomingWork.length > 0 ?
              <Grid item xs={12} lg={12} md={12} sm={12} xl={12} style={{ paddingBottom: '30px' }}>
                <MagiclyPageTitle
                  title={'Upcoming Home Work'}
                />
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

  const getEmptyUI = () => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }} onClick={routePage.bind(this, 'home/work/add')}>
          <AddCircle fontSize={'large'} className={classes.hugeIcon} />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <span className={classes.tap}>click the plus icon to start adding home work</span>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center', marginTop: '90px', marginBottom: '10px' }}>
          <span className={classes.someExamples}>some examples for inspiration</span>
        </Grid>
        <Grid container justify="center" alignContent="center" alignItems="center" className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- pool cleaning</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- dishwasher installation</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- fix garage door</span>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getMainUI = () => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}></Grid>
        <Grid item xs={4} lg={5} md={5} sm={5}>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
            <MagiclyAddIconLabel />
          </div>
        </Grid>
        <Grid item xs={4} lg={5} md={5} sm={5}>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/search')}>
            <MagiclySearchIconLabel />
          </div>
        </Grid>
        {getUpcomingHomeWork(hasHomeWork, upcomingWork)}
        {getPastHomeWork(hasHomeWork, pastWork)}
      </Grid>
    );
  };


  return (
    <Layout>
      <div>
        {
          hasHomeWork ?
            getMainUI() :
            getEmptyUI()
        }
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomeWorkPage);