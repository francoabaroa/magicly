import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      currentCity
      lastName
      email
      setting {
        languageIso2
        defaultNotificationType
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    subtitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '24px',
      color: '#002642',
      marginTop: '0px',
      marginBottom: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        marginTop: '0px',
        marginBottom: '5px',
      },
    },
    edit: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '24px',
      textAlign: 'right',
      color: '#002642',
      marginTop: '0px',
      marginBottom: '10px',
      marginRight: '370px',
      margin: 'auto',
      [theme.breakpoints.down('md')]: {
        marginRight: '230px',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        marginRight: '190px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '18px',
        marginRight: '0px',
      },
    },
    settingsPage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '15px',
    },
    field: {
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px'
      },
    },
    fieldTitle: {
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      fontWeight: 'bold',
      color: '#840032',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px'
      },
    },
    toolIcon: {
      color: '#002642',
      fontSize: '18px',
    },
    favoriteIcon: {
      color: '#002642',
      fontSize: '18px',
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '34px',
      color: '#002642',
      marginTop: '30px',
      paddingBottom: '0px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
      },
    },
    row: {
      borderBottom: '1px solid #840032',
      marginBottom: '15px',
    },
    iconAndService: {
      textAlign: 'left',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    }
  }),
);

const SettingsPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);

  if (error) return <p>Error: {error.message}</p>;

  const routePage = (pageName: string) => {
    if (data && data.me) {
      router.push(
        `/${pageName}?firstName=${data.me.firstName}&currentCity=${data.me.currentCity}&email=${data.me.email}&language=${data.me.setting.languageIso2}&notificationType=${data.me.setting.defaultNotificationType}`,
        pageName
      );
    } else {
      router.push('/' + pageName, undefined);
    }
  };

  if (data && data.me && data.me.email) {
    return (
      <Layout>
        <div className={classes.settingsPage}>
          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
              <MagiclyPageTitle
                title={'Account Settings'}
              />
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12} className={classes.edit} onClick={routePage.bind(this, 'settings/edit')}>
              <span style={{marginRight: '0px'}}>edit</span>
            </Grid>
          </Grid>
          <div className={classes.root}>
            <Grid container spacing={3} justify="center" alignContent="center" alignItems="center" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <h4 className={classes.subtitle}>General Information</h4>
              </Grid>

              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'First Name'}</span>
              </Grid>
              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'right' }}>
                <span style={{ textAlign: 'right' }} className={classes.field}>{data.me.firstName}</span>
              </Grid>

              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Current City'}</span>
              </Grid>
              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'right' }}>
                <span style={{ textAlign: 'right' }} className={classes.field}>{data.me.currentCity}</span>
              </Grid>

              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Email'}</span>
              </Grid>
              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'right' }}>
                <span style={{ textAlign: 'right' }} className={classes.field}>{data.me.email}</span>
              </Grid>

              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Language'}</span>
              </Grid>
              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'right' }}>
                <span style={{ textAlign: 'right' }} className={classes.field}>{data.me.setting.languageIso2}</span>
              </Grid>

              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Notifications'}</span>
              </Grid>
              <Grid item xs={6} lg={6} md={6} sm={6} className={classes.row} style={{ textAlign: 'right' }}>
                <span style={{ textAlign: 'right' }} className={classes.field}>{data.me.setting.defaultNotificationType}</span>
              </Grid>
            </Grid>
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className={classes.settingsPage}>
          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={6} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
              <MagiclyPageTitle
                title={'Account Settings'}
              />
            </Grid>
          </Grid>
          <div className={classes.root}>
            <Grid container spacing={3} justify="center" alignContent="center" alignItems="center" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <h4 className={classes.subtitle}>General Information</h4>
              </Grid>
              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'First Name'}</span>
              </Grid>
              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Current City'}</span>
              </Grid>
              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Email'}</span>
              </Grid>
              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Language'}</span>
              </Grid>
              <Grid item xs={12} lg={12} md={12} sm={12} className={classes.row} style={{ textAlign: 'left' }}>
                <span style={{ textAlign: 'left' }} className={classes.fieldTitle}>{'Notifications'}</span>
              </Grid>
            </Grid>
          </div>
        </div>
      </Layout>
    );
  }
};

export default withApollo({ ssr: false })(SettingsPage);