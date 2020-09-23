import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withApollo } from '../../apollo/apollo';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const CREATE_HOMEWORK = gql`
  mutation CreateHomework(
    $title: String!,
    $status: Status!,
    $type: HomeworkType!,
    $notificationType: NotificationType!,
    $keywords: [String],
    $cost: Int,
    $costCurrency: CostCurrency,
    $notes: String,
    $executionDate: Date,
    $executor: String,
  ) {
    createHomework(
      title: $title,
      status: $status,
      type: $type,
      notificationType: $notificationType,
      keywords: $keywords,
      cost: $cost,
      costCurrency: $costCurrency,
      notes: $notes,
      executionDate: $executionDate,
      executor: $executor,
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputStyling: {
      backgroundColor: '#E5DADA',
    },
    centerText: {
      textAlign: 'center',
    },
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 167,
    },
    form: {
      marginBottom: '60px'
    },
    notes: {
      minWidth: '330px',
      marginBottom: '40px',
    },
    datePicker: {
      [theme.breakpoints.up('lg')]: {
        width: '167px',
      },
    }
  }),
);

const NewHomeWorkForm = () => {
  const classes = useStyles();
  const router = useRouter();

  const [createHomework, { data, loading, error }] = useMutation(CREATE_HOMEWORK);

  const [cost, setCost] = useState('');
  const [costCurrency, setCostCurrency] = useState('USD');
  const [document, setDocument] = useState('no');
  const [executionDate, setExecutionDate] = useState(new Date());
  const [executor, setExecutor] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [notes, setNotes] = useState('');
  const [notificationType, setNotificationType] = useState('NONE');
  const [reminder, setReminder] = useState('no');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const submitForm = event => {
    event.preventDefault();
    const executionDateObj = new Date(executionDate);
    const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const workDate = new Date(executionDate).toLocaleString('en-US', { timeZone: 'America/New_York' });
    const status = workDate < today ? 'PAST' : 'UPCOMING';
    const variables = {
      variables: {
        title,
        status,
        type,
        notificationType,
        keywords,
        cost: parseFloat(cost),
        costCurrency,
        notes,
        executionDate: executionDateObj,
        executor
      }
    };
    createHomework(variables);
  }

  const setReminderType = () => {
    return (
      <Grid item xs={12} lg={6} md={12} sm={12} className={classes.centerText}>
        <p>How do you want to be reminded?</p>
        <input type='radio' id='sms' name='notificationType' value='sms' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>sms</label><br />
        <input type='radio' id='call' name='notificationType' value='call' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>call</label><br />
        <input type='radio' id='whatsapp' name='notificationType' value='whatsapp' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>whatsapp</label><br />
        <input type='radio' id='email' name='notificationType' value='email' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>email</label><br />
      </Grid>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createHomework && data.createHomework.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'home/work';
    } else {
      router.push('/home/work', undefined);
    }
  }

  const setHomeWorkType = (event) => {
    if (event && event.target.value && typeof event.target.value === 'string') {
      setType(event.target.value.toUpperCase());
    }
  };

  const handleDateChange = (date) => {
    setExecutionDate(date);
  };

  return (
    <div>
      <form onSubmit={submitForm} className={classes.form}>
        <Grid container spacing={1} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <h1>New Home Work</h1>
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" id="standard-basic" label="Title" onChange={event => setTitle(event.target.value)} required />
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <FormControl className={classes.formControl} required>
              <InputLabel>Work type</InputLabel>
              <Select
                value={type}
                onChange={setHomeWorkType}
              >
                <MenuItem value='MAINTENANCE'>Maintenance</MenuItem>
                <MenuItem value='REPAIR'>Repair</MenuItem>
                <MenuItem value='INSTALLATION'>Installation</MenuItem>
                <MenuItem value='CLEANING'>Cleaning</MenuItem>
                <MenuItem value='OTHER'>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" id="standard-basic" label="Who will do it?" onChange={event => setExecutor(event.target.value)} />
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" type="number" id="standard-basic" label="Cost estimate (USD)" onChange={event => setCost(event.target.value)} />
          </Grid>

          {/* TODO: date storage for backend!! 2020-08-27 */}
          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                style={{width: '167px'}}
                className={classes.datePicker}
                margin="normal"
                id="date-picker-dialog"
                label="Date"
                format="MM/dd/yyyy"
                value={executionDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" className={classes.notes} id="standard-basic" label="Additional notes" onChange={event => setNotes(event.target.value)} />
          </Grid>

          {/* if YES, show option to attach doc */}
          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Would you like to attach a document for this?</FormLabel>
              <RadioGroup aria-label="attach" name="attach1" value={document} onChange={event => setDocument(event.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* if YES, show option to select notificationType */}
          {/* TODO: need to add NONE to notificationType */}
          {/* TODO: need to get their phone number for this */}
          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Would you like to set an email reminder for this?</FormLabel>
              <RadioGroup aria-label="notif" name="notif1" value={reminder} onChange={event => setReminder(event.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* {
            reminder === 'yes' ?
              setReminderType() :
              null
          } */}

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <Button variant="contained" color="primary" type='submit'>
              Save
            </Button>
            <Button
              onClick={() => router.back()}
              variant="contained"
              style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Grid>

        </Grid>
      </form>
    </div>
  )
}

export default NewHomeWorkForm;