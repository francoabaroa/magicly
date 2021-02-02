import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import MagiclyError from '../../components/shared/MagiclyError';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorderOutlined from '@material-ui/icons/FavoriteBorderOutlined';
import Save from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';

import Cookies from 'js-cookie';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PRODUCT_OR_SERVICE } from '../../constants/appStrings';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const SAVE_SERVICE = gql`
  mutation SaveService(
    $name: String!,
    $type: ServiceType!,
    $favorite: Boolean,
    $url: String,
    $description: String,
  ) {
    saveService(
      name: $name,
      type: $type,
      favorite: $favorite,
      url: $url,
      description: $description
    ) {
      id
      name
      favorite
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
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#002642',
      marginTop: '0px',
      marginBottom: '30px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        marginTop: '0px',
        marginBottom: '30px',
      },
    },
    findPage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '15px',
    },
    viewProdsServs: {
      fontFamily: 'Overpass, serif',
      fontSize: '18px',
      margin: '0 auto',
      display: 'block',
      marginBottom: '30px',
      color: '#002642',
      backgroundColor: '#FFF',
      border: '3px solid #002642',
      borderRadius: '50px',
      width: '250px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '180px',
        height: '40px'
      },
    },
    centerText: {
      textAlign: 'center',
    },
    link: {
      marginLeft: '15px',
      marginRight: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
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
    search: {
      minWidth: '500px',
      color: '#002642',
      [theme.breakpoints.down('xs')]: {
        minWidth: '250px',
      }
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '34px',
      color: '#002642',
      marginTop: '30px',
      marginBottom: '35px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
        marginBottom: '25px',
      },
    },
    row: {
      maxWidth: '640px',
      borderBottom: '1px solid #002642',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
    },
    iconAndService: {
      textAlign: 'left',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
    }
  }),
);

const fetchServices = async () => {
  const response = await fetch('/home/servicesList');
  if (response.redirected) {
    return [];
  }
  const responseJSON = await response.json();
  return responseJSON;
};

const FindPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [saveService, { data, loading, error }] = useMutation(
    SAVE_SERVICE,
    {
      onCompleted({ saveService }) {
        updateServices(saveService);
      }
    }
  );
  const [productOrService, setProductOrService] = useState('');
  const [products, setProducts] = useState({});
  const [services, setServices] = useState({});
  const [popularServices, setPopularServices] = useState([]);
  const [hidePopularServices, setHidePopularServices] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [filteredSearchResults, setFilteredSearchResults] = useState([]);
  const [hasSavedServices, setHasSavedServices] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [individualServiceOpen, setIndividualServiceOpen] = React.useState(false);
  const [individualService, setIndividualService] = React.useState({});

  useEffect(() => {
    async function getServices() {
      // handleToggle();
      const services = await fetchServices();
      if (services && services.services && services.services.Popular) {
        setServices(services.services);
        setPopularServices(services.services.Popular);
        setHasSavedServices(services.hasSavedServices);
        // handleClose();
      }
    }
    getServices();
  }, []);

  if (error) return <MagiclyError message={error.message} />;

  const updateServices = (updatedService) => {
    if (updatedService) {
      let updatedServices = {};
      let updatedFilteredSearchResults = [];
      for (const property in services) {
        services[property].forEach((service) => {
          if (!updatedServices[property]) {
            updatedServices[property] = [];
          }

          let individualService = {
            title: service.title,
            url: service.url,
            category: service.category,
            description: service.description,
            favorited: service.favorited,
          };
          if (service.title === updatedService.name) {
            individualService.favorited = updatedService.favorite;
          }

          updatedServices[property].push(individualService);
        });

      }

      filteredSearchResults.forEach((result, index) => {
        if (updatedService.name === result.title) {
          let individualService = { ...result};
          individualService.favorited = updatedService.favorite;
          updatedFilteredSearchResults.push(individualService);
        } else {
          updatedFilteredSearchResults.push(result);
        }
      });

      setPopularServices(updatedServices['Popular']);
      setServices(updatedServices);
      setFilteredSearchResults(updatedFilteredSearchResults);
    }

  };

  const handleClickOpen = (results) => {
    setFilteredSearchResults(results);
    setModalOpen(true);
  };

  const handleIndividualServiceOpen = (service) => {
    setIndividualService(service);
    setIndividualServiceOpen(true);
  };

  const handleIndividualServiceClose = () => {
    setIndividualService({});
    setIndividualServiceOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const notifyOfEmptySearch = () => {
    // send an email to us or something
    // TODO: implement
  };

  const routePage = (pageName: string) => {
    // TODO: this type of routing is temp and should be replaced with NEXT JS router logic
    // in order to speed up
    if (process.browser || (window && window.location)) {
      window.location.href = url + pageName;
    } else {
      router.push('/' + pageName, undefined);
    }
  };

  const routeToUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowSearch(true);
    setProductOrService(event.target.value);
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const saveServiceToDB = (serviceInfo, isFavorited) => {
    // TODO: type: HOME is temp until we introduce personal services
    const variables = {
      variables: {
        name: serviceInfo.title,
        type: 'HOME',
        favorite: isFavorited,
        url: serviceInfo.url,
        description: serviceInfo.description
      }
    };
    if (!hasSavedServices && isFavorited) {
      setHasSavedServices(isFavorited);
    }
    saveService(variables);
    handleIndividualServiceClose();
  };

  const getFavoriteIcon = (isFavorited: boolean, service: any) => {
    return isFavorited ?
      <Favorite className={classes.favoriteIcon} onClick={saveServiceToDB.bind(this, service, false)} /> :
      <FavoriteBorderOutlined className={classes.favoriteIcon} onClick={saveServiceToDB.bind(this, service, true)} />;
  }

  const buildPopularResults = () => {
    let searchResults =[];
    let counter = 0;
    if (popularServices.length > 0) {
      popularServices.forEach((service) => {
        searchResults.push(
          <Grid key={counter++} container justify="center" alignContent="center" alignItems="center" className={classes.row}>
            <Grid item xs={9} lg={8} md={8} sm={8} style={{ textAlign: 'left' }} className={classes.iconAndService}>
              <Build className={classes.toolIcon} />
              <a target="_blank" className={classes.link} onClick={handleIndividualServiceOpen.bind(this, service)}>{service.title}</a>
            </Grid>
            <Grid item xs={2} lg={2} md={2} sm={2} style={{ textAlign: 'right' }}>
              {getFavoriteIcon(service.favorited, service)}
            </Grid>
          </Grid>
        );
      });
    }
    return searchResults;
  };

  const handleRealtimeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let searchKeys = {};
    let word = event.target.value as string;
    if (word.length > 0) {
      setHidePopularServices(true);
    } else if (word.length === 0) {
      setHidePopularServices(false);
    }
    let results = [];

    for (const property in services) {
      services[property].forEach((service, index) => {
        let serviceName = service.title;
        let serviceDescription = service.description;
        if (serviceName.toLowerCase().indexOf(word.toLowerCase()) != -1) {
          if (!searchKeys[serviceName]) {
            searchKeys[serviceName] = true;
            results.push(service);
          }
        } else if (serviceDescription && serviceDescription.length > 0 && serviceDescription.toLowerCase().indexOf(word.toLowerCase()) != -1) {
          if (!searchKeys[serviceName]) {
            searchKeys[serviceName] = true;
            results.push(service);
          }
        }
      });
    }

    if (results.length === 0) {
      handleClickOpen(results);
    } else {
      setFilteredSearchResults(results);
    }
  };

  const clearSearch = () => {
    if (process.browser) {
      document.getElementById('outlined-basic')['value'] = '';
    }
    setHidePopularServices(false);
  };

  const buildFilteredSearchResults = () => {
    let results = [];
    let counter = 0;

    results.push(
      <Grid key={900} item xs={12} lg={12} md={12} sm={12}>
        <h4 className={classes.subtitle}>Search Results</h4>
      </Grid>
    );

    for (let i = 0; i < filteredSearchResults.length; i++) {
      results.push(
        <Grid key={counter++}  container justify="center" alignContent="center" alignItems="center" className={classes.row}>
          <Grid item xs={9} lg={8} md={8} sm={8} style={{ textAlign: 'left' }} className={classes.iconAndService}>
              <Build className={classes.toolIcon} />
              {/* href={filteredSearchResults[i].url} */}
              <a target="_blank" className={classes.link} onClick={handleIndividualServiceOpen.bind(this, filteredSearchResults[i])}>{filteredSearchResults[i].title}</a>
            </Grid>
          <Grid item xs={2} lg={2} md={2} sm={2} style={{ textAlign: 'right' }}>
              {getFavoriteIcon(filteredSearchResults[i].favorited, filteredSearchResults[i])}
            </Grid>
          </Grid>
      );
    }

    if (results.length === 1) {
      results.push(
        <Grid key={901} item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <h4 style={{textAlign: 'center'}}>Didn't find what you're looking for?</h4>
          <Button onClick={notifyOfEmptySearch} color="primary">
            Let us know
          </Button>
        </Grid>
      );
    }
    return results;
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
          <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">{individualService['title']}</DialogTitle>
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
          {
            individualService['favorited'] ?
            null :
                <Button onClick={saveServiceToDB.bind(this, individualService, true)} color="primary" autoFocus>
                  Save For Later
          </Button>
          }
          </DialogActions>
        </Dialog>
      );
    } else {
      return null;
    }
  };

  // TODO: if no saved services, dont display button
  return (
    <Layout>
      <div className={classes.findPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
            <h2
              className={classes.title}>
              What service are you looking for today?
            </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container justify="center" alignContent="center" alignItems="center">
            {/* <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
              <h4 className={classes.subtitle}>What are you looking for today?</h4>
              <FormControl component="fieldset">
                <RadioGroup aria-label="productOrService" name="productOrService1" value={productOrService} onChange={handleChange}>
                  <FormControlLabel value={PRODUCT_OR_SERVICE.PRODUCT} disabled control={<Radio />} label={getCapitalizedString(PRODUCT_OR_SERVICE.PRODUCT)} />
                  <FormControlLabel value={PRODUCT_OR_SERVICE.SERVICE} control={<Radio />} label={getCapitalizedString(PRODUCT_OR_SERVICE.SERVICE)} />
                </RadioGroup>
              </FormControl>
            </Grid> */}
            {
              showSearch ?
                <Grid item xs={12} lg={12} style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <form noValidate autoComplete="off">
                    <TextField id="outlined-basic" type="search" label="Search" variant="outlined" className={classes.search} autoComplete="off" onInput={handleRealtimeSearch} />
                  </form>
                </Grid> : null
            }

            {hasSavedServices ?
              <Grid container justify="center" alignContent="center" alignItems="center">
                <Grid item xs={12} lg={12} md={12} sm={12} onClick={routePage.bind(this, 'find/saved')}>
                  <Button className={classes.viewProdsServs} > View Saved Services</Button>
                  {/* <Button className={classes.viewProdsServs} > View Saved Services & Products </Button> */}
                </Grid>
              </Grid> :
              null
            }

            {
              showSearch && !hidePopularServices ?
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <h4 className={classes.subtitle}>Popular Home Services</h4>
                </Grid> : null
            }
            {
              showSearch && !hidePopularServices ?
                <Grid item xs={12} lg={12} md={12} sm={12} style={{textAlign: 'center'}}>
                  { buildPopularResults() }
                </Grid> : null
            }

            {
              individualServiceOpen ?
                getIndividualServiceModal() :
                null
            }

            {
              hidePopularServices ?
                <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
                  { buildFilteredSearchResults() }
                </Grid>
               :
              null
              }

          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FindPage);