import React from 'react';
import Layout from '../../../../../components/Layout';
import { withApollo } from '../../../../../apollo/apollo';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import AccessTime from '@material-ui/icons/AccessTime';
import Adjust from '@material-ui/icons/Adjust';

const QUERY = gql`
  query GetQuestion ($id: ID!) {
    question(id: $id) {
      id
      body
      type
      urgent
      status
      createdAt
      attachments {
        id
      }
      answers {
        id
        body
        employee {
          id
          firstName
        }
        attachments {
          id
        }
        createdAt
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
      fontSize: '40px',
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
      // fontSize: '14px',
    }
  }),
);

const ViewQuestionPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  const getCapitalizedString = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const getUI = (data: any) => {
    // TODO: adapt function if only required fields are passed, to show right things on the UI
    // TODO: add edit and delete functionality
    if (data && data.question) {
      let urgentString = data.question.urgent ? 'Urgent' : 'Not Urgent';
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}> {data.question.body}</h1>
          </Grid>
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <div className={classes.individualFeature}>
              <Adjust style={{ color: '#0A7EF2' }} />
              <span className={classes.details}>{data.question.type}</span>
            </div>
          </Grid>
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <div className={classes.individualFeature}>
              <AccessTime className={classes.icon} />
              <span className={classes.details}>{data.question.status}</span>
            </div>
          </Grid>
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <div className={classes.individualFeature}>
              <NotificationImportant className={classes.icon} />
              <span className={classes.details}>{urgentString}</span>
            </div>
          </Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout>
      {getUI(data)}
    </Layout>
  );
};

export default withApollo({ ssr: true })(ViewQuestionPage);