import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withApollo } from '../../apollo/apollo';
import moment from 'moment-timezone';
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

const UPDATE_HOMEWORK = gql`
  mutation UpdateHomework(
    $id: ID!,
    $title: String,
    $status: Status,
    $type: HomeworkType,
    $notificationType: NotificationType,
    $keywords: [String],
    $cost: Int,
    $costCurrency: CostCurrency,
    $notes: String,
    $executionDate: Date,
    $executor: String,
  ) {
    updateHomework(
      id: $id,
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
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    form: {
      marginBottom: '60px'
    },
    notes: {
      minWidth: '550px',
      marginBottom: '40px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    datePicker: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
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

const EditHomeWorkForm = (props) => {
  const classes = useStyles();
  const router = useRouter();
  let dateString = props.homework.executionDate.split('T')[0];
  // TODO: TIMEZONE NEEDS TO BE DYNAMIC, NOT FIXED
  let date = moment(dateString).tz('America/New_York').format();

  const [updateHomework, { data, loading, error }] = useMutation(UPDATE_HOMEWORK);
  const [cost, setCost] = useState(props.homework.cost);
  const [costCurrency, setCostCurrency] = useState(props.homework.costCurrency);
  const [document, setDocument] = useState('no');
  const [executionDate, setExecutionDate] =
    useState(date);
  const [executor, setExecutor] = useState(props.homework.executor);
  const [keywords, setKeywords] = useState(props.homework.keywords);
  const [notes, setNotes] = useState(props.homework.notes);
  const [notificationType, setNotificationType] = useState(props.homework.notificationType);
  const [workStatus, setWorkStatus] = useState(props.homework.status);
  const [reminder, setReminder] = useState(props.homework.notificationType === 'EMAIL' ? 'yes' : 'no');
  const [title, setTitle] = useState(props.homework.title);
  const [type, setType] = useState(props.homework.type);

  const submitForm = event => {
    event.preventDefault();
    const variables = {
      variables: {
        id: props.homework.id,
        title,
        status: workStatus,
        type,
        notificationType: workStatus === 'PAST' ? 'NONE' : notificationType,
        keywords,
        cost: parseFloat(cost),
        costCurrency,
        notes,
        executionDate,
        executor
      }
    };
    updateHomework(variables);
  }

  const setReminderType = () => {
    return (
      <Grid item xs={12} lg={6} md={12} sm={12} className={classes.centerText}>
        <p>How do you want to be reminded?</p>
        <input type='radio' id='sms' name='notificationType' value='sms' onChange={event => setNotificationType(event.target.value.toUpperCase())} required />
        <label>sms</label><br />
        <input type='radio' id='call' name='notificationType' value='call' onChange={event => setNotificationType(event.target.value.toUpperCase())} required />
        <label>call</label><br />
        <input type='radio' id='whatsapp' name='notificationType' value='whatsapp' onChange={event => setNotificationType(event.target.value.toUpperCase())} required />
        <label>whatsapp</label><br />
        <input type='radio' id='email' name='notificationType' value='email' onChange={event => setNotificationType(event.target.value.toUpperCase())} required />
        <label>email</label><br />
      </Grid>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.updateHomework && data.updateHomework.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      if (document === 'yes') {
        router.push({
          pathname: '/home/documents/add',
          query: { hwid: data.updateHomework.id },
        });
      } else {
        window.location.href = url + 'home/work';
      }
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

  const onSetReminder = (event) => {
    setReminder(event.target.value);
    if (event.target.value === 'yes') {
      // TODO: this is temporary until we support other notification types
      setNotificationType('EMAIL');
    } else if (event.target.value === 'no') {
      setNotificationType('NONE');
    }
  };

  const onSetWorkStatus = (event) => {
    setWorkStatus(event.target.value);
    if (event.target.value === 'PAST') {
      setNotificationType('NONE');
    }
  };

  const showNotificationPrompt = () => {
    return workStatus === 'UPCOMING';
  };

  return (
    <div>
      <form onSubmit={submitForm} className={classes.form}>
        <Grid container spacing={1} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <h1 className={classes.title}>Edit Home Work</h1>
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" id="standard-basic" label="Title" onChange={event => setTitle(event.target.value)} defaultValue={title}  className={classes.formControl} />
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
            <TextField autoComplete="off" id="standard-basic" label="Who will do it?" onChange={event => setExecutor(event.target.value)} className={classes.formControl} defaultValue={executor} />
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" type="number" id="standard-basic" label="Cost estimate (USD)" onChange={event => setCost(event.target.value)} className={classes.formControl} defaultValue={cost} />
          </Grid>

          {/* TODO: date storage for backend!! 2020-08-27 */}
          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
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
            <TextField autoComplete="off" className={classes.notes} id="standard-basic" label="Additional notes" onChange={event => setNotes(event.target.value)} defaultValue={notes} />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Is this work upcoming or in the past?</FormLabel>
              <RadioGroup aria-label="workStatus" name="workStatus1" value={workStatus} onChange={onSetWorkStatus}>
                <FormControlLabel value="UPCOMING" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="Upcoming" />
                <FormControlLabel value="PAST" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="Past" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* if YES, show option to attach doc */}
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Do you want to add a document to this?</FormLabel>
              <RadioGroup aria-label="attach" name="attach1" value={document} onChange={event => setDocument(event.target.value)}>
                <FormControlLabel value="yes" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* if YES, show option to select notificationType */}
          {/* TODO: need to add NONE to notificationType */}
          {/* TODO: need to get their phone number for this */}
          {
            showNotificationPrompt() ?
              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Do you want to set an email reminder?</FormLabel>
                  <RadioGroup aria-label="notif" name="notif1" value={reminder} onChange={onSetReminder}>
                    <FormControlLabel value="yes" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid> :
              null
          }

          {/* {
            reminder === 'yes' ?
              setReminderType() :
              null
          } */}

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <Button variant="contained" style={{ backgroundColor: '#840032', color: 'white' }} type='submit'>
              Update
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

export default EditHomeWorkForm;