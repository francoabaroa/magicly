import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MagiclyError from '../shared/MagiclyError';
import { APP_CONFIG, LIST_TYPE, ITEM_TYPE } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const COMPLETE_LIST_ITEM = gql`
  mutation CompleteListItem(
    $id: ID!,
    $complete: Boolean!,
  ) {
    completeListItem(
      id: $id,
      complete: $complete,
    ) {
      id
      name
      complete
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
    },
    horizontalLine: {
      marginTop: '5px',
      maxWidth: '900px',
    },
    type: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Overpass, serif',
      color: '#840032',
      padding: '8px',
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '15px',
        marginBottom: '0px',
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
    leftText: {
      textAlign: 'left',
    },
    hwType: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    }
  }),
);

const ListItemRow = (props) => {
  let isComplete = null;
  const router = useRouter();
  const classes = useStyles();
  const [completeListItem, { data, loading, error }] = useMutation(
    COMPLETE_LIST_ITEM,
  );

  if (data && data.completeListItem && data.completeListItem.id) {
    isComplete = data.completeListItem.complete;
  } else {
    isComplete = props.listItem.complete;
  }
  const [complete, setComplete] = useState(isComplete);
  let textDecoration = complete ? 'line-through' : 'none';

  if (error) return <MagiclyError message={error.message} hideLayout={true}/>;


  const handleChange = (event) => {
    let isComplete = !complete;
    setComplete(isComplete);

    const variables = {
      variables: {
        id: props.listItem.id,
        complete: isComplete,
      }
    };

    completeListItem(variables);
  };

  return (
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.leftText}>
        <Grid item xs={1} lg={1} md={1} sm={1} style={{maxWidth: '40px'}}>
          <Radio
            checked={complete}
            onClick={handleChange}
          />
        </Grid>
        <Grid item xs={10} lg={5} md={5} sm={10}>
          <Link href="lists/view/[id]" as={`lists/view/${props.listItem.id}`}>
            <a className={classes.link} style={{textDecoration}}>{props.listItem.name}</a>
          </Link>
        </Grid>
      <Grid item xs={1} lg={1} md={1} sm={1} className={classes.hwType}>
          {
            props.listItem.type !== ITEM_TYPE.TODO ?
              <Link href="lists/view/[id]" as={`lists/view/${props.listItem.id}`}>
                <a className={classes.type}>{props.listItem.type}</a>
              </Link> :
              null
          }
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <hr className={classes.horizontalLine} />
        </Grid>
      </Grid>
  )
}

export default ListItemRow;