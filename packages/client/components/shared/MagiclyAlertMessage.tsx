import Link from 'next/link';
import React from 'react';
import Layout from '../Layout';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const MagiclyAlertMessage = (props) => {
  return (
    <Collapse in={props.open}>
    <Alert
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {props.message}
        </Alert>
      </Collapse >
  );
}

export default MagiclyAlertMessage;