import React from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const DELETE_HOMEWORK = gql`
  mutation DeleteHomework(
    $id: ID!
  ) {
    deleteHomework(
      id: $id
    )
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
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    centerText: {
      textAlign: 'center',
    },
    notes: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
  }),
);

const DeleteHomeWorkModal = (props) => {
  const classes = useStyles();
  const [deleteHomework, { data, loading, error }] = useMutation(
    DELETE_HOMEWORK,
    {
      onCompleted({ deleteHomework }) {
        if (deleteHomework) {
          window.location.href = url + 'home/work';
        }
      }
    }
  );
  const router = useRouter();

  const yesDeletePlease = () => {
    deleteHomework({
      variables: {
        id: props.homework.id
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Dialog
      open={props.openModal} onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete it forever?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There will be no way to recover this home work once you delete it.
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={yesDeletePlease} color="primary">
          Yes, Delete
          </Button>
        <Button onClick={props.handleClose} color="primary" autoFocus>
          No, Take Me Back
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteHomeWorkModal;