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
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    findButton: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '18px',
      margin: '0 auto',
      pointerEvents: 'none',
      display: 'block',
      marginTop: '50px',
      marginBottom: '30px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '320px',
      height: '45px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '250px',
        height: '35px'
      },
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
        fontSize: '18px',
      },
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '14px',
    },
    homeWorkPage: {
      marginRight: '50px',
      marginLeft: '50px',
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

  if (data && data.me && data.me.homeworks) {
    hasHomeWork = true;
    data.me.homeworks.forEach((homework, key) => {
      if (homework.status === HOME_WORK_STATUS.PAST) {
        pastWork.push(<Grid item xs={12} lg={12} md={12} sm={12}><Link key={key} href="work/view/[id]" as={`work/view/${homework.id}`}>
          <a>{homework.title}</a>
        </Link></Grid>);
      } else {
        upcomingWork.push(<Grid item xs={12} lg={12} md={12} sm={12}><Link key={key} href="work/view/[id]" as={`work/view/${homework.id}`}>
          <a>{homework.title}</a>
        </Link></Grid>);
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
            <h1 className={classes.title}>Upcoming Home Work</h1>
          </Grid>
          { upcomingWork }
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>Past Home Work</h1>
          </Grid>
          { pastWork }
        </div>
      );
    } else {
      return (
        <div>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>Upcoming Home Work</h1>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>Past Home Work</h1>
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
          <Button className={classes.findButton}> Find Products & Services </Button>
        </Grid>
        <Grid item xs={12} lg={4} md={4} sm={4}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>{'Add home work event'}</span>
            </div>
          </Grid>
        <Grid item xs={12} lg={4} md={4} sm={4}>
            <div className={classes.individualFeature}>
              <Search fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>{'Search home work'}</span>
            </div>
          </Grid>
        <Grid item xs={12} lg={4} md={4} sm={4}>
            <div className={classes.individualFeature}>
              <Edit fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>{'Edit'}</span>
            </div>
          </Grid>
          {getMainUI(hasHomeWork, pastWork, upcomingWork)}
      </Grid>
      {/* <pre>Data: {JSON.stringify(data)}</pre>
      <button onClick={() => refetch()}>Refetch</button> */}
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomeWorkPage);