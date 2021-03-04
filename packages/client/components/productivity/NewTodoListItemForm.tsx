import React, { useState, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import MagiclyButton from '../shared/MagiclyButton';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

import moment from 'moment-timezone';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const CREATE_LIST_ITEM = gql`
  mutation CreateListItem(
    $name: String!,
    $type: ItemType!,
    $listType: ListType!,
    $notes: String,
    $executionDate: Date,
    $notificationType: NotificationType,
  ) {
    createListItem(
      name: $name,
      type: $type,
      listType: $listType,
      notes: $notes,
      executionDate: $executionDate,
      notificationType: $notificationType
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTextFields: {
      marginBottom: '15px',
    },
    radioButtonz: {
      display: 'flex',
      flexDirection: 'column'
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    itemType: {
      textAlign: 'center',
      marginTop: '40px',
    },
    textField: {
      minWidth: '400px',
      [theme.breakpoints.down('sm')]: {
        minWidth: '300px',
      },
    },
    checkboxLabel: {
      fontSize: '28px',
      fontWeight: 'bold'
    },
    formControl: {
      minWidth: '350px',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    centerText: {
      textAlign: 'center',
    },
    laterList: {
      marginTop: '10px'
    },
    watchList: {
      marginTop: '10px'
    },
    moreDetailsBtn: {
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '10px',
    },
    cancelBtn: {
      textAlign: 'center',
      marginTop: '10px',
    },
    radioBtns: {
      fontSize: '16px'
    },
    saveBtn: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '50px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
      },
    },
    saveCancelBtns: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#002642',
      backgroundColor: '#FFF',
      borderRadius: '50px',
      border: '3px #002642 solid',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
      },
    },
    formControlLabel: {
      fontSize: '12px',
      fontStyle: 'italic',
    },
    notes: {
      minWidth: '350px',
      marginBottom: '25px',
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'normal',
      marginTop: '50px',
      [theme.breakpoints.down('xs')]: {
        marginTop: '40px',
      },
    },
    datePicker: {
      minWidth: '350px',
      [theme.breakpoints.up('lg')]: {
        width: '167px',
      },
    },
    listSelection: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      fontStyle: 'normal',
      textTransform: 'none'
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
  }),
);

const NewTodoListItemForm = () => {
  const classes = useStyles();
  const [createListItem, { data, loading, error }] = useMutation(CREATE_LIST_ITEM);
  const router = useRouter();
  const [name, setName] = useState('');
  const [list, setListType] = useState(null);
  const [type, setType] = useState(ITEM_TYPE.TODO);
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState('no');
  const [executionDate, setExecutionDate] = useState(null);
  const [moreDetails, setMoreDetails] = useState(false);

  const submitForm = () => {
    // TODO: TEMPORARY TIMEZONE
    let execDate = moment(executionDate).tz('America/New_York').format();

    if (executionDate === null && reminder === 'yes') {
      alert('Please select a reminder date');
      return;
    }

    if (name.length === 0) {
      // tell user
      alert('Please add a task name');
      return;
    }

    if (list === null) {
      alert('Please select a list to save it under');
      return;
    }

    let notificationType = 'NONE';

    // TODO: tempororary until other notification types are supported
    if (reminder === 'yes') {
      notificationType = 'EMAIL';
    }

    const variables = {
      variables: {
        name,
        type,
        notes,
        listType: list,
        executionDate: execDate,
        notificationType
      }
    };

    createListItem(variables);
  }

  if (loading) return <MagiclyLoading open={true} hideLayout={true}/>;
  if (error) return <MagiclyError message={error.message} hideLayout={true}/>;
  if (data && data.createListItem && data.createListItem.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/lists';
    } else {
      router.push('/productivity/lists', undefined);
    }
  }

  const handleTypeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as ITEM_TYPE);
  };

  const handleListChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setListType(event.target.value as LIST_TYPE);
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const toggleMoreDetailsButton = () => {
    setMoreDetails(!moreDetails)
  };

  const handleDateChange = (date) => {
    setExecutionDate(date);
  };

  let todoListLabel = 'To-Do';
  let watchListLabel = 'Watch';
  let laterListLabel = 'Later';

  return (
    <Container maxWidth="lg">
      <Box mt={3}>
        <form
          autoComplete="off"
          noValidate
        >
          <Card>
            <CardHeader
              title="New Task"
            />
            <Divider />
            <CardContent>
              <TextField
                fullWidth
                label="Task name"
                name="name"
                onChange={event => setName(event.target.value)}
                required
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
                    Which list do you want to save this task in?
                </Typography>
                  <RadioGroup aria-label="reminder" name="reminder1" value={list} onChange={handleListChange}>
                    <div>
                      <FormControlLabel value="TODO" control={<Radio />} label={list === 'TODO' ? 'To-Do:' : 'To-Do'} />
                      {
                        list === 'TODO' ?
                          <FormControlLabel value="TODO" control={<p />} label={'all the stuff you "must" do -- commitments, obligations, things that have to be done'} classes={{
                            label: classes.formControlLabel
                          }} /> :
                        null
                      }
                    </div>
                    <div>
                      <FormControlLabel value="WATCH" control={<Radio />} label={list === 'WATCH' ? 'Watch:' : 'Watch'} />
                      {
                        list === 'WATCH' ?
                          <FormControlLabel value="WATCH" control={<p />} label={'all the stuff that you have to follow up on, wait for someone else to get back to you on, or otherwise remember'} classes={{
                            label: classes.formControlLabel
                          }} /> :
                          null
                      }
                    </div>
                    <div>
                      <FormControlLabel value="LATER" control={<Radio />} label={list === 'LATER' ? 'Later:' : 'Later'} />
                      {
                        list === 'LATER' ?
                          <FormControlLabel value="LATER" control={<p />} label={'everything else -- everything you might want to do or will do when you have time or wish you could do'} classes={{
                            label: classes.formControlLabel
                          }} /> :
                          null
                      }
                    </div>


                  </RadioGroup>
                </Grid>

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
                  <RadioGroup aria-label="reminder" name="reminder1" value={reminder} onChange={event => setReminder(event.target.value)}>
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>

                {
                  reminder === 'yes' ?
                    <TextField
                      fullWidth
                      label="Reminder date"
                      name="date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      defaultValue={executionDate}
                      onChange={handleDateChange}
                      variant="outlined"
                      className={classes.formTextFields}
                      style={{marginTop:'15px'}}
                    /> :
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

export default NewTodoListItemForm;