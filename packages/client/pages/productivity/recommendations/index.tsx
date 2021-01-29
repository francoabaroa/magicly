import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import MagiclyAddIconLabel from '../../../components/shared/MagiclyAddIconLabel';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import gql from 'graphql-tag';
import { LIST_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import Stars from '@material-ui/icons/Stars';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const QUERY = gql`
  query GetRecommendationItems (
    $listType: ListType!,
    $cursor: String,
    $limit: Int
  ) {
    listItems(
      listType: $listType,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        notes
        name
        type
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
    hugeIcon: {
      color: '#E5DADA',
      fontSize: '120px',
      marginTop: '60px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '80px',
      },
    },
    tap: {
      color: '#02040F',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    someExamples: {
      color: '#02040F',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      color: '#FFF',
      textAlign: 'left',
      backgroundColor: "#E5DADA",
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #02040F',
      marginBottom: '20px',
      maxWidth: '400px'
    },
    examples: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '16px',
      color: '#002642',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
      },
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
    emptyMarginTopBlock: {
      marginTop: '50px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px'
      },
    },
    mediumTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '10px',
        marginBottom: '10px',
      },
    },
    smallTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '18px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        marginTop: '10px',
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
      marginBottom: '15px',
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

const RecommendationsPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let listItems: Array<any> = [];
  let hasSavedListItems: boolean = false;

  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        listType: LIST_TYPE.RECOMMENDATION,
      }
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getIndividualListItem = (key: any, listItem: any) => {
    return (
      <Grid key={key} container justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="recommendations/view/[id]" as={`recommendations/view/${listItem.id}`}>
            <span className={classes.link}>{listItem.name}</span>
          </Link>
        </Grid>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="recommendations/view/[id]" as={`recommendations/view/${listItem.id}`}>
            <span className={classes.type}>{listItem.type}</span>
          </Link>
        </Grid>
      </Grid>
    );
  };

  if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
    hasSavedListItems = true;
    data.listItems.edges.forEach((listItem, key) => {
      listItems.push(
        getIndividualListItem(
          key,
          listItem
        )
      );
    });
  }

  const getEmptyUI = () => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }} onClick={routePage.bind(this, 'productivity/recommendations/add')}>
          <Stars fontSize={'large'} className={classes.hugeIcon} />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <span className={classes.tap}>click the star icon to start adding recommendations you’d like to save</span>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center', marginTop: '90px', marginBottom: '10px' }}>
          <span className={classes.someExamples}>some examples for inspiration</span>
        </Grid>
        <Grid container justify="center" alignContent="center" alignItems="center" className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- Game of Thrones</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- The French Laundry</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- Dolores But You Can Call Me Lolita</span>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getMainUI = () => {
    if (hasSavedListItems) {
      return (
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}>
          </Grid>
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Saved Recommendations'}
            />
          </Grid>
          <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations/add')}>
              <MagiclyAddIconLabel />
            </div>
          </Grid>
          {listItems}
        </Grid>
      );
    } else {
      return getEmptyUI();
    }
  };


  // TODO: CSS BUG where width extends past appBar width
  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(RecommendationsPage);