import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { LIST_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import Edit from '@material-ui/icons/Edit';

const QUERY = gql`
  query GetListItems(
    $listTypes: [ListType]
    $cursor: String,
    $limit: Int,
  ) {
    lists(
      listTypes: $listTypes,
      cursor: $cursor,
      limit: $limit,
    ) {
      edges {
        id
        name
        type
        listItems {
          id
          name
          type
          notes
        }
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
    firstTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '32px',
      color: '#002642',
      marginTop: '0px',
      marginBottom: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '10px',
        marginBottom: '10px',
      },
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '32px',
      color: '#002642',
      marginTop: '10px',
      marginBottom: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '10px',
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
      fontFamily: 'Fredoka One, cursive',
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

const ListsPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let todoListItems: Array<any> = [];
  let todoListItemsUI: Array<any> = [];
  let watchListItems: Array<any> = [];
  let watchListItemsUI: Array<any> = [];
  let laterListItems: Array<any> = [];
  let laterListItemsUI: Array<any> = [];
  let hasSavedListItems: boolean = false;

  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        listTypes: [
          LIST_TYPE.TODO,
          LIST_TYPE.WATCH,
          LIST_TYPE.LATER,
        ],
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
      <Grid key={key} container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="lists/view/[id]" as={`lists/view/${listItem.id}`}>
            <span className={classes.link}>{listItem.name}</span>
          </Link>
        </Grid>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="lists/view/[id]" as={`lists/view/${listItem.id}`}>
            <span className={classes.type}>{listItem.type}</span>
          </Link>
        </Grid>
      </Grid>
    );
  };

  if (data && data.lists && data.lists.edges) {
    data.lists.edges.forEach((edge, key) => {
      if (edge.type === LIST_TYPE.TODO) {
        todoListItems = edge.listItems
      } else if (edge.type === LIST_TYPE.WATCH) {
        watchListItems = edge.listItems;
      } else if (edge.type === LIST_TYPE.LATER) {
        laterListItems = edge.listItems;
      }
    });
  }

  if (todoListItems.length > 0) {
    hasSavedListItems = true;
    todoListItems.forEach((item, key) => {
      todoListItemsUI.push(getIndividualListItem(key, item))
    });
  }

  if (watchListItems.length > 0) {
    hasSavedListItems = true;
    watchListItems.forEach((item, key) => {
      watchListItemsUI.push(getIndividualListItem(key, item))
    });
  }

  if (laterListItems.length > 0) {
    hasSavedListItems = true;
    laterListItems.forEach((item, key) => {
      laterListItemsUI.push(getIndividualListItem(key, item))
    });
  }

  const getMainUI = () => {
    if (hasSavedListItems) {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={4} md={4} sm={4}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add to-do item</span>
            </div>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={4}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <Search fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>search lists</span>
            </div>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={4}>
            <div className={classes.individualFeature}>
              <Edit fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>edit</span>
            </div>
          </Grid>

          <Grid item xs={8}>
            <h1 className={classes.firstTitle}>To-Do Now</h1>
          </Grid>
          {todoListItemsUI}

          <Grid item xs={8}>
            <h1 className={classes.title}>To Watch</h1>
          </Grid>
          {watchListItemsUI}

          <Grid item xs={8}>
            <h1 className={classes.title}>To-Do Later</h1>
          </Grid>
          {laterListItemsUI}

        </Grid>
      );
    } else {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8} lg={7} md={7} sm={7}>
            <h1 className={classes.mediumTitle}>save your tasks in organized to-do-lists to be more productive than ever</h1>
          </Grid>
          <Grid item xs={12} lg={6} md={6} sm={6}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add to-do item</span>
            </div>
          </Grid>
          <Grid item xs={8} lg={7} md={7} sm={7}>
            <h1 className={classes.smallTitle}>tap the plus icon to start adding tasks or items you have to do now, do later, or just remember</h1>
          </Grid>
        </Grid>
      );
    }
  };

  // TODO: CSS BUG where width extends past appBar width
  // TODO: need to add complete item checkbox functionality
  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(ListsPage);