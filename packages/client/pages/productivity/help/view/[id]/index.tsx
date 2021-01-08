import React, { useState } from 'react';
import Layout from '../../../../../components/Layout';
import { withApollo } from '../../../../../apollo/apollo';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import AccessTime from '@material-ui/icons/AccessTime';
import Adjust from '@material-ui/icons/Adjust';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    },
    viewAnswerBtn: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      border: '3px #FFF solid',
      width: '185px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
        width: '220px',
        height: '35px'
      },
    },
  }),
);

const ViewQuestionPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  const getCapitalizedString = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getDialogTexts = () => {
    let dialogTexts = [];
    if (data && data.question && data.question.answers.length > 0) {
      for (let i = 0; i < data.question.answers.length; i++) {
        let label = '';
        if (data.question.answers[i].isUserAnswer) {
          label = 'Me: ';
        } else if (data.question.answers[i].employee) {
          label = data.question.answers[i].employee.firstName + ' (Magicly): ';
        } else {
          label = 'Magicly Support: ';
        }
        dialogTexts.push(
          <DialogContentText key={i}>
            {label + data.question.answers[i].body}
          </DialogContentText>
        );
      }
    }
    return dialogTexts;
  };

  const getUI = (data: any) => {
    // TODO: adapt function if only required fields are passed, to show right things on the UI
    // TODO: add edit and delete functionality
    if (data && data.question) {
      let urgentString = data.question.urgent ? 'Urgent' : 'Not Urgent';
      let dialogTexts = getDialogTexts();

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
          <Grid item xs={12} sm={12} lg={12} md={12}>
            {
              data && data.question && data.question.answers.length > 0 ?
                <Button
                  onClick={handleClickOpen}
                  className={classes.viewAnswerBtn}
                >
                  View Answer
                </Button>
                : null
            }

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">{data.question.body}</DialogTitle>
              <DialogContent>
                { dialogTexts }
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Reply"
                  type="text"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Send Reply
          </Button>
                <Button onClick={handleClose} color="primary">
                  Cancel Question
                </Button>

              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xs={12} sm={12} lg={12} md={12}>
            <Button
              onClick={() => { }}
              className={classes.viewAnswerBtn}
            >
              Delete Question
            </Button>
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