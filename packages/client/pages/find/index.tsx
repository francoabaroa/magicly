import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
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

const SAVE_SERVICE = gql`
  mutation SaveService(
    $name: String!,
    $type: ServiceType!,
    $favorite: Boolean,
    $url: String,
  ) {
    saveService(
      name: $name,
      type: $type,
      favorite: $favorite,
      url: $url
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
    findPage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '15px',
    },
    viewProdsServs: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '18px',
      margin: '0 auto',
      display: 'block',
      marginTop: '40px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      width: '250px',
      height: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '180px',
        height: '30px'
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
      [theme.breakpoints.down('xs')]: {
        minWidth: '320px',
      }
    },
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
  const [open, setModalOpen] = React.useState(false);

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

  if (error) return <p>Error: {error.message}</p>;

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

  const handleClose = () => {
    setModalOpen(false);
  };

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
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
        url: serviceInfo.url
      }
    };
    saveService(variables);
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
          <Grid key={counter++} item xs={12} lg={12} md={12} sm={12} style={{textAlign: 'center'}}>
            <Build className={classes.toolIcon} />
            <a href={service.url} target="_blank" className={classes.link}>{service.title}</a>
            {getFavoriteIcon(service.favorited, service) }
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
        <Grid key={counter++} item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <Build className={classes.toolIcon} />
          <a href={filteredSearchResults[i].url} target="_blank" className={classes.link}>{filteredSearchResults[i].title}</a>
          {getFavoriteIcon(filteredSearchResults[i].favorited, filteredSearchResults[i])}
        </Grid>
      );
    }
    return results;
  };

  // TODO: if no saved services, dont display button
  return (
    <Layout>
      <div className={classes.findPage}>
        { hasSavedServices ?
          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={12} md={12} sm={12} onClick={routePage.bind(this, 'find/saved')}>
              <Button className={classes.viewProdsServs} > View Saved Services</Button>
              {/* <Button className={classes.viewProdsServs} > View Saved Services & Products </Button> */}
            </Grid>
          </Grid> :
          null
        }

        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
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
                <Grid item xs={12} lg={12} style={{ textAlign: 'center' }}>
                  <TextField id="outlined-basic" label="Search" variant="outlined" className={classes.search} autoComplete="off" onInput={handleRealtimeSearch} />
                  {process.browser && document.getElementById('outlined-basic') && document.getElementById('outlined-basic')['value'].length > 0 ? <Button variant="contained" style={{ border: '2px solid #840032', backgroundColor: 'white', color: '#840032', marginLeft: '10px', height: '55px' }} onClick={clearSearch}>
                    Clear
              </Button> : null }
                </Grid> : null
            }
            {
              showSearch && !hidePopularServices ?
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <h4 className={classes.subtitle}>Popular Home Services</h4>
                </Grid> : null
            }
            {
              showSearch && !hidePopularServices ?
                buildPopularResults() : null
            }

            {hidePopularServices ? buildFilteredSearchResults() : null }

          </Grid>
          {/* <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"We're sorry!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                We don't have a service for the search term you entered. Would you like to notify us of this so we can find you a trusted service?
          </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Yes
          </Button>
              <Button onClick={handleClose} color="primary" autoFocus>
                No
          </Button>
            </DialogActions>
          </Dialog> */}
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FindPage);