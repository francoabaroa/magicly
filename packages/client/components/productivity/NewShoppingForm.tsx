import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import MagiclyButton from '../shared/MagiclyButton';
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
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    centerText: {
      textAlign: 'center',
    },
    saveBtn: {
      textAlign: 'center',
      marginBottom: '10px',
    },
    notes: {
      marginBottom: '40px',
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
  }),
);

const NewShoppingForm = () => {
  const classes = useStyles();
  const [createListItem, { data, loading, error }] = useMutation(CREATE_LIST_ITEM);
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');

  const submitForm = () => {
    if (type === '') {
      alert('You need to select a item type');
      return;
    }

    const variables = {
      variables: {
        name,
        type,
        notes,
        listType: LIST_TYPE.SHOPPING
      }
    };
    createListItem(variables);

  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createListItem && data.createListItem.id) {
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

  return (
    <div>
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.centerText}>

        <Grid item xs={12} lg={12} md={12} sm={12}>
          <MagiclyPageTitle
            title={'Add A New Shopping Item'}
          />
        </Grid>

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" id="standard-basic" label="Item name" onChange={event => setName(event.target.value)} required className={classes.name} />
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

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" className={classes.notes} id="standard-basic" label="Additional notes" onChange={event => setNotes(event.target.value)} />
        </Grid>

        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.saveBtn}>
          <MagiclyButton
            btnLabel={'Save'}
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

export default NewShoppingForm;