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

const EMPLOYEE_SIGN_IN = gql`
  mutation EmployeeSignIn(
    $email: String!,
    $password: String!,
  ) {
    employeeSignIn(
      email: $email,
      password: $password,
    ) {
      token
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
    signInButton: {
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
    signInPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    options: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      color: '#002642',
      margin: 'auto',
      textAlign: 'center',
      marginTop: '10px'
    },
    link: {
      fontFamily: 'Playfair Display, serif',
      color: '#E59500',
      textDecoration: 'none',
    },
    inputs: {
      margin: 'auto',
      textAlign: 'center',
    },
    password: {
      margin: 'auto',
      textAlign: 'center',
      marginBottom: '45px',
    },
    label: {
      fontFamily: 'Playfair Display, serif',
      width: '350px',
      [theme.breakpoints.down('sm')]: {
        width: '200px',
      },
    },
  })
);

const QportalSignInPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [employeeSignIn, { data, loading, error }] = useMutation(EMPLOYEE_SIGN_IN);

  if (loading) return <p>Loading...</p>;

  // TODO: show meaningful message if account doesnt exist or credentials are wrong
  if (error && error.message.includes('No user found with these login credentials')) {
    return <p>Error: {error.message}</p>;
  } else if (error) {
    return <p>Error: {error.message}</p>;
  }

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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Request More Info
          </Button>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Mark Solved
          </Button>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
          </Button>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Mark Unresolved
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
    setOpen(true);
    setOpenQuestionId(questionId);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenQuestionId(null);
  };

  let parsedEmployee =
    router.query.employee && typeof router.query.employee === 'string'
    ? JSON.parse(router.query.employee)
    : {
        firstName: ''
      };

  return (
    <Layout>
      <div className={classes.signInPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>{router.query.employee ? `Welcome ${parsedEmployee.firstName}` : "Employees Only: Access Denied"} </h1>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={1} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <form action={url + 'auth/google'}>
                <Button disabled={router.query.employee ? true : false} className={classes.signInButton} type={"submit"}> { router.query.employee ? "Authenticated" : "Authenticate" } </Button>
              </form>
            </Grid>

            {
              router.query.employee ?
                <Grid item xs={12} lg={4} md={4} sm={4}>
                  <Button className={classes.signInButton} onClick={signOut}> Sign Out </Button>
                </Grid> :
                null
            }

            { getRowOfQuestions(router.query.questions) }
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(QportalSignInPage);