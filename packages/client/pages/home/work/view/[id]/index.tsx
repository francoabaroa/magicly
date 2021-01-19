import React from 'react';
import Layout from '../../../../../components/Layout';
import { withApollo } from '../../../../../apollo/apollo';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Event from '@material-ui/icons/Event';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Person from '@material-ui/icons/Person';
import Notes from '@material-ui/icons/Notes';
import Title from '@material-ui/icons/Title';

const QUERY = gql`
  query GetHomework ($id: ID!) {
    homework(id: $id) {
      id
      title
      status
      type
      notificationType
      cost
      costCurrency
      keywords
      notes
      executor
      executionDate
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
      marginTop: '25px',
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    deleteButton: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
      },
    },
    completeBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
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
    individualFeature: {
      textAlign: 'center',
      marginBottom: '5px',
    },
    details: {
      color: 'rgba(0, 38, 66, 0.5)',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '24px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    icon: {
      color: 'rgba(0, 38, 66, 0.5)',
      fontSize: '18px',
    }
  }),
);

const ViewHomeWorkPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  const getCapitalizedString = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const getUI = (data: any) => {
    // TODO: adapt function if only required fields are passed, to show right things on the UI
    // TODO: add edit and delete functionality
    if (data && data.homework) {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}> { getCapitalizedString(data.homework.title) }</h1>
          </Grid>
          {/* <Grid item xs={7} lg={7} md={7} sm={7}>
            <div className={classes.individualFeature}>
              <Title fontSize={'large'} className={classes.icon} />
              <span className={classes.details}>{data.homework.title}</span>
            </div>
          </Grid> */}
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <div className={classes.individualFeature}>
              <Add fontSize={'large'} className={classes.icon}/>
              <span className={classes.details}>{ getCapitalizedString(data.homework.type) }</span>
            </div>
          </Grid>
          {
            data.homework.executionDate ?
              <Grid item xs={7} lg={7} md={7} sm={7}>
                <div className={classes.individualFeature}>
                  <Event fontSize={'large'} className={classes.icon} />
                  <span className={classes.details}>{moment(data.homework.executionDate).format('MMMM Do, YYYY')}</span>
                </div>
              </Grid> :
              null
          }
          {
            data.homework.cost ?
              <Grid item xs={7} lg={7} md={7} sm={7}>
                <div className={classes.individualFeature}>
                  <AttachMoney fontSize={'large'} className={classes.icon} />
                  <span className={classes.details}>{data.homework.cost}</span>
                </div>
              </Grid> :
              null
          }
          {
            data.homework.executor && data.homework.executor.length > 0 ?
              <Grid item xs={7} lg={7} md={7} sm={7}>
                <div className={classes.individualFeature}>
                  <Person fontSize={'large'} className={classes.icon} />
                  <span className={classes.details}>{data.homework.executor}</span>
                </div>
              </Grid> :
              null
          }
          {
            data.homework.notes && data.homework.notes.length > 0 ?
              <Grid item xs={7} lg={7} md={7} sm={7}>
                <div className={classes.individualFeature}>
                  <Notes fontSize={'large'} className={classes.icon} />
                  <span className={classes.details}>{data.homework.notes}</span>
                </div>
              </Grid> :
              null
          }
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <Button
              onClick={()=>{}}
              className={classes.completeBtn}
            >
              Mark As Complete
            </Button>
          </Grid>
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <Button
              onClick={() => { }}
              className={classes.deleteButton}
            >
              Delete
            </Button>
          </Grid>

        </Grid>
      );
    } else {
      return null;
    }
  };
  return (
    <Layout>
      { getUI(data) }
    </Layout>
  );
};

export default withApollo({ ssr: false })(ViewHomeWorkPage);