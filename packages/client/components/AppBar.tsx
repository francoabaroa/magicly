import React from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AttachMoney from '@material-ui/icons/AttachMoney';
import DoubleArrow from '@material-ui/icons/DoubleArrow';
import ContactSupport from '@material-ui/icons/ContactSupport';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Settings from '@material-ui/icons/Settings';
import Book from '@material-ui/icons/Book';
import ArrowDropDownCircle from '@material-ui/icons/ArrowDropDownCircle';
import { useRouter } from 'next/router';

import { APP_CONFIG } from '../constants/appStrings';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    signUpButton: {
      fontFamily: 'Overpass',
      margin: '9px',
      color: '#FFF',
      backgroundColor: '#840032',
      borderRadius: '50px',
    },
    signInButton: {
      fontFamily: 'Overpass',
      margin: '9px',
      color: '#840032',
      backgroundColor: '#FFF',
      borderRadius: '50px',
      border: '3px solid #840032'
    },
    accountCircle: {
      color: '#840032',
    },
    arrowDropDownCircle: {
      color: '#840032'
    },
    appbar: {
      backgroundColor: '#FFF'
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      color: '#840032',
      fontFamily: 'Overpass',
      fontSize: '34px',
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    titleMobile: {
      color: '#840032',
      fontFamily: 'Overpass',
      fontSize: '24px',
      display: 'none',
      [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
      },
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    why: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
      color: '#840032',
      display: 'none',
      padding: '9px',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    mainPages: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      color: '#840032',
      display: 'none',
      padding: '9px',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    pages: {
      fontFamily: 'Playfair Display, serif',
      color: '#002642',
      display: 'none',
      padding: '9px',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    userEmail: {
      pointerEvents: 'none',
    }
  }),
);

// TODO: define typed props object for all pages/components using
export default function PrimarySearchAppBar(props) {
  const router = useRouter();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
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

  const renderMobileMenu = (signedInUser: any) => {
    if (signedInUser && signedInUser.email) {
      return (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          style={{ color: 'black' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          {props.signedInUser && props.signedInUser.email ?
            <MenuItem className={classes.userEmail}>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
              <p>{props.signedInUser.email}</p>
            </MenuItem> :
            null
          }
          <MenuItem onClick={routePage.bind(this, 'settings')}>
            <IconButton color="inherit">
              <Settings />
            </IconButton>
            <p>Settings</p>
          </MenuItem>
          <MenuItem onClick={routePage.bind(this, 'support')}>
            <IconButton color="inherit">
              <ContactSupport />
            </IconButton>
            <p>Contact Us</p>
          </MenuItem>
          <MenuItem onClick={signOut}>
            <IconButton color="inherit">
              <ExitToApp />
            </IconButton>
            <p>Sign Out</p>
          </MenuItem>
        </Menu>
      );
    } else {
      return (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={routePage.bind(this, 'why')}>
            <IconButton color="inherit">
              <DoubleArrow />
            </IconButton>
            <p>Why Magicly?</p>
          </MenuItem>
          <MenuItem onClick={routePage.bind(this, 'plans')}>
            <IconButton color="inherit">
              <AttachMoney />
            </IconButton>
            <p>Pricing</p>
          </MenuItem>
          <MenuItem onClick={routePage.bind(this, 'blog')}>
            <IconButton color="inherit">
              <Book />
            </IconButton>
            <p>Blog</p>
          </MenuItem>
          <MenuItem onClick={routePage.bind(this, 'support')}>
            <IconButton color="inherit">
              <ContactSupport />
            </IconButton>
            <p>Contact Us</p>
          </MenuItem>
          <MenuItem onClick={routePage.bind(this, 'signin')}>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            <p>Sign In</p>
          </MenuItem>
        </Menu>
      );
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {props.signedInUser && props.signedInUser.email ?
        <MenuItem className={classes.userEmail}>{props.signedInUser.email}</MenuItem> :
        null
      }
      <MenuItem onClick={routePage.bind(this, 'settings')}>Settings</MenuItem>
      <MenuItem onClick={signOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} onClick={routePage.bind(this, '')} variant="h6" noWrap>
            { APP_CONFIG.appName }
          </Typography>
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div> */}
          <div className={classes.sectionMobile}>
            <Typography className={classes.titleMobile} onClick={routePage.bind(this, '')}>
              {APP_CONFIG.appName}
            </Typography>
          </div>
          <div className={classes.grow} />
            {
              props.signedInUser && props.signedInUser.id && props.signedInUser.id !== null ?
                <div className={classes.sectionDesktop}>
                <Typography className={classes.mainPages} onClick={routePage.bind(this, 'home')} variant="h6" noWrap>
                  My Home
                </Typography>
                <Typography className={classes.mainPages} onClick={routePage.bind(this, 'productivity')} variant="h6" noWrap>
                  My Productivity
                </Typography>
                <Typography className={classes.mainPages} onClick={routePage.bind(this, 'finance')} variant="h6" noWrap>
                  My Finances
                </Typography>
                <Typography className={classes.pages} onClick={routePage.bind(this, 'support')} variant="h6" noWrap>
                  Contact Us
                </Typography>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle className={classes.accountCircle}/>
                </IconButton>
                </div>
                :
                <div className={classes.sectionDesktop}>
                <Typography className={classes.why} onClick={routePage.bind(this, 'why')} variant="h6" noWrap>
                  Why Magicly?
                </Typography>
                    <Typography className={classes.pages} onClick={routePage.bind(this, 'plans')} variant="h6" noWrap>
                      Pricing
                </Typography>
                <Typography className={classes.pages} onClick={routePage.bind(this, 'blog')} variant="h6" noWrap>
                  Blog
                </Typography>
                <Typography className={classes.pages} onClick={routePage.bind(this, 'support')} variant="h6" noWrap>
                  Contact Us
                </Typography>
                <Button className={classes.signUpButton} onClick={routePage.bind(this, 'signup')} variant="contained">Sign Up</Button>
                <Button className={classes.signInButton} onClick={routePage.bind(this, 'signin')} variant="contained">Sign In</Button>
                </div>
            }
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <ArrowDropDownCircle className={classes.arrowDropDownCircle} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu(props.signedInUser)}
      {renderMenu}
    </div>
  );
}
