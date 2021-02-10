import Link from 'next/link';
import AppBar from './AppBar';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumbs: {
      marginTop: '10px',
      marginLeft: '10px',
      fontFamily: 'Overpass, serif',
      color: 'rgba(0, 38, 66, 0.5)'
    },
    breadcrumbTypography: {
      fontFamily: 'Overpass, serif',
      color: 'rgba(0, 38, 66, 0.5)'
    },
    breadLink: {
      color: 'rgba(0, 38, 66, 0.8)',
      "&:visited": {
        textDecoration: 'none',
        color: 'rgba(0, 38, 66, 0.8)'
      }
    }
  }),
);

const Layout = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);
  let signedInUser = null;

  if (data && data.me) {
    signedInUser = data.me;
  } else if (router && router.query && router.query.me && typeof router.query.me === 'string') {
    signedInUser = JSON.parse(router.query.me);
  } else {
    signedInUser = null;
  }

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const shouldShowBreadcrumbs = () => {
    let homeRoute = '/home';
    let productivityRoute = '/productivity';
    let financeRoute = '/finance';
    let findRoute = '/find';

    if (router.route.includes(homeRoute) && router.route !== homeRoute) {
      return true;
    }

    if (router.route.includes(productivityRoute) && router.route !== productivityRoute) {
      return true;
    }

    if (router.route.includes(financeRoute) && router.route !== financeRoute) {
      return true;
    }

    if (router.route.includes(findRoute) && router.route !== findRoute) {
      return true;
    }

    return false;
  };

  const getBreadcrumbs = () => {
    let fullRoute = '';
    let individualRoutes = router.route.split('/');
    let breadcrumbChildren = [];
    let nextIdRoute = '[id]';

    if (individualRoutes[individualRoutes.length - 1] === nextIdRoute) {
      individualRoutes.pop();
    }

    if (shouldShowBreadcrumbs()) {
      individualRoutes.shift();
      individualRoutes.forEach((route, index, routes) => {
        fullRoute += '/' + route;

        if (index === routes.length - 1) {
          breadcrumbChildren.push(
            <Typography color="textPrimary" key={index} className={classes.breadcrumbTypography}>
              { getCapitalizedString(route) }
            </Typography>
          );
        } else {
          breadcrumbChildren.push(
            <Link href={fullRoute} key={index}>
              <a className={classes.breadLink}>
                { getCapitalizedString(route) }
              </a>
            </Link>
          );
        }
      });

      return (
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          { breadcrumbChildren }
        </Breadcrumbs>
      );
    }

    return null;

  };

  return (
    <div>
      <AppBar signedInUser={signedInUser} />
      { getBreadcrumbs() }
      {props.children}
    </div>
  )
};

export default Layout;