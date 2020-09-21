import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import Cookies from 'js-cookie';
import Button from '@material-ui/core/Button';
import { LIST_TYPE } from '../../constants/appStrings';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AddCircle from '@material-ui/icons/AddCircle';
import Visibility from '@material-ui/icons/Visibility';

const QUERY = gql`
  query GetSummaryItems (
    $listType: ListType!,
    $listTypes: [ListType]
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
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px',
    },
    sectionTitle: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '28px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '20px',
      },
    },
    description: {
      fontWeight: 'normal'
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '5px',
    },
    details: {
      color: '#FFF',
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
    icon: {
      color: '#FFF',
      fontSize: '12px',
    },
  }),
);

const ProductivityPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        listType: LIST_TYPE.RECOMMENDATION,
        listTypes: [
          LIST_TYPE.TODO,
          LIST_TYPE.WATCH,
          LIST_TYPE.LATER,
        ],
        limit: 3,
      }
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getRecommendationItemsPreview = () => {
    let recommendationItems = [];
    data.listItems.edges.forEach((recommendation, key) => {
      recommendationItems.push(
        <Link key={key} href="productivity/recommendations/view/[id]" as={`productivity/recommendations/view/${recommendation.id}`}>
          <div>- {recommendation.name}</div>
        </Link>
      );
    });
    return recommendationItems;
  };

  const getTodoListItemsPreview = () => {
    let todoListItemsPreview = [];
    if (data.lists.edges[0].listItems.length > 0) {
      let item = data.lists.edges[1].listItems[0];
      todoListItemsPreview.push(
        <Link key={item.id} href="productivity/lists/view/[id]" as={`productivity/lists/view/${item.id}`}>
          <div>- {item.name}</div>
        </Link>
      );
    }

    if (data.lists.edges[2].listItems.length > 0) {
      let item = data.lists.edges[1].listItems[0];
      todoListItemsPreview.push(
        <Link key={item.id} href="productivity/lists/view/[id]" as={`productivity/lists/view/${item.id}`}>
          <div>- {item.name}</div>
        </Link>
      );
    }

    if (data.lists.edges[1].listItems.length > 0) {
      let item = data.lists.edges[1].listItems[0];
      todoListItemsPreview.push(
        <Link key={item.id} href="productivity/lists/view/[id]" as={`productivity/lists/view/${item.id}`}>
          <div>- {item.name}</div>
        </Link>
      );
    }

    return todoListItemsPreview;
  };

  const getRecommendationsSection = () => {
    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      let recommendationItems = getRecommendationItemsPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              Recommendations
              </h2>
            <div>Recent Recommendations: </div>
            { recommendationItems }
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations')}>
              <Visibility fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>view all recommendation</span>
            </span>
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add a recommendation</span>
            </span>
          </Paper>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              Recommendations
              </h2>
            <h3 className={classes.description}>
              Save TV series, movies, books, travels, food or any recommendation you get
              </h3>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add a recommendation</span>
            </div>
          </Paper>
        </Grid>
      );
    }
  };

  const getTodoListSection = () => {
    if (data && data.lists && data.lists.edges && data.lists.edges.length > 0) {
      let todoListItems = getTodoListItemsPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              To-Do Lists
              </h2>
              <div>Recent To-Do Items: </div>
            {todoListItems}
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists')}>
              <Visibility fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>view all to-do items</span>
            </span>
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add to-do item</span>
            </span>
          </Paper>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle}>
              To-Do Lists
              </h2>
            <h3 className={classes.description}>
              Stay productive and organized with your tasks
              </h3>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add to-do item</span>
            </div>
          </Paper>
        </Grid>
      );
    }
  };

  const getTechHelpSection = () => {
    return (
      <Grid item xs={7} lg={7} md={7} sm={7}>
        <Paper className={classes.paper}>
          <h2 className={classes.sectionTitle}>
            Ask a Tech Question
              </h2>
          <h3 className={classes.description}>
            Answer questions, concerns or doubts you might have about technology
              </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/add')}>
            <AddCircle fontSize={'small'} className={classes.icon} />
            <span className={classes.details}>ask a tech question</span>
          </div>
        </Paper>
      </Grid>
    );
  };

  return (
    <Layout>
      <h3 style={{ color: 'white' }}>Productivity Page</h3>
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
        { getTodoListSection() }
        { getRecommendationsSection() }
        { getTechHelpSection() }
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ProductivityPage);