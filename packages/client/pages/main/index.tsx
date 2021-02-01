import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import MagiclyLoading from '../../components/shared/MagiclyLoading';
import MagiclyError from '../../components/shared/MagiclyError';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import { LIST_TYPE, QUESTION_STATUS } from '../../constants/appStrings';
import Cookies from 'js-cookie';
import { withStyles, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const QUERY = gql`
  query GetMe (
    $cursor: String,
    $limit: Int,
    $excludePast: Boolean,
    $excludeComplete: Boolean,
    $listType: ListType!,
    $questionStatus: [QuestionStatus],
  ) {
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
    me {
      id
      firstName
      lastName
      email
    }
    homeworks(
      cursor: $cursor,
      limit: $limit,
      excludePast: $excludePast,
    ) {
      edges {
        id
        title
        type
        status
        executionDate
      }
    }
    listItems(
      listType: $listType,
      excludeComplete: $excludeComplete,
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
  }
`;

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#FFF',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 420,
    fontSize: theme.typography.pxToRem(18),
    border: '1px solid #002642',
    borderRadius: '5px',
  },
}))(Tooltip);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '20px',
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#002642',
      marginTop: '15px',
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '22px',
        marginTop: '35px',
        marginBottom: '5px',
      },
    },
    previewTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '22px',
      color: '#002642',
      margin: 'auto',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    mainGrid: {
      padding: '10px'
    },
    paper: {
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: '#840032',
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #E59500',
      padding: '10px'
    },
    appSection: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '32px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '20px',
      },
    },
    mainPage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '55px',
    },
    findButton: {
      fontFamily: 'Overpass, serif',
      fontSize: '22px',
      margin: '0 auto',
      display: 'block',
      marginTop: '40px',
      color: '#840032',
      backgroundColor: '#FFF',
      border: '3px #840032 solid',
      boxShadow: '5px 5px #840032, 4px 4px #840032, 3px 3px #840032',
      borderRadius: '50px',
      width: '360px',
      height: '60px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        width: '300px',
        height: '40px'
      },
    },
    viewBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '18px',
      margin: '0 auto',
      marginLeft: '10px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '50px',
      height: '35px',
      [theme.breakpoints.down('md')]: {
        marginTop: '10px',
        fontSize: '16px',
        width: '40px',
        height: '30px'
      },
    },
    priorityRow: {
      textAlign: 'left',
      maxWidth: '980px',
      marginBottom: '10px',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center'
      },
    },
  }),
);

const MainPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      listType: LIST_TYPE.TODO,
      excludePast: true,
      excludeComplete: true,
      questionStatus: [
        QUESTION_STATUS.SOLVED,
        QUESTION_STATUS.UNSOLVED,
        QUESTION_STATUS.CANCELLED,
        QUESTION_STATUS.ANSWERED,
      ],
    }
  });

  if (loading) return <MagiclyLoading open={true}/>;

  if (error) return <MagiclyError message={error.message} />;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const getQueryStringValue = (key) => {
    return decodeURIComponent(
      window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")
    );
  };

  const getGreeting = (me: any, isNewUser: boolean) => {
    let hasPriorities = false;

    if (data && data.homeworks && data.homeworks.edges && data.homeworks.edges.length > 0) {
      hasPriorities = true;
    }

    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      hasPriorities = true;
    }

    if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
      hasPriorities = true;
    }

    if (me && me.firstName && me.firstName.length > 0) {
      if (isNewUser || !hasPriorities) {
        return 'Welcome ' + getCapitalizedString(me.firstName);
      }

      return 'Hi ' + getCapitalizedString(me.firstName) + ' ';
    }
    if (me && me.email && me.email.length > 0) {
      return ', ' + getCapitalizedString(me.email.split('@')[0]);
    }
    return '!';
  };

  const getListItemPriorities = (isSingleListItem) => {
    if(data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      let itemOrItems = data.listItems.edges.length <= 1 ? 'item' : 'items';
      let listsLink = `productivity/lists`;
      if (itemOrItems === 'item') {
        listsLink = `productivity/lists/view/${data.listItems.edges[0].id}`;
      }
      let name = data.listItems.edges[0].name;

      return (
        <Grid container  justify="center" alignContent="center" alignItems="center" className={classes.priorityRow}>
          <Grid item key={0} xs={12} md={4} lg={4} sm={4}>
            <h5
              className={classes.previewTitle}>
              {'* ' + data.listItems.edges.length +
                ` upcoming to-do list ${itemOrItems}`}
            </h5>
          </Grid>
          <Grid item key={1} xs={12} md={1} lg={1} sm={1}>
            {
              isSingleListItem ?
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">
                        {name}
                      </Typography>
                    </React.Fragment>
                  }
                >
                  <Button
                    className={classes.viewBtn}
                    onClick={routePage.bind(this, listsLink)}>
                    View
                </Button>
                </HtmlTooltip> :
                <Button
                  className={classes.viewBtn}
                  onClick={routePage.bind(this, listsLink)}>
                  View
                </Button>
            }
          </Grid>
        </Grid>
      );
    }
  };

  const getHomeWorkPriorities = (isSingleHomeWorkItem) => {
    if (data && data.homeworks && data.homeworks.edges && data.homeworks.edges.length > 0) {
      let eventOrEvents = data.homeworks.edges.length <= 1 ? 'event' : 'events';
      let homeWorkpageLink = `home/work`;
      if (eventOrEvents === 'event') {
        homeWorkpageLink = `home/work/view/${data.homeworks.edges[0].id}`;
      }
      let title = data.homeworks.edges[0].title;
      return (
        <Grid container  justify="center" alignContent="center" alignItems="center" className={classes.priorityRow}>
          <Grid item key={0} xs={12} md={4} lg={4} sm={4}>
            <h5
              className={classes.previewTitle}>
              {'* ' + data.homeworks.edges.length +
                ` upcoming home work ${eventOrEvents}`}
            </h5>
          </Grid>
          <Grid item key={1} xs={12} md={1} lg={1} sm={1}>
            {
              isSingleHomeWorkItem ?
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">{title}</Typography>
                    </React.Fragment>
                  }
                >
                  <Button
                    className={classes.viewBtn}
                    onClick={routePage.bind(this, homeWorkpageLink)}>
                    View
              </Button>
                </HtmlTooltip> :
                <Button
                  className={classes.viewBtn}
                  onClick={routePage.bind(this, homeWorkpageLink)}>
                  View
              </Button>
            }
          </Grid>
        </Grid>
      );
    }
  };

  const getTechQuestionReply = (isSingleQuestion) => {
    if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
      let shouldAddLink = data.questions.edges.length <= 1 ? true : false;
      let homeWorkpageLink = `productivity/help`;

      if (shouldAddLink) {
        homeWorkpageLink = `productivity/help/view/${data.questions.edges[0].id}`;
      }

      let body = data.questions.edges[0].body;

      return (
        <Grid container  justify="center" alignContent="center" alignItems="center" className={classes.priorityRow}>
          <Grid item key={0} xs={12} md={4} lg={4} sm={4}>
            <h5
              className={classes.previewTitle}>
              {'* ' + data.questions.edges.length +
                ` answered tech question`}
            </h5>
          </Grid>
          <Grid item key={1} xs={12} md={1} lg={1} sm={1}>
            {
              isSingleQuestion ?
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">{body}</Typography>
                    </React.Fragment>
                  }
                >
                  <Button
                    className={classes.viewBtn}
                    onClick={routePage.bind(this, homeWorkpageLink)}>
                    View
              </Button>
                </HtmlTooltip> :
                <Button
                  className={classes.viewBtn}
                  onClick={routePage.bind(this, homeWorkpageLink)}>
                  View
              </Button>
            }
          </Grid>
        </Grid>
      );
    }
  };

  const getPriorities = () => {
    let priorities = [];
    let isSingleHomeWorkItem = false;
    let isSingleListItem = false;
    let isSingleQuestion = false;

    if (data && data.homeworks && data.homeworks.edges && data.homeworks.edges.length > 0) {
      isSingleHomeWorkItem = data.homeworks.edges.length <= 1 ? true : false;
      priorities.push(
        getHomeWorkPriorities(isSingleHomeWorkItem)
      );
    }

    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      isSingleListItem = data.listItems.edges.length <= 1 ? true : false;
      priorities.push(
        getListItemPriorities(isSingleListItem)
      );
    }

    if (data && data.questions && data.questions.edges && data.questions.edges.length > 0) {
      isSingleQuestion = data.questions.edges.length <= 1 ? true : false;
      priorities.push(
        getTechQuestionReply(isSingleQuestion)
      );
    }

    return priorities;
  };

  const isNewUser = getQueryStringValue("new") === 'true';
  return (
    <Layout>
      <div className={classes.mainPage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={getGreeting(data.me, isNewUser)}
            />
          </Grid>

          {
            isNewUser ?
            null :
            getPriorities()
          }
        </Grid>
        <Grid container className={classes.root}>
          <Grid item xs={12} lg={4} md={4} sm={4} className={classes.mainGrid}>
            <Paper className={classes.paper} onClick={routePage.bind(this, 'home')}>
              <h2 className={classes.appSection}>
                My Home
            </h2>
            {
                isNewUser ?
                <h3 style={{ fontWeight: 'normal' }}>
                  Important information pertaining to your home
                </h3> :
                null
            }
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={4} className={classes.mainGrid}>
            <Paper className={classes.paper} onClick={routePage.bind(this, 'productivity')}>
              <h2 className={classes.appSection}>
                My Productivity
            </h2>
              {
                isNewUser ?
                  <h3 style={{ fontWeight: 'normal' }}>
                    Increase your productivity in a simple way
                </h3> :
                  null
              }
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={4} className={classes.mainGrid}>
            <Paper className={classes.paper} onClick={routePage.bind(this, 'finance')}>
              <h2 className={classes.appSection}>
                My Finances
            </h2>
              {
                isNewUser ?
                  <h3 style={{ fontWeight: 'normal' }}>
                    Stay on top of your finances easily
                </h3> :
                  null
              }
            </Paper>
          </Grid>
          {/* <Grid item xs={12} lg={12} md={12} sm={12} onClick={routePage.bind(this, 'find')}>
            <Button className={classes.findButton}> Find Products & Services </Button>
          </Grid> */}
        </Grid>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(MainPage);