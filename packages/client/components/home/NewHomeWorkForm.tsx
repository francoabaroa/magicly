import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withApollo } from '../../apollo/apollo';
import MagiclyButton from '../shared/MagiclyButton';

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

import moment from 'moment-timezone';

import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Checkbox,
  Typography,
} from '@material-ui/core';

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
    radioButtonz: {
      display: 'flex',
      flexDirection: 'column'
    },
    inputStyling: {
      backgroundColor: '#E5DADA',
    },
    centerText: {
      textAlign: 'center',
    },
    saveBtn: {
      textAlign: 'center',
    },
    buttonsTop: {
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '10px'
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
    formTextFields: {
      marginBottom: '15px',
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
  }),
);

const NewHomeWorkForm = () => {
  const classes = useStyles();
  const router = useRouter();

  const [createHomework, { data, loading, error }] = useMutation(CREATE_HOMEWORK);

  const [cost, setCost] = useState('');
  const [costCurrency, setCostCurrency] = useState('USD');
  const [document, setDocument] = useState('');
  const [isRecurring, setIsRecurring] = useState('');
  const [executionDate, setExecutionDate] = useState(null);
  const [executor, setExecutor] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [notes, setNotes] = useState('');
  const [notificationType, setNotificationType] = useState('NONE');
  const [workStatus, setWorkStatus] = useState('');
  const [reminder, setReminder] = useState('no');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const submitForm = () => {
    // TODO: this cannot be a fixed timezone!!
    let execDate = moment(executionDate).tz('America/New_York').format();
    const variables = {
      variables: {
        title,
        status: workStatus,
        type,
        notificationType: workStatus === 'PAST' ? 'NONE' : notificationType,
        keywords,
        cost: parseFloat(cost),
        costCurrency,
        notes,
        executionDate: execDate,
        executor
      }
    }
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

  if (loading) return <MagiclyLoading open={true} hideLayout={true}/>;
  if (error) return <MagiclyError message={error.message} hideLayout={true} />;
  if (data && data.createHomework && data.createHomework.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      if (document === 'yes')  {
        router.push({
          pathname: '/home/documents/add',
          query: { hwid: data.createHomework.id },
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

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const handleDateChange = (event) => {
    setExecutionDate(event.target.value);
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

  let homeworkTypeOptions = ['MAINTENANCE', 'REPAIR', 'INSTALLATION', 'CLEANING', 'OTHER'];
  return (
    <Container maxWidth="lg">
      <Box mt={3}>
      <form
        autoComplete="off"
        noValidate
      >
            <Card>
              <CardHeader
                title="New Home Work"
              />
              <Divider />
              <CardContent>
                    <TextField
                      fullWidth
                      // helperText="Please add a title"
                      label="Title"
                      name="title"
                      onChange={event => setTitle(event.target.value)}
                      required
                      variant="outlined"
                      className={classes.formTextFields}
                    />
                    <TextField
                      fullWidth
                      label="Work type"
                      name="type"
                      required
                      select
                      SelectProps={{ native: true }}
                      value={type}
                      onChange={setHomeWorkType}
                      variant="outlined"
                      className={classes.formTextFields}
                    >
                  {homeworkTypeOptions.map((option, index) => (
                        <option
                          key={index}
                          value={option}
                        >
                      {getCapitalizedString(option)}
                        </option>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Who will do it?"
                      name="executor"
                      onChange={event => setExecutor(event.target.value)}
                      required
                      variant="outlined"
                      className={classes.formTextFields}
                    />
                    <TextField
                      fullWidth
                      label="Cost estimate (USD)"
                      onChange={event => setCost(event.target.value)}
                      name="cost"
                      autoComplete="off"
                      type="number"
                      variant="outlined"
                      className={classes.formTextFields}
                    />
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      defaultValue={executionDate}
                      onChange={handleDateChange}
                      variant="outlined"
                      className={classes.formTextFields}
                    />

                    <TextField
                      fullWidth
                      label="Notes"
                      onChange={event => setNotes(event.target.value)}
                      name="notes"
                      variant="outlined"
                      className={classes.formTextFields}
                    />
                <Grid
                  container
                  spacing={1}
                  wrap="wrap"
                >
                  {/* <Grid
                    className={classes.radioButtonz}
                    item
                    lg={12}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <Typography
                      color="textPrimary"
                      variant="h6"
                    >
                      Do you want to make this a recurring event?
                </Typography>
                    <RadioGroup aria-label="recurring" name="recurring1" value={isRecurring} onChange={event => setIsRecurring(event.target.value)}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </Grid> */}

                  <Grid
                    className={classes.radioButtonz}
                    item
                    lg={12}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <Typography
                      color="textPrimary"
                      variant="h6"
                    >
                      Is this work upcoming or in the past?
                </Typography>
                    <RadioGroup aria-label="status" name="status1" value={workStatus} onChange={onSetWorkStatus}>
                      <FormControlLabel value="UPCOMING" control={<Radio />} label="Upcoming" />
                      <FormControlLabel value="PAST" control={<Radio />} label="Past" />
                    </RadioGroup>
                  </Grid>

                  {/* if YES, show option to attach doc */}
                  <Grid
                    className={classes.radioButtonz}
                    item
                    lg={12}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <Typography
                      color="textPrimary"
                      variant="h6"
                    >
                      Do you want to add a document to this?
                </Typography>
                    <RadioGroup aria-label="document" name="document1" value={document} onChange={event => setDocument(event.target.value)}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </Grid>

                  {/* if YES, show option to select notificationType */}
                  {/* TODO: need to add NONE to notificationType */}
                  {/* TODO: need to get their phone number for this */}
                  {
                    showNotificationPrompt() ?
                      <Grid
                        className={classes.radioButtonz}
                        item
                        lg={12}
                        md={4}
                        sm={6}
                        xs={12}
                      >
                        <Typography
                          color="textPrimary"
                          variant="h6"
                        >
                          Do you want to set an email reminder?
                </Typography>
                        <RadioGroup aria-label="reminder" name="reminder1" value={reminder} onChange={onSetReminder}>
                          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                          <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                      </Grid> :
                      null
                  }

                </Grid>
              </CardContent>
              <Divider />
              <Box
                display="flex"
                justifyContent="flex-end"
                p={2}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={submitForm}
                >
                  Save
            </Button>
              </Box>
            </Card>
      </form>
      </Box>
    </Container>
  );
}

export default NewHomeWorkForm;