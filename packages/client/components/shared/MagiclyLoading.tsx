import React, { useState } from 'react';
import Layout from '../Layout';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const MagiclyLoading = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <Layout>
      <Backdrop className={classes.backdrop} open={props.open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
}

export default MagiclyLoading;