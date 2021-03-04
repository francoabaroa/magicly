import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import MagiclyError from '../shared/MagiclyError';
import MagiclyLoading from '../shared/MagiclyLoading';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';

import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';

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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 'auto',
      maxWidth: '550px',
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
    formTextFields: {
      marginBottom: '15px',
    },
  }),
);

const NewShoppingListForm = () => {
  const classes = useStyles();
  const [createListWithItems, { data, loading, error }] = useMutation(CREATE_LIST_WITH_ITEMS);
  const router = useRouter();
  const [listName, setListName] = useState('');
  const [itemName, setItemName] = useState('');
  const [type, setType] = useState('SHOPPING');
  const [open, setOpen] = React.useState(false);
  const [chipData, setChipData] = React.useState([]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
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

    handleToggle();
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

  const setItem = (event) => {
    setItemName(event.target.value);
  };

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
    <Container maxWidth="lg">
      <Box mt={3}>
        <form
          autoComplete="off"
          noValidate
        >
          <Card>
            <CardHeader
              title={`New Shopping List`}
            />
            <Divider />
            <CardContent>

              <TextField
                fullWidth
                name="name"
                autoComplete="off"
                label={'List name'}
                onChange={event => setListName(event.target.value)}
                required
                variant="outlined"
                className={classes.formTextFields}
              />

              <TextField
                fullWidth
                label="Item name"
                name="itemName"
                onChange={setItem}
                variant="outlined"
                required
                value={itemName}
                className={classes.formTextFields}
              />

              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText} style={{ marginTop: '30px', marginBottom: '30px', display: chipsDisplay }}>
                <ul className={classes.root} style={{listStyleType:'none'}}>
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

                </ul>
              </Grid>

              <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
              </Backdrop>

            </CardContent>
            <Divider />
            <Box
              display="flex"
              justifyContent="flex-end"
              p={2}
            >
              <Button
                color="secondary"
                variant="contained"
                onClick={addItem}
                style={{marginRight: '5px'}}
              >
                Add Item
            </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={submitForm}
              >
                Save List
            </Button>
            </Box>
          </Card>
        </form>
      </Box>
    </Container>
  );
}

export default NewShoppingListForm;