import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

const COLORS = ['#002642', '#E59500', '#0A7EF2', '#840032', '#E5DADA', '#02040F'];
enum PLAID_ACCOUNT_TYPES {
  ALL = 'ALL',
  INVESTMENT = 'INVESTMENT',
  DEPOSITORY = 'DEPOSITORY',
  CREDIT = 'CREDIT',
  LOAN = 'LOAN',
  OTHER = 'OTHER'
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    table: {
      minWidth: 650,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '34px',
      color: '#002642',
      marginTop: '0px',
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
        marginBottom: '5px',
      },
    },
    chartTitle: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '20px',
      lineHeight: '32px',
      textAlign: 'center',
      color: '#000000',
    },
    financePage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '30px',
    },
    centerGraph: {
      margin: '0 auto'
    },
    receiptsButton: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#FFF',
      backgroundColor: '#E59500',
      borderRadius: '50px',
      border: '3px #FFF solid',
      width: '165px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
        width: '130px',
        height: '35px'
      },
    },
    viewReceiptsButton: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#E59500',
      backgroundColor: '#FFF',
      borderRadius: '50px',
      border: '3px #E59500 solid',
      width: '165px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
        width: '130px',
        height: '35px'
      },
    },
    viewOrSearchButton: {
      fontFamily: 'Fredoka One, cursive',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      border: '3px #FFF solid',
      width: '265px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
        width: '220px',
        height: '35px'
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
    search : {
      minWidth: '500px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '320px',
      }
    },
    formControl: {
      minWidth: '65px',
    },
  }),
);

const fetchTransactions = async (xDays: any) => {
  const response = await fetch('/finance/transactionsList?' + `lastXDays=${xDays}`);
  if (response.redirected) {
    return [];
  }
  const responseJSON = await response.json();
  return responseJSON;
};

const FinanceSearchPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [unalteredTransactions, setUnalteredTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [type, setType] = useState('ALL');
  const [lastXDays, setLastXDays] = useState(90);
  const [open, setOpen] = React.useState(false);
  const [urgent, setUrgent] = useState(false);
  const [accountNamesMap, setAccountNamesMap] = React.useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isUrgent: boolean = event.target.value === 'true' ? true : false;
    setUrgent(isUrgent);
  };

  useEffect(() => {
    async function getTxns() {
      handleToggle();
      const transactions = await fetchTransactions(lastXDays);
      if (transactions && transactions.transactions && transactions.transactions.transactions.length > 0) {
        setAccountNamesMap(buildAccountNamesMap(transactions))
        setUnalteredTransactions(transactions.transactions.transactions);
        setFilteredTransactions(transactions.transactions.transactions);
        handleClose();
      }
    }
    getTxns();
  }, []);

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true })
  };

  const refreshTransactions = async (xDays: any) => {
    handleToggle();
    const transactions = await fetchTransactions(xDays);
    if (transactions && transactions.transactions && transactions.transactions.transactions.length > 0) {
      setAccountNamesMap(buildAccountNamesMap(transactions))
      setUnalteredTransactions(transactions.transactions.transactions);
      setFilteredTransactions(transactions.transactions.transactions);
      handleClose();
    }
  };

  const routePageWithQuery = (pageName: string, queryObj: any) => {
    router.push({
      pathname: '/' + pageName,
      query: queryObj,
    }, undefined, { shallow: true });
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const buildAccountNamesMap = (transactions: any) => {
    if (transactions && transactions.transactions) {
      let accounts = transactions.transactions.accounts;
      let accountNamesMap = {};
      accounts.forEach(account => {
        accountNamesMap[account.account_id] = {
          name: account.name,
          officialName: account.official_name,
          type: account.type,
          subtype: account.subtype,
          balances: account.balances,
        }
      });
      return accountNamesMap;
    }
  };

  const handleSearch = () => {
    let searchString = document.getElementById('outlined-basic')['value'].toLowerCase();
    let newUnalteredTransactions = [];

    for (let i = 0; i < unalteredTransactions.length; i++) {
      if (
        (unalteredTransactions[i].merchant_name && unalteredTransactions[i].merchant_name.toLowerCase().includes(searchString)) ||
        (unalteredTransactions[i].name && unalteredTransactions[i].name.toLowerCase().includes(searchString)) ||
        (unalteredTransactions[i].category.length > 0 && unalteredTransactions[i].category.join('').toLowerCase().includes(searchString))
        ) {
        newUnalteredTransactions.push(unalteredTransactions[i]);
      }
    }
    setFilteredTransactions(newUnalteredTransactions);
  };

  const clearSearch = () => {
    document.getElementById('outlined-basic')['value'] = '';
    setFilteredTransactions(unalteredTransactions);
  };

  const handleDateSelect = (event: React.ChangeEvent<{ value: number }>) => {
    document.getElementById('outlined-basic')['value'] = '';
    setLastXDays(event.target.value);
    refreshTransactions(event.target.value);
  };

  const handleTypeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    document.getElementById('outlined-basic')['value'] = '';
    let newUnalteredTransactions = [];
    if (event.target.value === PLAID_ACCOUNT_TYPES.ALL) {
      newUnalteredTransactions = unalteredTransactions;
    }
    for (let i = 0; i < unalteredTransactions.length; i++) {
      if (accountNamesMap[unalteredTransactions[i].account_id].type.toUpperCase() === event.target.value) {
        newUnalteredTransactions.push(unalteredTransactions[i]);
      }
    }
    setType(event.target.value as PLAID_ACCOUNT_TYPES);
    setFilteredTransactions(newUnalteredTransactions);
  };

  const createRowData = (name, amount, date, accountName, accountOfficialName, currency, categories, keyId) => {
    return { name, amount, date, accountName, accountOfficialName, currency, categories, keyId };
  };

  const buildTableRows = () => {
    let rows = [];
    if (filteredTransactions && filteredTransactions.length > 0) {
      for (let i = 0; i < filteredTransactions.length; i++) {
        let accountName = accountNamesMap[filteredTransactions[i].account_id].name;
        let accountOfficialName = accountNamesMap[filteredTransactions[i].account_id].officialName;
        let keyId = i;
        rows.push(createRowData(
          filteredTransactions[i].name,
          filteredTransactions[i].amount,
          filteredTransactions[i].date,
          accountName,
          accountOfficialName,
          filteredTransactions[i].iso_currency_code,
          filteredTransactions[i].category.join(', '),
          keyId
        ));
      }
      return rows;
    }
  };

  let rows = buildTableRows();
  return (
    <Layout>
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <h2
              className={classes.title}>
              Transactions
            </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={12} lg={12} style={{textAlign: 'center'}}>
              <TextField id="outlined-basic" label="Search" variant="outlined" className={classes.search} autoComplete="off" />
              <Button variant="contained" style={{ backgroundColor: '#840032', color: 'white', marginLeft: '10px', height: '55px' }} onClick={handleSearch}>
                Search
              </Button>
              <Button variant="contained" style={{ border: '2px solid #840032', backgroundColor: 'white', color: '#840032', marginLeft: '10px', height: '55px' }} onClick={clearSearch}>
                Clear
              </Button>
            </Grid>
            <Grid item xs={6} lg={2} md={2} sm={2} style={{ textAlign: 'center' }}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  onChange={handleTypeSelect}
                >
                  <MenuItem value={PLAID_ACCOUNT_TYPES.ALL}>{getCapitalizedString(PLAID_ACCOUNT_TYPES.ALL)}</MenuItem>
                  <MenuItem value={PLAID_ACCOUNT_TYPES.CREDIT}>{getCapitalizedString(PLAID_ACCOUNT_TYPES.CREDIT)}</MenuItem>
                  <MenuItem value={PLAID_ACCOUNT_TYPES.DEPOSITORY}>{getCapitalizedString(PLAID_ACCOUNT_TYPES.DEPOSITORY)}</MenuItem>
                  <MenuItem value={PLAID_ACCOUNT_TYPES.INVESTMENT}>{getCapitalizedString(PLAID_ACCOUNT_TYPES.INVESTMENT)}</MenuItem>
                  <MenuItem value={PLAID_ACCOUNT_TYPES.LOAN}>{getCapitalizedString(PLAID_ACCOUNT_TYPES.LOAN)}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} lg={2} md={2} sm={2} style={{ textAlign: 'center' }}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Date</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={lastXDays}
                  onChange={handleDateSelect}
                >
                  <MenuItem value={30}>{'Last 30 Days'}</MenuItem>
                  <MenuItem value={60}>{'Last 60 Days'}</MenuItem>
                  <MenuItem value={90}>{'Last 90 Days'}</MenuItem>
                  <MenuItem value={180}>{'Last 6 Months'}</MenuItem>
                  <MenuItem value={365}>{'Last Year'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} lg={4} md={12} sm={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Currency</FormLabel>
                <RadioGroup aria-label="currency" name="currency1" value={urgent} onChange={handleChange}>
                  <FormControlLabel value={true} control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio disableRipple classes={{ root: classes.radio, checked: classes.checked }} />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid> */}
          </Grid>
          <TableContainer component={Paper} style={{marginTop: '50px'}}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Currency</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Account Name</TableCell>
                  {/* <TableCell align="right">Account Official Name</TableCell> */}
                  <TableCell align="right">Categories</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows ?
                      rows.map((row) => (
                        <TableRow key={row.keyId}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.amount}</TableCell>
                          <TableCell align="right">{row.currency}</TableCell>
                          <TableCell align="right">{row.date}</TableCell>
                          <TableCell align="right">{row.accountName}</TableCell>
                          {/* <TableCell align="right">{row.accountOfficialName}</TableCell> */}
                          <TableCell align="right">{row.categories}</TableCell>
                        </TableRow>
                      )) : null
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FinanceSearchPage);