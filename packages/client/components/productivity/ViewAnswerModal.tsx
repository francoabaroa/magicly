import React, { useState, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, QUESTION_TYPE } from '../../constants/appStrings';
import MagiclyLoading from '../shared/MagiclyLoading';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
    timestamp: {
      marginLeft: '30px',
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
  }),
);

const ViewAnswerModal = (props) => {
  const classes = useStyles();
  const [body, setBody] = useState('');
  const [questionStatus, setQuestionStatus] = useState(props.question.status);
  const [createAnswer, { data, loading, error }] = useMutation(
    CREATE_ANSWER,
    {
      onCompleted({ createAnswer }) {
        if (createAnswer) {
          window.location.href = url + 'productivity/help';
        }
      }
    }
  );
  const router = useRouter();

  const inputBody = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value as string;
    setBody(value);
  }

  const submitAnswer = () => {
    createAnswer({
      variables: {
        answerBody: body,
        questionStatus: 'PENDING',
        questionId: props.question.id,
        userId: props.question.user.id,
        isUserAnswer: true,
        employeeId: null,
      }
    });
  };

  if (loading) return <MagiclyLoading open={true}/>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createQuestion && data.createQuestion.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/help';
    } else {
      router.push('/productivity/help', undefined);
    }
  }

  const getDialogTexts = () => {
    let dialogTexts = [];
    if (props && props.question && props.question.answers.length > 0) {
      for (let i = 0; i < props.question.answers.length; i++) {
        let label = '';
        if (props.question.answers[i].isUserAnswer) {
          label = 'Me: ';
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
    <Dialog open={props.openModal} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        { props.question.body }
        </DialogTitle>
      <DialogContent>
        { getDialogTexts() }
        <TextField
          autoFocus
          autoComplete="off"
          id="replyAnswer"
          label="Reply"
          type="text"
          onInput={inputBody}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submitAnswer} color="primary">
          Send Reply
          </Button>

      </DialogActions>
    </Dialog>
  );
}

export default ViewAnswerModal;