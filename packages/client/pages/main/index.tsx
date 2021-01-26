import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../apollo/apollo';
import { LIST_TYPE } from '../../constants/appStrings';
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
    $listType: ListType!,
  ) {
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
        fontSize: '18px',
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
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
    },
    paper: {
      padding: theme.spacing(1),
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      color: '#FFF',
      backgroundColor: '#840032',
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #E59500',
    },
    appSection: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '32px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
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
      fontSize: '14px',
      margin: '0 auto',
      marginLeft: '10px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '40px',
      height: '25px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '40px',
        height: '25px'
      },
    }
  }),
);

const MainPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      listType: LIST_TYPE.TODO,
      excludePast: true
    }
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;
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
    let hasPriorities = true;
    if (data && data.homeworks && data.homeworks.edges && data.homeworks.edges.length === 0) {
      hasPriorities = false;
    }

    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length === 0) {
      hasPriorities = false;
    }

    if (me && me.firstName && me.firstName.length > 0) {
      if (isNewUser || !hasPriorities) {
        return 'Welcome, ' + getCapitalizedString(me.firstName);
      }

      let yourPriorities = 'here are your priorities: ';
      return 'Hi ' + getCapitalizedString(me.firstName) + ', ' + yourPriorities
    }
    if (me && me.email && me.email.length > 0) {
      return ', ' + getCapitalizedString(me.email.split('@')[0]);
    }
    return '!';
  };

  const getPriorities = () => {
    let priorities = [];
    let isSingleHomeWorkItem = false;
    let isSingleListItem = false;
    if (data && data.homeworks && data.homeworks.edges && data.homeworks.edges.length > 0) {
      let eventOrEvents = data.homeworks.edges.length <=1 ? 'event' : 'events';
      let homeWorkpageLink = `home/work`;
      if (eventOrEvents === 'event') {
        isSingleHomeWorkItem = true;
        homeWorkpageLink = `home/work/view/${data.homeworks.edges[0].id}`;
      }
      let title = data.homeworks.edges[0].title;
      priorities.push(
        <Grid item key={0} xs={8}>
          <h5
            className={classes.previewTitle}>
              {'* ' + data.homeworks.edges.length +
              ` upcoming home work ${eventOrEvents}`}
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
          </h5>
        </Grid>
      );
    }

    if (data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0) {
      let itemOrItems = data.listItems.edges.length <= 1 ? 'item' : 'items';
      let listsLink = `productivity/lists`;
      if (itemOrItems === 'item') {
        isSingleListItem = true;
        listsLink = `productivity/lists/view/${data.listItems.edges[0].id}`;
      }
      let name = data.listItems.edges[0].name;
      priorities.push(
        <Grid item key={1} xs={8}>
          <h5
            className={classes.previewTitle}>
            {'* ' + data.listItems.edges.length +
            ` upcoming to-do list ${itemOrItems}`}
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

        </h5>
        </Grid>
      );
    }

    return priorities;
  };

  const isNewUser = getQueryStringValue("new") === 'true';
  return (
    <Layout>
      <div className={classes.mainPage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h5 className={classes.title}>{getGreeting(data.me, isNewUser)}</h5>
          </Grid>
          {
            isNewUser ?
            null :
            getPriorities()
          }
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} md={4} sm={4}>
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
            <Grid item xs={12} lg={4} md={4} sm={4}>
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
            <Grid item xs={12} lg={4} md={4} sm={4}>
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
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(MainPage);