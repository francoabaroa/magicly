import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const QUERY = gql`
  query GetQuestions(
    $questionTypes: [QuestionType],
    $cursor: String,
    $limit: Int
  ) {
    questions(
      questionTypes: $questionTypes,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        body
        type
        urgent
        status
      }
      pageInfo {
        endCursor
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
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '10px',
      },
    },
    link: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
    },
    type: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Fredoka One, cursive',
      color: '#840032',
      padding: '8px',
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    centerText: {
      marginBottom: '14px',
      textAlign: 'center',
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '35px',
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '14px',
    },
    details: {
      color: '#0A7EF2',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '22px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
  }),
);

const TechHelpPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let questions: Array<any> = [];
  let hasSavedQuestions: boolean = false;

  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {}
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getIndividualQuestion = (key: any, question: any) => {
    return (
      <Grid key={key} container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={5} lg={5} md={5} sm={5}>
          <Link href="help/view/[id]" as={`help/view/${question.id}`}>
            <span className={classes.link}>{question.body.substring(0, 50) + '...'}</span>
          </Link>
        </Grid>
        <Grid item xs={5} lg={5} md={5} sm={5}>
          <Link href="help/view/[id]" as={`help/view/${question.id}`}>
            <span className={classes.type}>{question.status}</span>
          </Link>
        </Grid>
      </Grid>
    );
  };

  if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
    hasSavedQuestions = true;
    data.questions.edges.forEach((question, key) => {
      questions.push(
        getIndividualQuestion(
          key,
          question
        )
      );
    });
  }

  const getMainUI = () => {
    if (hasSavedQuestions) {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>Previous questions</h1>
          </Grid>
          <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>ask question</span>
            </div>
          </Grid>
          {questions}
        </Grid>
      );
    } else {
      router.push('/productivity/help/add', undefined, { shallow: true });
    }
  };

  // TODO: CSS BUG where width extends past appBar width
  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(TechHelpPage);