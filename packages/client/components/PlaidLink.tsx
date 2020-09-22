import React, { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/router';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    getStartedBtn: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '22px',
      margin: '0 auto',
      display: 'block',
      marginTop: '10px',
      color: '#FFF',
      backgroundColor: '#E59500',
      borderRadius: '50px',
      width: '250px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '150px',
        height: '30px'
      },
    },
  }),
);

const PlaidLink = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const config = {
    token: props.token,
    onLoad: function () {
      // Optional, called when Link loads
    },
    onSuccess: async function (token, metadata) {
      const body = JSON.stringify({ public_token: token, metadata });
      await fetch('/get_access_token', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body,
      });
      router.push('/finance/dashboard', undefined, { shallow: true });
      // send token to server
    },
    onExit: async function (err, metadata) {
      // The user exited the Link flow.
      if (err != null) {
        // The user encountered a Plaid API error prior to exiting.
        if (err.error_code === 'INVALID_LINK_TOKEN') {
          // The link_token expired or the user entered too many
          // invalid credentials. We want to destroy the old iframe
          // and reinitialize Plaid Link with a new link_token.
        }
      } else {
        router.push('/finance/dashboard', undefined, { shallow: true });
      }
      // metadata contains information about the institution
      // that the user selected and the most recent API request IDs.
      // Storing this information can be helpful for support.
    },
    onEvent: function (eventName, metadata) {
      // Optionally capture Link flow events, streamed through
      // this callback as your users connect an Item to Plaid.
      // For example:
      // eventName = "TRANSITION_VIEW"
      // metadata  = {
      //   link_session_id: "123-abc",
      //   mfa_type:        "questions",
      //   timestamp:       "2017-09-14T14:42:19.350Z",
      //   view_name:       "MFA",
      // }
    }
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <Button
      onClick={() => open()}
      disabled={!ready}
      className={classes.getStartedBtn}
    >
      Get Started
    </Button>
  );
};
export default PlaidLink;