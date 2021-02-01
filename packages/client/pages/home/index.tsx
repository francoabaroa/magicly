import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import MagiclyLoading from '../../components/shared/MagiclyLoading';
import MagiclyError from '../../components/shared/MagiclyError';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AddCircle from '@material-ui/icons/AddCircle';
import Visibility from '@material-ui/icons/Visibility';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
      homeworks {
        id
        title
        status
      }
      documents {
        id
        name
      }
    }
  }
`;

// TODO: need to add pagination limit 3

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    pageHeading: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      lineHeight: '64px',
      letterSpacing: '0em',
      textAlign: 'center',
      marginBottom: '0px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '28px',
      },
    },
    paper: {
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #E59500',
      marginBottom: '50px',
      maxWidth: '800px'
    },
    sectionTitle: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '28px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    description: {
      fontWeight: 'normal'
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '15px',
      [theme.breakpoints.down('xs')]: {
        padding: '0px'
      },
    },
    details: {
      color: '#FFF',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '24px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    icon: {
      color: '#FFF',
      fontSize: '18px',
    },
    recent: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '18px',
    },
    recentPreview: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: '20px',
      },
    }
  }),
);

const HomePage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <MagiclyLoading open={true}/>;
  if (error) return <MagiclyError message={error.message} />;

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getRecentDocumentPreview = () => {
    let documentPreview = [];
    let length = data.me.documents.length >= 1 ? 1 : data.me.documents.length;
    let documents = data.me.documents.slice().reverse();
    for (let i = 0; i < length; i++) {
      let document = documents[i];
      documentPreview.push(
        <Link key={i} href="home/documents/view/[id]" as={`home/documents/view/${document.id}`}>
          <div>- {document.name}</div>
        </Link>
      );
    }
    return documentPreview;
  };

  const getRecentHomeWorkPreview = () => {
    let homeWorkPreview = [];
    let length = data.me.homeworks.length >= 1 ? 1 : data.me.homeworks.length;
    let homeworks = data.me.homeworks.slice().reverse();
    for (let i = 0; i < length; i++) {
      let homework = homeworks[i];
      homeWorkPreview.push(
        <Link key={i} href="home/work/view/[id]" as={`home/work/view/${homework.id}`}>
          <div>- {homework.title}</div>
        </Link>
      );
    }
    return homeWorkPreview;
  };

  const getDocumentsSection = () => {
    if (data && data.me && data.me.documents && data.me.documents.length > 0) {
      let documentPreview = getRecentDocumentPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'home/documents')}>
              Important Documents
            </h2>
            <hr/>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.recent}>
            <div>Most Recent: </div>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.recentPreview}>
            {documentPreview}
          </Grid>

          <Grid container justify="center" alignContent="center" alignItems="center">
            <Grid item xs={6} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents')}>
                <Visibility fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>view all</span>
              </div>
            </Grid>
            <Grid item xs={6} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents/add')}>
                <AddCircle fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>add</span>
              </div>
            </Grid>
          </Grid>



        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'home/documents')}>
            Important Documents
            </h2>
          <hr />
          <h3 className={classes.description}>
            Upload important documents to stay organized
            </h3>
        <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents/add')}>
          <AddCircle fontSize={'large'} className={classes.icon} />
          <span className={classes.details}>add</span>
        </div>
        </Grid>
      );
    }
  };

  const getHomeWorkSection = () => {
    if (data && data.me && data.me.homeworks && data.me.homeworks.length > 0) {
      let homeWorkPreview = getRecentHomeWorkPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'home/work')}>
              Home Work
              </h2>
            <hr />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.recent}>
            <div>Most Recent: </div>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.recentPreview}>
            {homeWorkPreview}
          </Grid>

          <Grid container justify="center" alignContent="center" alignItems="center">
            <Grid item xs={6} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work')}>
                <Visibility fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>view all</span>
              </div>
            </Grid>
            <Grid item xs={6} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
                <AddCircle fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>add</span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'home/work')}>
            Home Work
            </h2>
          <hr />
          <h3 className={classes.description}>
            Keep track of any work you do to your home, such as maintenance, repairs, installations and more
            </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
            <AddCircle fontSize={'large'} className={classes.icon} />
            <span className={classes.details}>add</span>
          </div>
        </Grid>
      );
    }
  };

  const getHomeServiceProvidersSection = () => {
    return (
      <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper} style={{ marginBottom: '20px' }} onClick={routePage.bind(this, 'find')}>
        <h2 className={classes.sectionTitle}>
          Find Home Services
        </h2>
        <hr />
        <h3 className={classes.description}>
          Find trusted providers for all types of services for your home
            </h3>
      </Grid>
    );
  };

  return (
    <Layout>
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} xl={12} style={{ textAlign: 'center' }}>
          <h2 className={classes.pageHeading}></h2>
        </Grid>
        { getHomeWorkSection() }
        { getDocumentsSection() }
        { getHomeServiceProvidersSection() }
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomePage);