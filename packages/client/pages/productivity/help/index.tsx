import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import MagiclyLoading from '../../../components/shared/MagiclyLoading';
import MagiclyError from '../../../components/shared/MagiclyError';
import MagiclyAskIconLabel from '../../../components/shared/MagiclyAskIconLabel';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import MagiclyAddIconLabel from '../../../components/shared/MagiclyAddIconLabel';
import MagiclySearchIconLabel from '../../../components/shared/MagiclySearchIconLabel';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { QUESTION_STATUS } from '../../../constants/appStrings';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';

const QUERY = gql`
  query GetQuestions(
    $questionStatus: [QuestionStatus],
    $cursor: String,
    $limit: Int
  ) {
    questions(
      questionStatus: $questionStatus,
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
    toolIcon: {
      color: '#002642',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
    },
    emptyMarginTopBlock: {
      marginTop: '50px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px'
      },
    },
    questionStatus: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    horizontalLine: {
      marginTop: '20px',
      maxWidth: '900px',
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
    leftText: {
      textAlign: 'left',
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '15px',
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
      variables: {
        questionStatus: [
          QUESTION_STATUS.PENDING,
          QUESTION_STATUS.SOLVED,
          QUESTION_STATUS.UNSOLVED,
          QUESTION_STATUS.CANCELLED,
          QUESTION_STATUS.ANSWERED,
        ],
      }
    }
  );

  if (loading) return <MagiclyLoading open={true}/>;
  if (error) return <MagiclyError message={error.message} />;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getIndividualQuestion = (key: any, question: any) => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.leftText}>
        <Grid item xs={1} lg={1} md={1} sm={1} style={{ maxWidth: '40px' }}>
          <QuestionAnswer fontSize={'large'} className={classes.toolIcon} />
        </Grid>
        <Grid item xs={10} lg={5} md={5} sm={10}>
          <Link href="help/view/[id]" as={`help/view/${question.id}`}>
            <span className={classes.link}>{question.body.substring(0, 50) + '...'}</span>
          </Link>
        </Grid>
        <Grid item xs={1} lg={1} md={1} sm={1} className={classes.questionStatus}>
          <Link href="help/view/[id]" as={`help/view/${question.id}`}>
            <span className={classes.type}>{question.status}</span>
          </Link>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <hr className={classes.horizontalLine} />
        </Grid>
      </Grid>
    );
  };

  if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
    hasSavedQuestions = true;
    questions.push(
      <Grid item xs={12} lg={12} md={12} sm={12} xl={12} style={{ paddingBottom: '30px' }}>
        <MagiclyPageTitle
          title={'Asked Tech Questions'}
        />
      </Grid>
    );

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
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}>
          </Grid>

          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/add')}>
              <MagiclyAskIconLabel />
            </div>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/search')}>
              <MagiclySearchIconLabel />
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