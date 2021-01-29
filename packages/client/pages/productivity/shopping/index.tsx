import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import MagiclyAddIconLabel from '../../../components/shared/MagiclyAddIconLabel';
import gql from 'graphql-tag';
import { LIST_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const QUERY = gql`
  query GetShoppingItems (
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

const ShoppingPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let listItems: Array<any> = [];
  let hasSavedListItems: boolean = false;

  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        listType: LIST_TYPE.SHOPPING,
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
      <Grid key={key} container spacing={1} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="shopping/view/[id]" as={`shopping/view/${listItem.id}`}>
            <span className={classes.link}>{listItem.name}</span>
          </Link>
        </Grid>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="shopping/view/[id]" as={`shopping/view/${listItem.id}`}>
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

  const getMainUI = () => {
    if (hasSavedListItems) {
      return (
        <Grid container spacing={1} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Shopping Lists'}
            />
          </Grid>
          <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/add')}>
              <MagiclyAddIconLabel />
            </div>
          </Grid>
          {listItems}
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={1} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8} lg={7} md={7} sm={7}>
            <MagiclyPageTitle
              title={'Shopping Lists'}
            />
          </Grid>
          <Grid item xs={12} lg={6} md={6} sm={6}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/add')}>
              <MagiclyAddIconLabel />
            </div>
          </Grid>
          <Grid item xs={8} lg={7} md={7} sm={7}>
            <h1 className={classes.smallTitle}>tap the plus icon to start adding gifts, groceries or any other shopping items you need</h1>
          </Grid>
        </Grid>
      );
    }
  };


  // TODO: CSS BUG where width extends past appBar width
  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(ShoppingPage);