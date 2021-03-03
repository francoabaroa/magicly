import React from 'react';
import { useRouter } from 'next/router';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import TextField from '@material-ui/core/TextField';
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
    formTextFields: {
      marginBottom: '15px',
    },
    formControl: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    selectRoot: {
      marginBottom: '15px',
    }
  }),
);

const HomeWorkDropdown = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useQuery(QUERY, { pollInterval: 500 });
  const homeWorkDropdownItems = [];

  if (loading) return <MagiclyLoading open={true} hideLayout={true}/>;
  if (error) return <MagiclyError message={error.message} hideLayout={true}/>;
  if (data && data.me && data.me.homeworks) {
    data.me.homeworks.forEach((homework, key) => {
      homeWorkDropdownItems.push(homework)
    })
  }

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const getIndividualHomeworkDropdown = () => {
    let homeworkOptions = [];
    homeworkOptions.push(
      <option
        key={0}
      >
        {'None'}
      </option>
    );

    homeWorkDropdownItems.forEach((option, index) => {
      homeworkOptions.push(
        <option
          key={index + 1}
          value={option.id}
        >
          {getCapitalizedString(option.title)}
        </option>
      );
    });

    return homeworkOptions;
  };

  return (
    <TextField
      fullWidth
      label="Related Home Work"
      name="type"
      required
      select
      SelectProps={{ native: true }}
      onChange={props.setHomeworkId}
      variant="outlined"
      className={classes.formTextFields}
    >
      {getIndividualHomeworkDropdown()}
    </TextField>
  );
}

export default HomeWorkDropdown;