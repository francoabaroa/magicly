import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import MagiclyPageTitle from '../shared/MagiclyPageTitle';
import MagiclyButton from '../shared/MagiclyButton';
import MagiclyError from '../shared/MagiclyError';
import MagiclyLoading from '../shared/MagiclyLoading';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';

import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const CREATE_LIST_WITH_ITEMS = gql`
  mutation CreateListWithItems(
    $name: String,
    $type: ListType!,
    $preSaveListItems: [PreSaveListItem],
  ) {
    createListWithItems(
      name: $name,
      type: $type,
      preSaveListItems: $preSaveListItems,
    ) {
      id
    }
  }
`;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 'auto',
      maxWidth: '550px',
      border: '1px solid rgba(0, 38, 66, 0.1)',
      [theme.breakpoints.down('xs')]: {
        maxWidth: '350px',
      },
    },
    deleteIcon: {
      color: '#002642',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
    },
    chip: {
      margin: theme.spacing(0.5),
      fontWeight: 'bold',
      backgroundColor: 'white',
      border: '1px solid #002642',
      color: '#002642'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    name: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    centerText: {
      textAlign: 'center',
    },
    saveBtn: {
      textAlign: 'center',
      marginBottom: '10px',
    },
  }),
);

const NewShoppingListForm = () => {
  const classes = useStyles();
  const [createListWithItems, { data, loading, error }] = useMutation(CREATE_LIST_WITH_ITEMS);
  const router = useRouter();
  const [listName, setListName] = useState('');
  const [itemName, setItemName] = useState('');
  const [type, setType] = useState('');
  const [chipData, setChipData] = React.useState([]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const submitForm = () => {
    let listItems = [];

    for (let i = 0; i < chipData.length; i++) {
      listItems.push(
        {
          name: chipData[i].label,
          type: chipData[i].type,
          notes: chipData[i].notes,
          complete: chipData[i].complete
        }
      );
    }

    if (listName === '') {
      alert('You need a list name');
      return;
    }

    if (listItems.length === 0) {
      alert('You need to add list items');
      return;
    }

    const variables = {
      variables: {
        name: listName,
        type: LIST_TYPE.SHOPPING,
        preSaveListItems: listItems
      }
    };
    createListWithItems(variables);

  }

  if (loading) return <MagiclyLoading open={true} hideLayout={true}/>;
  if (error) return <MagiclyError message={error.message} hideLayout={true}/>;
  if (data && data.createListWithItems && data.createListWithItems.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/shopping';
    } else {
      router.push('/productivity/shopping', undefined);
    }
  }

  const handleTypeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const addItem = () => {
    let currentChipData = chipData;
    let newChipData = currentChipData.slice();

    if (type === '') {
      alert('You need to select a item type');
      return;
    }

    if (itemName === '') {
      alert('You need to add an item name');
      return;
    }

    newChipData.push({
      key: newChipData.length,
      label: itemName,
      type: type,
      notes: '',
      complete: false
    });

    setItemName('');
    setType('');
    setChipData(newChipData);
  };

  let chipsDisplay = chipData.length === 0 ? 'none' : 'block';

  return (
    <div>
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.centerText}>

        <Grid item xs={12} lg={12} md={12} sm={12}>
          <MagiclyPageTitle
            title={'Create A New Shopping List'}
          />
        </Grid>

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" id="standard-basic" label="List name" onChange={event => setListName(event.target.value)} required className={classes.name} />
        </Grid>

        <Grid item xs={12} lg={6} md={12} sm={12} className={classes.centerText} style={{ marginTop: '30px', marginBottom: '30px', display: chipsDisplay}}>
          <Paper component="ul" className={classes.root}>
            {chipData.map((data) => {
              return (
                <li key={data.key}>
                  <Chip
                    label={data.label}
                    onDelete={handleDelete(data)}
                    className={classes.chip}
                    deleteIcon={<Cancel fontSize={'small'} className={classes.deleteIcon} />}
                  />
                </li>
              );
            })}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" id="standard-basic" label="Item name" onChange={event => setItemName(event.target.value)} required className={classes.name} value={itemName} />
        </Grid>

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Item type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              onChange={handleTypeSelect}
            >
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
        </Grid>

        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.saveBtn}>
          <MagiclyButton
            btnLabel={'Add Item'}
            onClick={addItem}
          />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.saveBtn}>
          <MagiclyButton
            btnLabel={'Save List'}
            onClick={submitForm}
          />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
          <MagiclyButton
            btnLabel={'Cancel'}
            isWhiteBackgroundBtn={true}
            onClick={() => router.back()}
          />
        </Grid>

      </Grid>
    </div>
  )
}

export default NewShoppingListForm;