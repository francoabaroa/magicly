import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import ListItemRow from '../../../components/productivity/ListItemRow';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { LIST_TYPE, ITEM_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import ListAlt from '@material-ui/icons/ListAlt';
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
          complete
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
    emptyMarginTopBlock: {
      marginTop: '50px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px'
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
      color: 'rgba(0, 38, 66, 0.8)',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    details: {
      color: 'rgba(0, 38, 66, 0.8)',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '22px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
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
      <ListItemRow
        key={key}
        listItem={listItem}
      />
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
    todoListItems.forEach((item, key) => {
      if (!item.complete) {
        hasSavedListItems = true;
        todoListItemsUI.push(getIndividualListItem(key, item));
      }
    });
  }

  if (watchListItems.length > 0) {
    watchListItems.forEach((item, key) => {
      if (!item.complete) {
        hasSavedListItems = true;
        watchListItemsUI.push(getIndividualListItem(key, item));
      }
    });
  }

  if (laterListItems.length > 0) {
    laterListItems.forEach((item, key) => {
      if (!item.complete) {
        hasSavedListItems = true;
        laterListItemsUI.push(getIndividualListItem(key, item));
      }
    });
  }

  const getEmptyUI = () => {
    return (
      <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }} onClick={routePage.bind(this, 'productivity/lists/add')}>
          <ListAlt fontSize={'large'} className={classes.hugeIcon} />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <span className={classes.tap}>click the list icon to start adding tasks or items</span>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center', marginTop: '90px', marginBottom: '10px' }}>
          <span className={classes.someExamples}>some examples for inspiration</span>
        </Grid>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center" className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- call dentist</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- plan baby shower</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- register to vote</span>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getMainUI = () => {
    if (hasSavedListItems) {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add</span>
            </div>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <Search fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>search</span>
            </div>
          </Grid>

          {
            todoListItemsUI.length > 0 ?
              <Grid item xs={8}>
                <h1 className={classes.title}>To-Do Now</h1>
              </Grid> :
              null
          }
          {todoListItemsUI}

          {
            watchListItemsUI.length > 0 ?
              <Grid item xs={8}>
                <h1 className={classes.title}>To Watch</h1>
              </Grid> :
              null
          }
          {watchListItemsUI}

          {
            laterListItemsUI.length > 0 ?
              <Grid item xs={8}>
                <h1 className={classes.title}>To-Do Later</h1>
              </Grid> :
              null
          }
          {laterListItemsUI}

        </Grid>
      );
    } else {
      return getEmptyUI();
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