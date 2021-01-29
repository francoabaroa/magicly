import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    landingPageTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '48px',
      color: '#002642',
      marginTop: '45px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '30px',
        marginTop: '35px',
      },
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '40px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '10px',
      },
      [theme.breakpoints.down('xs')]: {
        marginTop: '0px',
      },
    },
  }),
);

const MagiclyPageTitle = (props) => {
  const classes = useStyles();

  if (props.isLandingPageTitle) {
    return (
      <h1 className={classes.landingPageTitle}> {props.title} </h1>
    );
  }

  return (
    <h1 className={classes.title}> {props.title} </h1>
  );
}

export default MagiclyPageTitle;