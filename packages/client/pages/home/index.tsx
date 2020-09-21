import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px',
      '&:hover': {
        background: '#002642',
      },
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
      marginBottom: '5px',
    },
    details: {
      color: '#FFF',
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
      color: '#FFF',
      fontSize: '12px',
    },
  }),
);

const HomePage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getDocumentPreviews = () => {
    let documentPreviews = [];
    data.me.documents.forEach(document => {
      documentPreviews.push(
        <Link href="home/documents/view/[id]" as={`home/documents/view/${document.id}`}>
          <div>- {document.name}</div>
        </Link>
      );
    });
    return documentPreviews;
  };

  const getHomeWorkPreviews = () => {
    let homeworkPreviews = [];
    data.me.homeworks.forEach(homework => {
      homeworkPreviews.push(
        <Link href="home/work/view/[id]" as={`home/work/view/${homework.id}`}>
          <div>- {homework.title}</div>
        </Link>
      );
    });
    return homeworkPreviews;
  };

  const getDocumentsSection = () => {
    if (data && data.me && data.me.documents && data.me.documents.length > 0) {
      let documents = getDocumentPreviews();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              Important Documents
              </h2>
            <div>Recent Documents: </div>
            { documents }
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents')}>
              <Visibility fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>view all documents</span>
            </span>
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add a document</span>
            </span>
          </Paper>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              Important Documents
              </h2>
            <h3 className={classes.description}>
              Upload important documents to stay organized
              </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents/add')}>
            <AddCircle fontSize={'small'} className={classes.icon} />
            <span className={classes.details}>add a document</span>
          </div>
          </Paper>
        </Grid>
      );
    }
  };

  const getHomeWorkSection = () => {
    if (data && data.me && data.me.homeworks && data.me.homeworks.length > 0) {
      let homeworks = getHomeWorkPreviews();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              Home Work
              </h2>
            <div>Recent Home Work: </div>
            { homeworks }
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'home/work')}>
              <Visibility fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>view all home work</span>
            </span>
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add home work</span>
            </span>
          </Paper>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              Home Work
              </h2>
            <h3 className={classes.description}>
              Keep track of any work done to your home, such as maintenance, repairs, installations and more
              </h3>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/work/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add home work</span>
            </div>
          </Paper>
        </Grid>
      );
    }
  };

  return (
    <Layout>
      <h3 style={{color: 'white'}}>Home Page</h3>
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
        { getHomeWorkSection() }
        { getDocumentsSection() }
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper} onClick={routePage.bind(this, 'home/providers')}>
            <h2 className={classes.sectionTitle}>
              Find Home Service Providers
              </h2>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomePage);