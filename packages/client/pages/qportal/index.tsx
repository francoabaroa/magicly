import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import QportalChatModal from '../../components/qportal/QportalChatModal';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import Layout from '../../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { APP_CONFIG, QUESTION_STATUS } from '../../constants/appStrings';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const QUERY = gql`
  query GetQuestions (
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
        user {
          id
          firstName
        }
        urgent
        status
        notificationType
        createdAt
        attachments {
          id
        }
        answers {
          id
          body
          isUserAnswer
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
      marginTop: '45px',
      marginBottom: '25px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '35px',
        marginBottom: '35px',
      },
    },
    buttons: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '0px',
      marginBottom: '30px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '140px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        width: '100px',
        height: '35px'
      },
    },
    qPortalPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
  })
);

const QportalSignInPage = () => {
  const router = useRouter();
  const employee = router.query.employee ? router.query.employee : null;
  const classes = useStyles();
  const [openQuestionId, setOpenQuestionId] = useState(null);

  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      questionStatus: QUESTION_STATUS.PENDING
    },
    skip: employee === null
  });

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const getRowOfQuestions = () => {
    let questionGrids = [];
    if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
      data.questions.edges.forEach((question: any, key) => {
        questionGrids.push(
          <Grid key={key} item xs={12} lg={12} md={12} sm={12}>
            <QportalChatModal
              employee={employee}
              question={question}
              openQuestionId={openQuestionId}
              handleClose={handleClose.bind(this)}
            />
            <div onClick={handleClickOpen.bind(this, question.id)}>-{'URGENT: ' + question.urgent + ' | '+ question.body }</div>
          </Grid>
        );
      });
    }
    return (
      <Grid container justify="center" alignContent="center" alignItems="center">
        { questionGrids }
      </Grid>
    );
  };

  const signOut = async (event) => {
    const response = await fetch('/auth/google/signout');
    if (response.redirected) {
      window.open(response.url, '_self');
    }
  };

  const handleClickOpen = (questionId) => {
    setOpenQuestionId(questionId);
  };

  const handleClose = () => {
    setOpenQuestionId(null);
  };

  let parsedEmployee =
    employee && typeof employee === 'string'
    ? JSON.parse(employee)
    : {
        firstName: ''
      };

  return (
    <Layout>
      <div className={classes.qPortalPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={employee ? `Welcome ${parsedEmployee.firstName}` : "Employees Only: Access Denied"}
            />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={1} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <form action={url + 'auth/google'}>
                <Button disabled={employee ? true : false} className={classes.buttons} type={"submit"}> { employee ? "Authenticated" : "Authenticate" } </Button>
              </form>
            </Grid>

            {
              employee ?
                <Grid item xs={12} lg={4} md={4} sm={4}>
                  <Button className={classes.buttons} onClick={signOut}> Sign Out </Button>
                </Grid> :
                null
            }

            {getRowOfQuestions() }
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(QportalSignInPage);