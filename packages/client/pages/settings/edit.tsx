import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import { APP_CONFIG, DEFAULT_NOTIFICATION_TYPE, LANGUAGE_ISO_2 } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const UPDATE_SETTING = gql`
  mutation UpdateSetting(
    $firstName: String!,
    $currentCity: String!,
    $email: String!,
    $languageIso2: LanguageIso2!,
    $defaultNotificationType: DefaultNotificationType!,
  ) {
    updateSetting(
      firstName: $firstName,
      currentCity: $currentCity,
      email: $email,
      languageIso2: $languageIso2,
      defaultNotificationType: $defaultNotificationType
    ) {
      user {
        id
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '40px',
      color: '#002642',
      marginTop: '45px',
      marginBottom: '25px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '35px',
        marginBottom: '35px',
      },
    },
    updateSettingsButton: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '0px',
      marginBottom: '30px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '90px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        width: '80px',
        height: '35px'
      },
    },
    resetPasswordBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '16px',
      margin: '0 auto',
      display: 'block',
      marginTop: '0px',
      marginBottom: '30px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '150px',
      height: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        width: '110px',
        height: '35px'
      },
    },
    signUpPage: {
      marginRight: '30px',
      marginLeft: '30px',
    },
    formControl: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    inputCenter: {
      textAlign: "center",
      color: "red"
    },
    options: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '18px',
      color: '#002642',
      margin: 'auto',
      textAlign: 'center',
      marginTop: '10px'
    },
    link: {
      fontFamily: 'Playfair Display, serif',
      color: '#E59500',
      textDecoration: 'none',
    },
    inputs: {
      margin: 'auto',
      textAlign: 'center',
    },
    lastInput: {
      margin: 'auto',
      textAlign: 'center',
      marginBottom: '45px',
    },
    label: {
      fontFamily: 'Playfair Display, serif',
      width: '350px',
      [theme.breakpoints.down('sm')]: {
        width: '200px',
      },
    },
  })
);

const EditSettingsPage = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const [email, setEmail] = useState(router.query.email);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [language, setLanguage] = useState(router.query.language);
  const [notificationType, setNotificationType] = useState(router.query.notificationType);
  const [currentCity, setCurrentCity] = useState(router.query.currentCity);
  const [firstName, setFirstName] = useState(router.query.firstName);
  const [hasSocialAuthLogin, setHasSocialAuthLogin] = useState(false);
  const [updateSetting, { data, loading, error }] = useMutation(
    UPDATE_SETTING,
    {
      onCompleted({ updateSetting }) {
        // TODO: best way of doing this?
        if (process.browser || (window && window.location)) {
          window.location.href = url + 'settings';
        }
      }
    }
  );

  if (loading) return <p>Loading...</p>;
  // TODO: show meaningful error message
  if (error && error.message.includes('SequelizeUniqueConstraintError')) {
    return <p>Error: {'This email already exists in our system. Please reset your password.'}</p>
  } else if (error) {
    return <p>Error: {error.message}</p>;
  }

  const submitForm = event => {
    event.preventDefault();
    async function emailVerification() {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `email=${email}`
      };

      const response = await fetch('/verify_email', options);
      const responseJSON = await response.json();

      if (responseJSON.success === true) {
        const variables = {
          variables: {
            firstName,
            currentCity,
            email,
            languageIso2: language,
            defaultNotificationType: notificationType
          }
        };
        updateSetting(variables);
      } else {
        // alert user of email failure
        alert(responseJSON.message + '. Please try a different email');
        return;
      }
    }
    emailVerification();
  };

  const handleLanguageSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLanguage(event.target.value as LANGUAGE_ISO_2);
  };

  const handleNotificationTypeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNotificationType(event.target.value as DEFAULT_NOTIFICATION_TYPE);
  };

  return (
    <Layout>
      <div className={classes.signUpPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Account Settings'}
            />
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={4} md={4} sm={4}>
              <form onSubmit={submitForm}>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="First Name"
                    defaultValue={firstName}
                    onChange={event => setFirstName(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Current City"
                    defaultValue={currentCity}
                    onChange={event => setCurrentCity(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <TextField
                    className={classes.label}
                    label="Email"
                    defaultValue={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className={classes.inputs}>
                  <FormControl className={classes.label} required>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={language}
                      onChange={handleLanguageSelect}
                      style={{textAlign:'left'}}
                    >
                      <MenuItem value={LANGUAGE_ISO_2.EN}>{'English'}</MenuItem>
                      <MenuItem value={LANGUAGE_ISO_2.ES}>{'Spanish'}</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.lastInput}>
                  <FormControl className={classes.label} required>
                    <InputLabel>Notifications</InputLabel>
                    <Select
                      value={notificationType}
                      onChange={handleNotificationTypeSelect}
                      style={{ textAlign: 'left' }}
                    >
                      <MenuItem value={DEFAULT_NOTIFICATION_TYPE.EMAIL}>{'Email'}</MenuItem>
                      <MenuItem value={DEFAULT_NOTIFICATION_TYPE.SMS}>{'SMS'}</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <Button className={classes.updateSettingsButton} type="submit"> Save </Button>
                <Button className={classes.resetPasswordBtn} onClick={()=>{}}> Reset Password </Button>
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(EditSettingsPage);