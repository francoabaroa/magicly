import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import { LIST_TYPE, QUESTION_STATUS } from '../../constants/appStrings';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AddCircle from '@material-ui/icons/AddCircle';
import Visibility from '@material-ui/icons/Visibility';

const QUERY = gql`
  query GetSummaryItems (
    $listType: ListType!,
    $listTypes: [ListType]
    $cursor: String,
    $limit: Int,
    $questionStatus: [QuestionStatus]
  ) {
    listItems(
      listType: $listType,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        name
        type
        executionDate
        complete
        notes
        list {
          id
          name
          type
        }
      }
      pageInfo {
        endCursor
      }
    }
    shoppingListItems(
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        name
        type
        executionDate
        complete
        notes
        list {
          id
          name
          type
        }
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
    questions(
      questionStatus: $questionStatus,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        body
        type
        urgent
        status
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
    pageHeading: {
      fontFamily: 'Playfair Display, serif',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      lineHeight: '64px',
      letterSpacing: '0em',
      textAlign: 'center',
      marginBottom: '0px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '28px',
      },
    },
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: "#840032",
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #E59500',
      marginBottom: '50px',
      maxWidth: '800px'
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
      fontSize: '24px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    icon: {
      color: '#FFF',
      fontSize: '18px',
    },
    recent: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '18px',
    }
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
        questionStatus: [
          QUESTION_STATUS.PENDING,
          QUESTION_STATUS.SOLVED,
          QUESTION_STATUS.UNSOLVED,
          QUESTION_STATUS.CANCELLED,
          QUESTION_STATUS.ANSWERED,
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

  const getRecentRecommendationItemPreview = () => {
    let recommendationItem = [];
    for (let element of data.listItems.edges) {
      recommendationItem.push(
        <Link key={5} href="productivity/recommendations/view/[id]" as={`productivity/recommendations/view/${element.id}`}>
          <div>- {element.name}</div>
        </Link>
      );
      break;
    }
    return recommendationItem;
  };

  const getRecentShoppingListItemPreview = () => {
    let shoppingListItem = [];
    for (let element of data.shoppingListItems.edges) {
      shoppingListItem.push(
        <Link key={5} href="productivity/shopping/view/[id]" as={`productivity/shopping/view/${element.id}`}>
          <div>- {element.name}</div>
        </Link>
      );
      break;
    }
    return shoppingListItem;
  };

  const getRecentQuestionPreview = () => {
    let questionsPreview = [];
    for (let element of data.questions.edges) {
      questionsPreview.push(
        <Link key={6} href="productivity/help/view/[id]" as={`productivity/help/view/${element.id}`}>
          <div>- {element.body}</div>
        </Link>
      );
      break;
    }
    return questionsPreview;
  };

  const containsTodoListItems = () => {
    if (data && data.lists && data.lists.edges && data.lists.edges.length > 0) {
      if (
        data.lists.edges[0].listItems.length > 0 ||
        data.lists.edges[1].listItems.length > 0 ||
        data.lists.edges[2].listItems.length > 0
      ) {
        return true;
      }
    }
    return false;
  }

  const getRecentToDoListItemPreview = () => {
    // TODO: should only show ones with upcoming due date
    let todoListItemPreview = [];
    for (let i = 0; i < 3; i++) {
      if (data.lists.edges[i].listItems.length > 0) {
        let item = data.lists.edges[i].listItems[0];
        todoListItemPreview.push(
          <Link key={item.id} href="productivity/lists/view/[id]" as={`productivity/lists/view/${item.id}`}>
            <div>- {item.name}</div>
          </Link>
        );
        break;
      }
    }

    return todoListItemPreview;
  };

  const getRecommendationsSection = () => {
    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      let recommendationItemPreview = getRecentRecommendationItemPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/recommendations')}>
            Recommendations
            </h2>
          <hr />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          <div className={classes.recent}>Most Recent: </div>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          { recommendationItemPreview }
          </Grid>

          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations')}>
                <Visibility fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>view all</span>
              </div>
            </Grid>
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations/add')}>
                <AddCircle fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>add</span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/recommendations')}>
            Recommendations
            </h2>
          <hr />
          <h3 className={classes.description}>
            Save TV series, movies, books, restaurants or any other recommendation you get
            </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/recommendations/add')}>
            <AddCircle fontSize={'large'} className={classes.icon} />
            <span className={classes.details}>add</span>
          </div>
        </Grid>
      );
    }
  };

  const getShoppingSection = () => {
    if (data && data.shoppingListItems && data.shoppingListItems.edges && data.shoppingListItems.edges.length > 0) {
      let shoppingListItemsPreview = getRecentShoppingListItemPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/shopping')}>
              Shopping
            </h2>
            <hr />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
            <div className={classes.recent}>Most Recent: </div>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
            {shoppingListItemsPreview}
          </Grid>

          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping')}>
                <Visibility fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>view all</span>
              </div>
            </Grid>
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/add')}>
                <AddCircle fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>add</span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/shopping')}>
            Shopping
            </h2>
          <hr />
          <h3 className={classes.description}>
            Create grocery, gift or any shopping list you need
            </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/add')}>
            <AddCircle fontSize={'large'} className={classes.icon} />
            <span className={classes.details}>add</span>
          </div>
        </Grid>
      );
    }
  };

  const getTodoListSection = () => {
    if (containsTodoListItems()) {
      let todoListItemPreview = getRecentToDoListItemPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/lists')}>
            To-Do Lists
            </h2>
          <hr />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
            <div className={classes.recent}>Most Recent: </div>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          {todoListItemPreview}
          </Grid>

          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists')}>
                <Visibility fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>view all</span>
              </div>
            </Grid>
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
                <AddCircle fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>add</span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} className={classes.paper}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/lists')}>
            To-Do Lists
            </h2>
          <hr />
          <h3 className={classes.description}>
            Stay productive and organized with your tasks
            </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/lists/add')}>
            <AddCircle fontSize={'large'} className={classes.icon} />
            <span className={classes.details}>add</span>
          </div>
        </Grid>
      );
    }
  };

  const getTechHelpSection = () => {
    let questionPreview = getRecentQuestionPreview();
    if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} style={{ marginBottom: '50px' }} className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/help')}>
            Ask a Tech Question
            </h2>
          <hr />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          <div className={classes.recent}>Most Recent: </div>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} xl={12}>
          {questionPreview}
          </Grid>

          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help')}>
                <Visibility fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>view all</span>
              </div>
            </Grid>
            <Grid item xs={12} lg={6} md={6} sm={6}>
              <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/add')}>
                <AddCircle fontSize={'large'} className={classes.icon} />
                <span className={classes.details}>ask</span>
              </div>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} style={{ marginBottom: '50px' }} className={classes.paper}>
          <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/help')}>
            Ask a Tech Question
            </h2>
          <hr />
          <h3 className={classes.description}>
            Answer questions, concerns or doubts you might have about technology
            </h3>
          <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/add')}>
            <AddCircle fontSize={'large'} className={classes.icon} />
            <span className={classes.details}>ask a tech question</span>
          </div>
        </Grid>
      );
    }
  };

  return (
    <Layout>
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{textAlign: 'center'}}>
          <h2 className={classes.pageHeading}></h2>
        </Grid>
        { getTodoListSection() }
        { getRecommendationsSection() }
        {/* { getShoppingSection() } */}
        { getTechHelpSection() }
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ProductivityPage);