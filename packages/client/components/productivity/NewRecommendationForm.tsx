import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    formTextFields: {
      marginBottom: '15px',
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

const NewRecommendationForm = () => {
  const classes = useStyles();
  const [createListItem, { data, loading, error }] = useMutation(CREATE_LIST_ITEM);
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState(ITEM_TYPE.MOVIE);
  const [notes, setNotes] = useState('');

  const submitForm = () => {
    const variables = {
      variables: {
        name,
        type,
        notes,
        listType: LIST_TYPE.RECOMMENDATION
      }
    };
    createListItem(variables);

  }

  if (loading) return <MagiclyLoading open={true} hideLayout={true}/>;
  if (error) return <MagiclyError message={error.message} hideLayout={true}/>;
  if (data && data.createListItem && data.createListItem.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/recommendations';
    } else {
      router.push('/productivity/recommendations', undefined);
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

  let docTypeOptions = [
    ITEM_TYPE.MOVIE,
    ITEM_TYPE.TV,
    ITEM_TYPE.FOOD,
    ITEM_TYPE.RESTAURANT,
    ITEM_TYPE.MUSIC,
    ITEM_TYPE.TRAVEL,
    ITEM_TYPE.ACCOMODATION,
    ITEM_TYPE.HOME,
    ITEM_TYPE.FINANCE,
    ITEM_TYPE.BOOK,
    ITEM_TYPE.PODCAST,
    ITEM_TYPE.PRODUCT,
    ITEM_TYPE.SERVICE,
    ITEM_TYPE.PERSONAL,
    ITEM_TYPE.WORK,
    ITEM_TYPE.FAMILY,
    ITEM_TYPE.HEALTH,
    ITEM_TYPE.SHOPPING,
    ITEM_TYPE.GIFT,
    ITEM_TYPE.OTHER
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={3}>
        <form
          autoComplete="off"
          noValidate
        >
          <Card>
            <CardHeader
              title={`New Recommendation`}
            />
            <Divider />
            <CardContent>

              <TextField
                fullWidth
                name="name"
                autoComplete="off"
                label={'Recommendation name'}
                onChange={event => setName(event.target.value)}
                required
                variant="outlined"
                className={classes.formTextFields}
              />

              <TextField
                fullWidth
                label="Recommendation type"
                name="type"
                required
                select
                SelectProps={{ native: true }}
                defaultValue={type}
                onChange={handleTypeSelect}
                variant="outlined"
                className={classes.formTextFields}
              >
                {docTypeOptions.map((option, index) => (
                  <option
                    key={index}
                    value={option}
                  >
                    {option === 'TV' ? 'TV' : getCapitalizedString(option)}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Notes"
                name="notes"
                onChange={event => setNotes(event.target.value)}
                variant="outlined"
                className={classes.formTextFields}
              />

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

export default NewRecommendationForm;