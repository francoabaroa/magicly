import React from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MagiclyButton from '../shared/MagiclyButton';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const MARK_HOMEWORK_DONE = gql`
  mutation MarkHomeworkDone(
    $id: ID!
  ) {
    markHomeworkDone(
      id: $id
    ) {
      id
      title
    }
  }
`;

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

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

const MarkHomeworkDone = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const [markHomeworkDone, { data, loading, error }] = useMutation(
    MARK_HOMEWORK_DONE,
    {
      onCompleted({ markHomeworkDone }) {
        if (markHomeworkDone) {
          let path = 'home/work';

          if (process.browser || (window && window.location)) {
            window.location.href = url + path;
          } else {
            router.push('/' + path, undefined);
          }
        }
      }
    }
  );

  const markDone = () => {
    const variables = {
      variables: {
        id: props.homework.id
      }
    };
    markHomeworkDone(variables);
  };

  if (error) {
    console.log(JSON.stringify(error, null, 2));
  }

  if (props.homework.id) {
    return (
      <MagiclyButton
        btnLabel={'Mark Done'}
        onClick={markDone}
      />
    );
  }

  return null;
}

export default MarkHomeworkDone;