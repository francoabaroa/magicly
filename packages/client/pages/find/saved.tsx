import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const QUERY = gql`
  query GetServices(
    $cursor: String,
    $limit: Int
  ) {
    services(
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        name
        url
        favorite
        description
      }
      pageInfo {
        endCursor
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
      marginTop: '25px',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '10px',
      },
    },
    link: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
    },
    type: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Overpass, serif',
      color: '#840032',
      padding: '8px',
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    centerText: {
      marginBottom: '14px',
      textAlign: 'center',
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '35px',
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '14px',
    },
    details: {
      color: '#0A7EF2',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '22px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
  }),
);

const SavedProductsServicesPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [individualServiceOpen, setIndividualServiceOpen] = React.useState(false);
  const [individualService, setIndividualService] = React.useState({});
  let services: Array<any> = [];
  let hasSavedServices: boolean = false;

  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {}
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routeToUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const routePage = (pageName: string) => {
    router.push('/' + pageName);
  };

  const getIndividualService = (key: any, service: any) => {
    return (
      <Grid key={key} container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={12} lg={12} md={12} sm={12}>
            <a target="_blank" className={classes.link} onClick={handleIndividualServiceOpen.bind(this, service)}>
              {service.name}
            </a>
        </Grid>
      </Grid>
    );
  };

  const handleIndividualServiceOpen = (service) => {
    setIndividualService(service);
    setIndividualServiceOpen(true);
  };

  const handleIndividualServiceClose = () => {
    setIndividualService({});
    setIndividualServiceOpen(false);
  };

  const getIndividualServiceModal = () => {
    if (individualService) {
      return (
        <Dialog
          open={individualServiceOpen}
          onClose={handleIndividualServiceClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ textAlign: 'center' }} id="alert-dialog-title">{individualService['title']}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This service is brought to you by Handy, a services company backed by their <a href="https://www.handy.com/handy-guarantee" target="_blank">
                Handy Happiness Guarantee.
                </a>
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              <a href="https://www.handy.com/trust-and-safety" target="_blank">
                All of their workers are vetted and background-checked professionals.
                </a>
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              {individualService['description']}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={routeToUrl.bind(this, individualService['url'])} color="primary">
              View Handy Estimate
          </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  if (data && data.services && data.services.edges && data.services.edges.length > 0) {
    hasSavedServices = true;
    data.services.edges.forEach((service, key) => {
      if (service.favorite) {
        services.push(
          getIndividualService(
            key,
            service
          )
        );
      }
    });
  }

  const getMainUI = () => {
    if (hasSavedServices) {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>My Saved Services</h1>
          </Grid>
          <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'find')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>find more services</span>
            </div>
          </Grid>
          {services}
        </Grid>
      );
    } else {
      router.push('/find');
    }
  };

  // TODO: CSS BUG where width extends past appBar width
  return (
    <Layout>
      {getMainUI()}
      {
        individualServiceOpen ?
          getIndividualServiceModal() :
          null
      }
    </Layout>
  );
};

export default withApollo({ ssr: false })(SavedProductsServicesPage);