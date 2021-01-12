import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withStyles, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

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
    $isUserAnswer: Boolean,
    $userId: ID!,
    $employeeId: ID,
  ) {
    createAnswer(
      answerBody: $answerBody,
      questionStatus: $questionStatus,
      questionId: $questionId,
      isUserAnswer: $isUserAnswer,
      userId: $userId,
      employeeId: $employeeId,
    ) {
      id
    }
  }
`;

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 420,
    fontSize: theme.typography.pxToRem(18),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    centerText: {
      textAlign: 'center',
    },
    notes: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    timestamp: {
      marginLeft: '30px',
    },
    metaDataTitle: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '0 auto',
      marginBottom: '20px'
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
  }),
);

const QportalChatModal = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const [answerBody, setAnswerBody] = useState('');
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

  const submitAnswer = (questionStatus, userId) => {
    createAnswer({
      variables: {
        answerBody: answerBody,
        questionStatus,
        questionId: props.question.id,
        userId: props.question.user.id,
        isUserAnswer: false,
        employeeId: JSON.parse(props.employee as any).id,
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createAnswer && data.createAnswer.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'qportal';
    } else {
      router.push('/qportal', undefined);
    }
  }

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

  const saveBody = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value as string;
    setAnswerBody(value);
  };

  const getMetaDataTooltip = () => {
    return (
      <HtmlTooltip
        title={
          <React.Fragment>
            <ul>
              <li>
                Urgent:
                  <b> {props.question.urgent.toString()} </b>
              </li>
              <li>
                Question Type:
                  <b> {props.question.type} </b>
              </li>
              <li>
                Status:
                  <b> {props.question.status} </b>
              </li>
              <li>
                Notify Via:
                  <b> {props.question.notificationType} </b>
              </li>
              <li>
                User ID:
                  <b> {props.question.user.id} </b>
              </li>
              <li>
                Question ID:
                  <b> {props.question.id} </b>
              </li>
            </ul>
          </React.Fragment>
        }
      >
        <Button className={classes.metaDataTitle}>View Meta Data</Button>
      </HtmlTooltip>
    );
  };

  const getDialogTexts = () => {
    let dialogTexts = [];
    if (props && props.question && props.question.answers.length > 0) {
      for (let i = 0; i < props.question.answers.length; i++) {
        let label = '';
        if (props.question.answers[i].isUserAnswer) {
          // label = props.question.user.firstName + ' (User): ' ;
          label = 'User: ';
        } else if (props.question.answers[i].employee) {
          label = props.question.answers[i].employee.firstName + ' (Magicly): ';
        } else {
          label = 'Magicly Support: ';
        }
        dialogTexts.push(
          <DialogContentText key={i}>
            <b>
              {label}
            </b>
            <span>
              {props.question.answers[i].body}
            </span>
            <span className={classes.timestamp}>
              {props.question.answers[i].createdAt}
            </span>
          </DialogContentText>
        );
      }
    }
    return dialogTexts;
  };
  return (
    <Dialog open={props.question.id === props.openQuestionId} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" className={classes.title}>{props.question.body}</DialogTitle>
      <DialogContent>
        {getMetaDataTooltip()}
        {getDialogTexts()}
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
        <Button onClick={requestMoreInfo.bind(this, props.question.userId)} variant="outlined" color="secondary">
          Request More Info
          </Button>
        <Button onClick={markSolved.bind(this, props.question.userId)} variant="outlined" color="secondary">
          Mark Solved
          </Button>
        <Button onClick={markCancelled.bind(this, props.question.userId)} variant="outlined" color="primary">
          Cancel
          </Button>
        <Button onClick={markUnsolved.bind(this, props.question.userId)} variant="outlined" color="primary">
          Mark Unsolved Permanently
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QportalChatModal;