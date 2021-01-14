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
import Paper from '@material-ui/core/Paper';
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
      marginBottom: '10px',
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
        questionStatus: [
          QUESTION_STATUS.PENDING,
          QUESTION_STATUS.SOLVED,
          QUESTION_STATUS.UNSOLVED,
          QUESTION_STATUS.CANCELLED,
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

  const getQuestionsPreview = () => {
    let questions = [];
    data.questions.edges.forEach((question, key) => {
      questions.push(
        <Link key={key} href="productivity/help/view/[id]" as={`productivity/help/view/${question.id}`}>
          <div>- {question.body}</div>
        </Link>
      );
    });
    return questions;
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

  const getTodoListItemsPreview = () => {
    // TODO: should only show ones with upcoming due date
    let todoListItemsPreview = [];

    for (let i = 0; i < 3; i++) {
      if (data.lists.edges[i].listItems.length > 0) {
        let item = data.lists.edges[i].listItems[0];
        todoListItemsPreview.push(
          <Link key={item.id} href="productivity/lists/view/[id]" as={`productivity/lists/view/${item.id}`}>
            <div>- {item.name}</div>
          </Link>
        );
      }
    }

    return todoListItemsPreview;
  };

  const getRecommendationsSection = () => {
    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      let recommendationItems = getRecommendationItemsPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/recommendations')}>
              My Recommendations
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
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/recommendations')}>
              My Recommendations
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
    if (containsTodoListItems()) {
      let todoListItems = getTodoListItemsPreview();
      return (
        <Grid item xs={7} lg={7} md={7} sm={7}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/lists')}>
              My To-Do Lists
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
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/lists')}>
              My To-Do Lists
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
    let questions = getQuestionsPreview();

    if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} style={{ marginBottom: '50px' }}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/help')}>
              Ask a Tech Question
              </h2>
            <div>Recent Questions: </div>
            {questions}
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help')}>
              <Visibility fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>view all questions</span>
            </span>
            <span className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/help/add')}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>ask a tech question</span>
            </span>
          </Paper>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={7} lg={7} md={7} sm={7} style={{ marginBottom: '50px' }}>
          <Paper className={classes.paper}>
            <h2 className={classes.sectionTitle} onClick={routePage.bind(this, 'productivity/help')}>
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
    }
  };

  return (
    <Layout>
      <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{textAlign: 'center'}}>
          <h2 className={classes.pageHeading}>My Productivity</h2>
        </Grid>
        { getTodoListSection() }
        { getRecommendationsSection() }
        { getTechHelpSection() }
      </Grid>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ProductivityPage);