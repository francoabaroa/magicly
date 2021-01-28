import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    details: {
      color: 'rgba(0, 38, 66, 0.8)',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '22px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
      },
    },
    icon: {
      color: 'rgba(0, 38, 66, 0.8)',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
  }),
);

const MagiclySearchIconLabel = (props) => {
  const classes = useStyles();

  return (
    <span>
      <Search fontSize={'small'} className={classes.icon} />
      <span className={classes.details}>search</span>
    </span>
  );
}

export default MagiclySearchIconLabel;