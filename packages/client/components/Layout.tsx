import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import clsx from 'clsx';

/* CORE UI */
import {
  Box,
  Badge,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

/* ICONS */
import Home from '@material-ui/icons/Home';
import Dashboard from '@material-ui/icons/Dashboard';
import QueryBuilder from '@material-ui/icons/QueryBuilder';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Settings from '@material-ui/icons/Settings';
import ContactSupport from '@material-ui/icons/ContactSupport';
import ExitToApp from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CreateIcon from '@material-ui/icons/Create';
import BookIcon from '@material-ui/icons/Book';
import InputIcon from '@material-ui/icons/Input';
import { APP_CONFIG } from '../constants/appStrings';

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

const drawerWidth = 240;

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
    },
    root: {
      display: 'flex',
      backgroundColor: '#f3f6f8'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  }),
);

const Layout = (props) => {
  const router = useRouter();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(QUERY);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const [state, setState] = React.useState({ left: false });
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

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const signOut = () => {
    handleMenuClose();
    // TODO: clean up before prod
    let url = null;
    if (process.env.NODE_ENV === 'development') {
      url = APP_CONFIG.devUrl;
    } else {
      url = APP_CONFIG.prodUrl;
    }

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
    };

    fetch(url + 'signout', options)
      .then(data => {
        if (data && data.status === 200) {
          window.location.replace(url);
        }
      });
  };

  const routePage = (pageName: string) => {
    if (pageName === 'blog' && window) {
      let blogLink = 'https://magicly.medium.com/';
      window.open(blogLink, '_blank');
    } else {
      router.push('/' + pageName, undefined, { shallow: true });
    }
  };

  const getDrawerBody = (anchor, isSignedIn) => {
    if (isSignedIn) {
      return (
        <div
          className={clsx(classes.list)}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            <ListItem button key={'Dashboard'} onClick={routePage.bind(this, 'main')}>
              <ListItemIcon>{<Dashboard />}</ListItemIcon>
              <ListItemText primary={'Dashboard'} />
            </ListItem>
            <ListItem button key={'Home'} onClick={routePage.bind(this, 'home')}>
              <ListItemIcon>{<Home />}</ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItem>
            <ListItem button key={'Productivity'} onClick={routePage.bind(this, 'productivity')}>
              <ListItemIcon>{<QueryBuilder />}</ListItemIcon>
              <ListItemText primary={'Productivity'} />
            </ListItem>
            <ListItem button key={'Finance'} onClick={routePage.bind(this, 'finance')}>
              <ListItemIcon>{<AttachMoney />}</ListItemIcon>
              <ListItemText primary={'Finances'} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key={'Contact Us'} onClick={routePage.bind(this, 'support')}>
              <ListItemIcon>{<ContactSupport />}</ListItemIcon>
              <ListItemText primary={'Contact Us'} />
            </ListItem>
            <ListItem button key={'Settings'} onClick={routePage.bind(this, 'settings')}>
              <ListItemIcon>{<Settings />}</ListItemIcon>
              <ListItemText primary={'Settings'} />
            </ListItem>
            <ListItem button key={'Sign Out'} onClick={signOut}>
              <ListItemIcon>{<ExitToApp />}</ListItemIcon>
              <ListItemText primary={'Sign Out'} />
            </ListItem>
          </List>
        </div>
      );
    }
    return (
      <div
        className={clsx(classes.list)}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          <ListItem button key={'Why Magicly?'} onClick={routePage.bind(this, 'why')}>
            <ListItemIcon>{<BubbleChartIcon />}</ListItemIcon>
            <ListItemText primary={'Why Magicly?'} />
          </ListItem>
          <ListItem button key={'Pricing'} onClick={routePage.bind(this, 'plans')}>
            <ListItemIcon>{<MonetizationOnIcon />}</ListItemIcon>
            <ListItemText primary={'Pricing'} />
          </ListItem>
          <ListItem button key={'Blog'} onClick={routePage.bind(this, 'blog')}>
            <ListItemIcon>{<BookIcon />}</ListItemIcon>
            <ListItemText primary={'Blog'} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key={'Sign Up'} onClick={routePage.bind(this, 'signup')}>
            <ListItemIcon>{<CreateIcon />}</ListItemIcon>
            <ListItemText primary={'Sign Up'} />
          </ListItem>
          <ListItem button key={'Sign In'} onClick={routePage.bind(this, 'signin')}>
            <ListItemIcon>{<VpnKeyIcon />}</ListItemIcon>
            <ListItemText primary={'Sign In'} />
          </ListItem>
          <ListItem button key={'Contact Us'} onClick={routePage.bind(this, 'support')}>
            <ListItemIcon>{<ContactSupport />}</ListItemIcon>
            <ListItemText primary={'Contact Us'} />
          </ListItem>
        </List>
      </div>
    );

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

  const getMobileDrawer = () => {
    let drawerBody = [];
    let isSignedIn = false;
    if (signedInUser && signedInUser.email) {
      isSignedIn = true;
    }
    return (
      <div>
        <React.Fragment key={'left'}>
          <SwipeableDrawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
            onOpen={toggleDrawer('left', true)}
            >
            {getDrawerBody('left', isSignedIn)}
            </SwipeableDrawer>
          </React.Fragment>
      </div>
    );
  };

  const getDrawer = () => {
    if (signedInUser && signedInUser.email) {
      return (
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <Divider />
            <List>
              <ListItem button key={'Dashboard'} onClick={routePage.bind(this, 'main')}>
                <ListItemIcon>{<Dashboard />}</ListItemIcon>
                <ListItemText primary={'Dashboard'} />
              </ListItem>
              <ListItem button key={'Home'} onClick={routePage.bind(this, 'home')}>
                <ListItemIcon>{<Home />}</ListItemIcon>
                <ListItemText primary={'Home'} />
              </ListItem>
              <ListItem button key={'Productivity'} onClick={routePage.bind(this, 'productivity')}>
                <ListItemIcon>{<QueryBuilder />}</ListItemIcon>
                <ListItemText primary={'Productivity'} />
              </ListItem>
              <ListItem button key={'Finance'} onClick={routePage.bind(this, 'finance')}>
                <ListItemIcon>{<AttachMoney />}</ListItemIcon>
                <ListItemText primary={'Finances'} />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button key={'Contact Us'} onClick={routePage.bind(this, 'support')}>
                <ListItemIcon>{<ContactSupport />}</ListItemIcon>
                <ListItemText primary={'Contact Us'} />
              </ListItem>
              <ListItem button key={'Settings'} onClick={routePage.bind(this, 'settings')}>
                <ListItemIcon>{<Settings />}</ListItemIcon>
                <ListItemText primary={'Settings'} />
              </ListItem>
              <ListItem button key={'Sign Out'} onClick={signOut}>
                <ListItemIcon>{<ExitToApp />}</ListItemIcon>
                <ListItemText primary={'Sign Out'} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      );
    } else {
      return (
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <Divider />
            <List>
              <ListItem button key={'Why Magicly?'} onClick={routePage.bind(this, 'why')}>
                <ListItemIcon>{<BubbleChartIcon />}</ListItemIcon>
                <ListItemText primary={'Why Magicly?'} />
              </ListItem>
              <ListItem button key={'Pricing'} onClick={routePage.bind(this, 'plans')}>
                <ListItemIcon>{<MonetizationOnIcon />}</ListItemIcon>
                <ListItemText primary={'Pricing'} />
              </ListItem>
              <ListItem button key={'Blog'} onClick={routePage.bind(this, 'blog')}>
                <ListItemIcon>{<BookIcon />}</ListItemIcon>
                <ListItemText primary={'Blog'} />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button key={'Sign Up'} onClick={routePage.bind(this, 'signup')}>
                <ListItemIcon>{<CreateIcon />}</ListItemIcon>
                <ListItemText primary={'Sign Up'} />
              </ListItem>
              <ListItem button key={'Sign In'} onClick={routePage.bind(this, 'signin')}>
                <ListItemIcon>{<VpnKeyIcon />}</ListItemIcon>
                <ListItemText primary={'Sign In'} />
              </ListItem>
              <ListItem button key={'Contact Us'} onClick={routePage.bind(this, 'support')}>
                <ListItemIcon>{<ContactSupport />}</ListItemIcon>
                <ListItemText primary={'Contact Us'} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      );
    }
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
    <>
      <Hidden lgUp>
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                onClick={routePage.bind(this, '')}
              >
                <Image
                  src="/magicly_logo.svg"
                  alt="Magicly Logo"
                  width={45}
                  height={45}
                />
              </IconButton>
              <Box flexGrow={1} />
              <Hidden lgUp>
                <IconButton
                  color="inherit"
                  onClick={toggleDrawer('left', true)}
                >
                  <MenuIcon />
                </IconButton>
              </Hidden>
            </Toolbar>
          </AppBar>
          { getMobileDrawer() }
          <main className={classes.content}>
            <Toolbar />
            {getBreadcrumbs()}
            {props.children}
          </main>
        </div>
      </Hidden>
      <Hidden mdDown>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
                onClick={routePage.bind(this, '')}
              >
                <Image
                  src="/magicly_logo.svg"
                  alt="Magicly Logo"
                  width={45}
                  height={45}
                />
              </IconButton>
              <Box flexGrow={1} />
              {
                signedInUser && signedInUser.email ?
                  <Hidden mdDown>
                    <IconButton color="inherit">
                      <Badge
                        badgeContent={0}
                        color="primary"
                        variant="dot"
                      >
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={signOut}>
                      <InputIcon />
                    </IconButton>
                  </Hidden> : null
              }
            </Toolbar>
          </AppBar>
         { getDrawer() }
          <main className={classes.content}>
            <Toolbar />
            {props.children}
          </main>
        </div>
      </Hidden>
    </>
  )

  // return (
  //   <div>
  //     <MagiclyAppBar signedInUser={signedInUser} />
  //     { getBreadcrumbs() }
  //     {props.children}
  //   </div>
  // )
};

export default Layout;