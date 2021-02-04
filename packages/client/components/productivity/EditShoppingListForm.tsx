import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import MagiclyPageTitle from '../shared/MagiclyPageTitle';
import MagiclyButton from '../shared/MagiclyButton';
import MagiclyError from '../shared/MagiclyError';
import MagiclyLoading from '../shared/MagiclyLoading';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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

const UPDATE_LIST_WITH_ITEMS = gql`
  mutation UpdateShoppingList(
    $id: ID!,
    $name: String,
    $type: ListType!,
    $preSaveListItems: [PreSaveListItem],
  ) {
    updateListWithItems(
      id: $id,
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

const getInitialChipData = (items) => {
  let data = [];
  items.forEach((item, index) => {
    data.push({
      key: index,
      label: item.name,
      type: item.type,
      notes: item.notes,
      complete: item.complete
    });
  });
  return data;
};

const EditShoppingListForm = (props) => {
  const classes = useStyles();

  const [updateListWithItems, { data, loading, error }] = useMutation(UPDATE_LIST_WITH_ITEMS);

  const router = useRouter();
  const [listName, setListName] = useState(props.list.name);
  const [id, setId] = useState(props.list.id);
  const [itemName, setItemName] = useState('');
  const [type, setType] = useState('SHOPPING');
  const [chipData, setChipData] = React.useState(getInitialChipData(props.list.listItems));

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
        id,
        name: listName,
        type: LIST_TYPE.SHOPPING,
        preSaveListItems: listItems
      }
    };
    updateListWithItems(variables);

  }

  if (loading) return <MagiclyLoading open={true} hideLayout={true} />;
  if (error) return <MagiclyError message={error.message} hideLayout={true} />;
  if (data && data.updateListWithItems && data.updateListWithItems.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/shopping';
    } else {
      router.push('/productivity/shopping', undefined);
    }
  }
  const addItem = () => {
    let currentChipData = chipData;
    let newChipData = currentChipData.slice();

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

    setType('SHOPPING');
    setItemName('');
    setChipData(newChipData);
  };

  let chipsDisplay = chipData.length === 0 ? 'none' : 'block';

  return (
    <div>
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.centerText}>

        <Grid item xs={12} lg={12} md={12} sm={12}>
          <MagiclyPageTitle
            title={'Edit Shopping List'}
          />
        </Grid>

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField defaultValue={listName} autoComplete="off" id="standard-basic" label="List name" onChange={event => setListName(event.target.value)} required className={classes.name} />
        </Grid>

        <Grid item xs={12} lg={6} md={12} sm={12} className={classes.centerText} style={{ marginTop: '30px', marginBottom: '30px', display: chipsDisplay }}>
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
          <TextField autoComplete="off" label="Item name" onChange={event => setItemName(event.target.value)} required className={classes.name} value={itemName} />
        </Grid>

        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.saveBtn} style={{ marginTop: '30px' }}>
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

export default EditShoppingListForm;