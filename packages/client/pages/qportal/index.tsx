import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { APP_CONFIG } from '../../constants/appStrings';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const CREATE_ANSWER = gql`
  mutation CreateAnswer(
    $answerBody: String!,
    $questionStatus: QuestionStatus!,
    $questionId: ID!,
    $userId: ID!,
    $employeeId: ID!,
  ) {
    createAnswer(
      answerBody: $answerBody,
      questionStatus: $questionStatus,
      questionId: $questionId,
      userId: $userId,
      employeeId: $employeeId,
    ) {
      id
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
      fontFamily: 'Fredoka One, cursive',
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
  const question = router.query.question ? router.query.question : null;
  const questions = router.query.questions ? router.query.questions : [];

  const classes = useStyles();
  const [answerBody, setAnswerBody] = useState('');
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [createAnswer, { data, loading, error }] = useMutation(
    CREATE_ANSWER,
    {
      onCompleted({ createAnswer }) {
        if (createAnswer) {
          window.location.href = url + 'qportal';
        }
      }
    }
  );

  if (loading) return <p>Loading...</p>;

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const saveBody = (event) => {
    setAnswerBody(event.target.value)
  };

  const getQuestionDialog = (question) => {
    return (
      <div>
        <Dialog open={question.id === openQuestionId} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{ question.body }</DialogTitle>
          <DialogContent>
            <DialogContentText>
              { "Question ID: " + question.id }
          </DialogContentText>
            <DialogContentText>
              {"Question Type: " + question.type}
            </DialogContentText>
            <DialogContentText>
              { "Status: " + question.status }
            </DialogContentText>
            <DialogContentText>
              {"Is Urgent: " + question.urgent}
            </DialogContentText>
            <DialogContentText>
              { "Notification Type: " + question.notificationType }
            </DialogContentText>
            <DialogContentText>
              {"User ID: " + question.userId}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Response"
              fullWidth
              multiline
              onChange={saveBody}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={requestMoreInfo.bind(this, question.userId)} variant="outlined" color="secondary">
              Request More Info
          </Button>
            <Button onClick={markSolved.bind(this, question.userId)} variant="outlined" color="secondary">
              Mark Solved
          </Button>
            <Button onClick={markCancelled.bind(this, question.userId)} variant="outlined" color="primary">
              Cancel
          </Button>
            <Button onClick={markUnsolved.bind(this, question.userId)} variant="outlined" color="primary">
              Mark Unsolved Permanently
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const getRowOfQuestions = (questions) => {
    let questionGrids = [];
    if (JSON.parse(questions).length > 0) {
      JSON.parse(questions).forEach((question, key) => {
        questionGrids.push(
          <Grid key={key} item xs={12} lg={12} md={12} sm={12}>
            {getQuestionDialog(question)}
            <div onClick={handleClickOpen.bind(this, question.id)}>-{'URGENT: ' + question.urgent + ' | '+ question.body }</div>
          </Grid>
        );
      });
    }
    return (
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
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

  const submitAnswer = (questionStatus, userId) => {
    createAnswer({
      variables: {
        answerBody,
        questionStatus,
        questionId: openQuestionId,
        userId,
        employeeId: JSON.parse(employee as any).id,
      }
    });
  };

  const requestMoreInfo = (userId) => {
    submitAnswer('PENDING', userId);
  };

  const markSolved = (userId) => {
    submitAnswer('SOLVED', userId);
  };

  const markCancelled = (userId) => {
    submitAnswer('CANCELLED', userId);
  };

  const markUnsolved = (userId) => {
    submitAnswer('UNSOLVED', userId);
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
            <h1 className={classes.title}>{employee ? `Welcome ${parsedEmployee.firstName}` : "Employees Only: Access Denied"} </h1>
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

            {getRowOfQuestions(questions) }
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(QportalSignInPage);