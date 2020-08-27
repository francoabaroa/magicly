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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withApollo } from '../../apollo/apollo';

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
      minWidth: 220,
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
    }
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

  return (
    <div className={classes.root}>
      {/* <h1>Add a new todo list item</h1> */}
      <form onSubmit={submitForm}>
        <p> First, type your task in the box below</p>
        <input type='text' onChange={event => setName(event.target.value)} autoComplete='on' required />

        <p> Next, select which list to store it in</p>

        <div>
          <ButtonGroup size="small" aria-label="small outlined button group">
            <Button
              className={
                list === LIST_TYPE.TODO ? classes.selectListButton : classes.listButtons
              }
              onClick={selectList.bind(this, LIST_TYPE.TODO)}>
              Now List
            </Button>
            <Button
              className={
                list === LIST_TYPE.WATCH ? classes.selectListButton : classes.listButtons
              }
              onClick={selectList.bind(this, LIST_TYPE.WATCH)}>
              Upcoming List
            </Button>
            <Button
              className={
                list === LIST_TYPE.LATER ? classes.selectListButton : classes.listButtons
              }
              onClick={selectList.bind(this, LIST_TYPE.LATER)}>
              Someday List
            </Button>
         </ButtonGroup>
        </div>

        {
          moreDetails ?
            <span>
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

              <p>Notes: <textarea name="notes" cols={50} rows={5} onChange={event => setNotes(event.target.value)} /></p> </span> :
            null
        }

        <Button onClick={toggleMoreDetailsButton}>
          { moreDetails ? 'Hide Details' : 'Add More Details' }
        </Button>

        <p><button type='submit'>Save</button><button onClick={() => router.back()}>Cancel</button></p>
      </form>
    </div>
  )
}

export default NewTodoListItemForm;