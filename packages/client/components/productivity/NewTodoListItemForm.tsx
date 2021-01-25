import React, { useState, SetStateAction } from 'react';
import { useRouter } from 'next/router';
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
  ) {
    createListItem(
      name: $name,
      type: $type,
      listType: $listType,
      notes: $notes,
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
    textField: {
      minWidth: '400px',
    },
    checkboxLabel: {
      fontSize: '28px',
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
    radioBtns: {
      fontSize: '16px'
    },
    saveBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
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
    notes: {
      minWidth: '350px',
      marginBottom: '25px',
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
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
  const [list, setList] = useState('');
  const [type, setType] = useState(ITEM_TYPE.TODO);
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState('no');
  const [executionDate, setExecutionDate] = useState(new Date());
  const [moreDetails, setMoreDetails] = useState(false);

  const submitForm = event => {
    event.preventDefault();

    if (name.length === 0) {
      // tell user
      return;
    }

    const variables = {
      variables: {
        name,
        type,
        notes,
        listType: list
      }
    };
    createListItem(variables);

  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
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
    setList(event.target.value as LIST_TYPE);
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

  return (
    <div className={classes.root}>
      <form onSubmit={submitForm}>
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h2 className={classes.title}>Type your task in the box below and select which list you want to store it in:</h2>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <TextField style={{ paddingBottom: '10px' }} autoComplete="off" id="outlined-basic" variant="outlined" onChange={event => setName(event.target.value)} className={classes.textField} />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <FormControl component="fieldset">
              <RadioGroup aria-label="list" name="list1" value={list} onChange={handleListChange} row>
                <FormControlLabel
                  classes={{ label: classes.checkboxLabel }}
                  value={LIST_TYPE.TODO}
                  control={
                  <Radio
                    disableRipple
                    classes={{ root: classes.radio, checked: classes.checked }}
                  />}
                  label={'To-Do Now'}
                />
                <FormControlLabel classes={{ label: classes.checkboxLabel }} value={LIST_TYPE.WATCH} control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label={'To Watch'} />
                <FormControlLabel classes={{ label: classes.checkboxLabel }} value={LIST_TYPE.LATER} control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label={'To-Do Later'} />
              </RadioGroup>
            </FormControl>
          </Grid>

          {
            moreDetails ?
              <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Type of item</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    onChange={handleTypeSelect}
                  >
                    <MenuItem
                      value={ITEM_TYPE.TODO}>
                      {getCapitalizedString(ITEM_TYPE.TODO)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.MOVIE}>
                      {getCapitalizedString(ITEM_TYPE.MOVIE)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.TV}>{ITEM_TYPE.TV}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.FOOD}>
                      {getCapitalizedString(ITEM_TYPE.FOOD)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.RESTAURANT}>
                      {getCapitalizedString(ITEM_TYPE.RESTAURANT)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.MUSIC}>
                      {getCapitalizedString(ITEM_TYPE.MUSIC)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.TRAVEL}>
                      {getCapitalizedString(ITEM_TYPE.TRAVEL)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.ACCOMODATION}>
                      {getCapitalizedString(ITEM_TYPE.ACCOMODATION)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.HOME}>
                      {getCapitalizedString(ITEM_TYPE.HOME)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.FINANCE}>
                      {getCapitalizedString(ITEM_TYPE.FINANCE)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.BOOK}>
                      {getCapitalizedString(ITEM_TYPE.BOOK)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.PODCAST}>
                      {getCapitalizedString(ITEM_TYPE.PODCAST)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.PRODUCT}>
                      {getCapitalizedString(ITEM_TYPE.PRODUCT)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.SERVICE}>
                      {getCapitalizedString(ITEM_TYPE.SERVICE)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.PERSONAL}>
                      {getCapitalizedString(ITEM_TYPE.PERSONAL)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.WORK}>
                      {getCapitalizedString(ITEM_TYPE.WORK)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.FAMILY}>
                      {getCapitalizedString(ITEM_TYPE.FAMILY)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.HEALTH}>
                      {getCapitalizedString(ITEM_TYPE.HEALTH)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.SHOPPING}>
                      {getCapitalizedString(ITEM_TYPE.SHOPPING)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.GIFT}>
                      {getCapitalizedString(ITEM_TYPE.GIFT)}
                    </MenuItem>
                    <MenuItem
                      value={ITEM_TYPE.OTHER}>
                      {getCapitalizedString(ITEM_TYPE.OTHER)}
                    </MenuItem>
                  </Select>
                </FormControl>
                </Grid> :
              null
          }

          {
            moreDetails ?
                <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
                <TextField autoComplete="off" className={classes.notes} id="standard-basic" label="Additional notes" onChange={event => setNotes(event.target.value)} /> </Grid> :
              null
          }

          {/* if YES, show option to select notificationType */}
          {/* TODO: need to add NONE to notificationType */}
          {/* TODO: need to get their phone number for this */}

          {/* {
            reminder === 'yes' ?
              setReminderType() :
              null
          } */}
          {
            moreDetails ?
              <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Would you like to set an email reminder for this?</FormLabel>
                  <RadioGroup aria-label="notif" name="notif1" value={reminder} onChange={event => setReminder(event.target.value)}>
                    <FormControlLabel value="yes" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid> :
              null
          }

          {/* TODO: date storage for backend!! 2020-08-27 */}
          {
            reminder === 'yes' ?
              <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className={classes.datePicker}
                    margin="normal"
                    id="date-picker-dialog"
                    label="When do you want to be reminded?"
                    format="MM/dd/yyyy"
                    value={executionDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid> :
              null
          }

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <Button onClick={toggleMoreDetailsButton} className={classes.saveBtn}>
              {moreDetails ? 'Hide Details' : 'Add More Details'}
            </Button>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <Button variant="contained" className={classes.saveCancelBtns} type='submit'>
              Save
            </Button>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <Button
              onClick={() => router.back()}
              className={classes.saveCancelBtns}
              variant="contained">
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default NewTodoListItemForm;