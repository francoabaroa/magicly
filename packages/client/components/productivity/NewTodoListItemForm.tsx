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
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

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
    formControl: {
      margin: theme.spacing(1),
      minWidth: '330px',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    listButtons: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      color: '#FFF',
      backgroundColor: '#840032',
      width: '230px',
      height: '50px',
      '&:hover': {
        color: '#FFF',
        backgroundColor: '#840032',
      },
    },
    selectListButton: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      color: '#840032',
      backgroundColor: '#E5DADA',
      width: '230px',
      height: '50px',
      '&:hover': {
        color: '#840032',
        backgroundColor: '#E5DADA',
      },
    },
    centerText: {
      textAlign: 'center',
    },
    notes: {
      minWidth: '330px',
      marginBottom: '25px',
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#02040F',
      backgroundColor: '#E5DADA',
      borderRadius: '10px',
    },
    paperSelected: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#E5DADA',
      backgroundColor: '#02040F',
      borderRadius: '10px',
    },
    sectionTitle: {
      color: '#02040F',
      fontWeight: 'bold',
      fontSize: '28px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    sectionTitleSelected: {
      color: '#E5DADA',
      fontWeight: 'bold',
      fontSize: '28px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
    },
    datePicker: {
      minWidth: '330px',
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
  const [list, setList] = useState(LIST_TYPE.TODO);
  const [type, setType] = useState(ITEM_TYPE.TODO);
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState('no');
  const [executionDate, setExecutionDate] = useState(new Date());
  const [moreDetails, setMoreDetails] = useState(false);

  const submitForm = event => {
    event.preventDefault();

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

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const selectList = (listName: SetStateAction<LIST_TYPE>) => {
    setList(listName);
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
            <h1 className={classes.title}>New To-Do Item</h1>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <TextField style={{ minWidth: '330px', paddingBottom: '20px' }} autoComplete="off" id="standard-basic" label="Item name" onChange={event => setName(event.target.value)} required />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <p className={classes.listSelection}>Select which list you want to store it in</p>
          </Grid>
          <Grid
            item
            xs={3}
            lg={3}
            md={3}
            sm={3}
            className={classes.centerText}
            onClick={selectList.bind(this, LIST_TYPE.TODO)}>
            <Paper
              className={
                list === LIST_TYPE.TODO ? classes.paperSelected : classes.paper
              }>
              <h2 className={
                list === LIST_TYPE.TODO ? classes.sectionTitleSelected : classes.sectionTitle
              }>
                To-Do Now
              </h2>
            </Paper>
          </Grid>

          <Grid
            item
            xs={3}
            lg={3}
            md={3}
            sm={3}
            className={classes.centerText}
            onClick={selectList.bind(this, LIST_TYPE.WATCH)}>
            <Paper
              className={
                list === LIST_TYPE.WATCH ? classes.paperSelected : classes.paper
              }>
              <h2 className={
                list === LIST_TYPE.WATCH ? classes.sectionTitleSelected : classes.sectionTitle
              }>
                To Watch
              </h2>
            </Paper>
          </Grid>

          <Grid
            item
            xs={3}
            lg={3}
            md={3}
            sm={3}
            className={classes.centerText}
            onClick={selectList.bind(this, LIST_TYPE.LATER)}>
            <Paper
              className={
                list === LIST_TYPE.LATER ? classes.paperSelected : classes.paper
              }>
              <h2 className={
                list === LIST_TYPE.LATER ? classes.sectionTitleSelected : classes.sectionTitle
              }>
                To-Do Later
              </h2>
            </Paper>
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
                    <MenuItem value={ITEM_TYPE.TODO}>{getCapitalizedString(ITEM_TYPE.TODO)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.MOVIE}>{getCapitalizedString(ITEM_TYPE.MOVIE)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.TV}>{ITEM_TYPE.TV}</MenuItem>
                    <MenuItem value={ITEM_TYPE.FOOD}>{getCapitalizedString(ITEM_TYPE.FOOD)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.RESTAURANT}>{getCapitalizedString(ITEM_TYPE.RESTAURANT)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.MUSIC}>{getCapitalizedString(ITEM_TYPE.MUSIC)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.TRAVEL}>{getCapitalizedString(ITEM_TYPE.TRAVEL)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.ACCOMODATION}>{getCapitalizedString(ITEM_TYPE.ACCOMODATION)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.HOME}>{getCapitalizedString(ITEM_TYPE.HOME)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.FINANCE}>{getCapitalizedString(ITEM_TYPE.FINANCE)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.BOOK}>{getCapitalizedString(ITEM_TYPE.BOOK)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.PODCAST}>{getCapitalizedString(ITEM_TYPE.PODCAST)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.PRODUCT}>{getCapitalizedString(ITEM_TYPE.PRODUCT)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.SERVICE}>{getCapitalizedString(ITEM_TYPE.SERVICE)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.PERSONAL}>{getCapitalizedString(ITEM_TYPE.PERSONAL)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.WORK}>{getCapitalizedString(ITEM_TYPE.WORK)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.FAMILY}>{getCapitalizedString(ITEM_TYPE.FAMILY)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.HEALTH}>{getCapitalizedString(ITEM_TYPE.HEALTH)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.SHOPPING}>{getCapitalizedString(ITEM_TYPE.SHOPPING)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.GIFT}>{getCapitalizedString(ITEM_TYPE.GIFT)}</MenuItem>
                    <MenuItem value={ITEM_TYPE.OTHER}>{getCapitalizedString(ITEM_TYPE.OTHER)}</MenuItem>
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
                    style={{ width: '167px' }}
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
            <Button onClick={toggleMoreDetailsButton} style={{ backgroundColor: '#E59500', color: 'white'}}>
              {moreDetails ? 'Hide Details' : 'Add More Details'}
            </Button>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <Button variant="contained" style={{ backgroundColor: '#840032', color: 'white' }} type='submit'>
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

export default NewTodoListItemForm;