import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    saveBtn: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '160px',
        height: '55px'
      },
    },
    saveCancelBtns: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      color: '#002642',
      backgroundColor: '#FFF',
      borderRadius: '50px',
      border: '3px #002642 solid',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
      },
    },
  }),
);

const MagiclyButton = (props) => {
  const classes = useStyles();
  let input = [];

  if (props.isWhiteBackgroundBtn) {
    return (
      <Button
        onClick={props.onClick}
        className={classes.saveCancelBtns}
        component={props.component ? props.component : 'button'}
        variant="contained">
        { props.btnLabel }
      </Button>
    );
  }

  if (props.isChooseFileBtn) {
    input.push(
      <input
        id="fileinput"
        type="file"
        required
        onChange={props.onFileChange}
        hidden
      />
    );
  }

  return (
    <Button
      onClick={props.onClick}
      component={props.component ? props.component : 'button'}
      className={classes.saveBtn}>
      { props.btnLabel}
      { input }
    </Button>
  );
}

export default MagiclyButton;