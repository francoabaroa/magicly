import React, { useState, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, QUESTION_TYPE } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const CREATE_QUESTION = gql`
  mutation CreateQuestion(
    $body: String!,
    $type: QuestionType!,
    $urgent: Boolean,
  ) {
    createQuestion(
      body: $body,
      type: $type,
      urgent: $urgent,
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
      minWidth: 220,
    },
    centerText: {
      marginBottom: '14px',
      textAlign: 'center',
    },
  }),
);

const NewQuestionForm = () => {
  const classes = useStyles();
  const [createQuestion, { data, loading, error }] = useMutation(CREATE_QUESTION);
  const router = useRouter();
  const [body, setBody] = useState('');
  const [type, setType] = useState('');
  const [urgent, setUrgent] = useState(false);

  const submitForm = event => {
    event.preventDefault();
    if (type === '') {
      alert('You need to select a question type');
      return;
    }

    const variables = {
      variables: {
        body,
        type,
        urgent,
      }
    };
    createQuestion(variables);

  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createQuestion && data.createQuestion.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/help';
    } else {
      router.push('/productivity/help', undefined);
    }
  }

  const handleTypeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as QUESTION_TYPE);
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isUrgent: boolean = event.target.value === 'true' ? true : false;
    setUrgent(isUrgent);
  };

  return (
    <div className={classes.root}>
      {/* <h1>Add a new todo list item</h1> */}
      <form onSubmit={submitForm}>
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <p> First, type your question in the box below</p>
            <textarea name="body" cols={50} rows={5} onChange={event => setBody(event.target.value)} required />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Type of item</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={handleTypeSelect}
              >
                <MenuItem value={QUESTION_TYPE.TECH}>{getCapitalizedString(QUESTION_TYPE.TECH)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.HOME}>{getCapitalizedString(QUESTION_TYPE.HOME)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.FINANCE}>{getCapitalizedString(QUESTION_TYPE.FINANCE)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.SCAM}>{getCapitalizedString(QUESTION_TYPE.SCAM)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.SERVICE}>{getCapitalizedString(QUESTION_TYPE.SERVICE)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.PRODUCT}>{getCapitalizedString(QUESTION_TYPE.PRODUCT)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.APP}>{getCapitalizedString(QUESTION_TYPE.APP)}</MenuItem>
                <MenuItem value={QUESTION_TYPE.OTHER}>{getCapitalizedString(QUESTION_TYPE.OTHER)}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Is this question urgent?</FormLabel>
              <RadioGroup aria-label="urgent" name="urgent1" value={urgent} onChange={handleChange}>
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <p><button type='submit'>Submit Question</button><button onClick={() => router.back()}>Cancel</button></p>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default NewQuestionForm;