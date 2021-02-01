import React from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const QUERY = gql`
  query GetMyHomeworks {
    me {
      id
      homeworks {
        id
        title
      }
    }
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
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
  }),
);

const HomeWorkDropdown = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useQuery(QUERY, { pollInterval: 500 });
  const homeWorkDropdownItems = [];

  if (loading) return <MagiclyLoading open={true}/>;
  if (error) return <MagiclyError message={error.message} />;
  if (data && data.me && data.me.homeworks) {
    data.me.homeworks.forEach((homework, key) => {
      homeWorkDropdownItems.push(<MenuItem key={key} value={homework.id}>{homework.title}</MenuItem>)
    })
  }

  return (
    <div className={classes.root}>
      {/* <h1>Add a new todo list item</h1> */}
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Related Home Work</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.homeworkId}
          onChange={props.setHomeworkId}
        >
          { homeWorkDropdownItems }
        </Select>
      </FormControl>
    </div>
  )
}

export default HomeWorkDropdown;