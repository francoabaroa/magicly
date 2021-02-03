import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import MagiclyLoading from '../../../components/shared/MagiclyLoading';
import MagiclyError from '../../../components/shared/MagiclyError';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import MagiclyAddIconLabel from '../../../components/shared/MagiclyAddIconLabel';
import ListItemRow from '../../../components/productivity/ListItemRow';
import MagiclySearchIconLabel from '../../../components/shared/MagiclySearchIconLabel';
import gql from 'graphql-tag';
import { LIST_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import Stars from '@material-ui/icons/Stars';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Star from '@material-ui/icons/Star';

const QUERY = gql`
  query Lists (
    $listTypes: [ListType]!,
    $cursor: String,
    $limit: Int
  ) {
    lists(
      listTypes: $listTypes,
      cursor: $cursor,
      limit: $limit
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
    emptyMarginTopBlock: {
      marginTop: '50px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px'
      },
    },
    leftText: {
      textAlign: 'left',
    },
    recType: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    horizontalLine: {
      marginTop: '20px',
      maxWidth: '900px',
    },
    toolIcon: {
      color: '#002642',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
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
  }),
);

const ShoppingPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let lists: Array<any> = [];
  let hasSavedShoppingLists: boolean = false;

  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        listTypes: [
          LIST_TYPE.SHOPPING
      ],
      }
    }
  );

  if (loading) return <MagiclyLoading open={true}/>;
  if (error) return <MagiclyError message={error.message} />;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getIndividualLists = (key: any, list: any) => {
    let listItemsNum = 0;
    let itemOrItems = ' items';
    if (list && list.listItems && list.listItems.length > 0) {
      listItemsNum = list.listItems.length;
    }

    if (listItemsNum === 1) {
      itemOrItems = ' item';
    }

    return (
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.leftText}>
        <Grid item xs={1} lg={1} md={1} sm={1} style={{ maxWidth: '40px' }}>
          <ShoppingCart fontSize={'large'} className={classes.toolIcon} />
        </Grid>
        <Grid item xs={11} lg={6} md={6} sm={11}>
          <Link href="shopping/view/[id]" as={`shopping/view/${list.id}`}>
            <span className={classes.link}>{list.name}</span>
          </Link>
        </Grid>
        <Grid item xs={1} lg={1} md={1} sm={1} className={classes.recType}>
          <span className={classes.type}>{listItemsNum + itemOrItems}</span>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <hr className={classes.horizontalLine} />
        </Grid>
      </Grid>
    );
  };

  if (data && data.lists && data.lists.edges && data.lists.edges.length > 0) {
    hasSavedShoppingLists = true;
    data.lists.edges.forEach((listItem, key) => {
      lists.push(
        getIndividualLists(
          key,
          listItem
        )
      );
    });
  }

  const getEmptyUI = () => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }} onClick={routePage.bind(this, 'productivity/shopping/add')}>
          <ShoppingCart fontSize={'large'} className={classes.hugeIcon} />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <span className={classes.tap}>click the shopping cart icon to start creating shopping lists</span>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center', marginTop: '90px', marginBottom: '10px' }}>
          <span className={classes.someExamples}>some examples for inspiration</span>
        </Grid>
        <Grid container justify="center" alignContent="center" alignItems="center" className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- weekly groceries list</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- baby shower supplies list</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- christmas gift shopping list</span>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getMainUI = () => {
    if (hasSavedShoppingLists) {
      return (
        <Grid container justify="center" alignContent="center" alignItems="center">

          <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/add')}>
              <MagiclyAddIconLabel />
            </div>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/search')}>
              <MagiclySearchIconLabel />
            </div>
          </Grid>


          <Grid item xs={8}>
            <MagiclyPageTitle
              title={'Shopping Lists'}
            />
          </Grid>

          {lists}
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

export default withApollo({ ssr: false })(ShoppingPage);