import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import MagiclyButton from '../../../components/shared/MagiclyButton';
import { useRouter } from 'next/router';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import AttachMoney from '@material-ui/icons/AttachMoney';
import IconButton from '@material-ui/core/IconButton';
import MaterialUITooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';

import PlaidLink from '../../../components/finance/PlaidLink';

import {
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const depositoryBarData = {
  name: 'Depository',
};
const creditBarData = {
  name: 'Credit',
};
const investmentBarData = {
  name: 'Investment',
};
const loanBarData = {
  name: 'Loan',
};
const otherBarData = {
  name: 'Other',
};

//(node:46223) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 /finance/dashboard listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit

const COLORS = ['#002642', '#E59500', '#0A7EF2', '#840032', '#E5DADA', '#02040F'];

const PLAID_ACCOUNT_TYPES = {
  INVESTMENT: 'INVESTMENT',
  DEPOSITORY: 'DEPOSITORY',
  CREDIT: 'CREDIT',
  LOAN: 'LOAN',
  OTHER: 'OTHER'
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    chartTitle: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '32px',
      textAlign: 'center',
      color: '#002642',
      marginRight: '20px'
    },
    financePage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '30px',
    },
    centerGraph: {
      margin: '0 auto'
    },
    uploadReceiptsBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#FFF',
      backgroundColor: '#E59500',
      borderRadius: '50px',
      border: '3px #FFF solid',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
        width: '130px',
        height: '35px'
      },
    },
    manageReceiptsBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#E59500',
      backgroundColor: '#FFF',
      borderRadius: '50px',
      border: '3px #E59500 solid',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '12px',
        width: '130px',
        height: '35px'
      },
    },
    manageTransactionsBtn: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '2px',
      color: '#FFF',
      backgroundColor: '#0A7EF2',
      borderRadius: '50px',
      border: '3px #FFF solid',
      width: '185px',
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
    formControl: {
      minWidth: '65px',
    },
    accountName: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '22px',
      textAlign: 'center',
      color: 'rgba(0, 38, 66, 0.5)',
    },
    balance: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '32px',
      textAlign: 'center',
      color: '#002642',
    },
    individualFeature: {
      textAlign: 'center',
    },
    balanceBox: {
      textAlign: 'center',
      background: '#FFFFFF',
      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
      borderRadius: '10px',
      maxWidth: '280px',
      marginRight: '5px',
      marginBottom: '10px',
      padding: '5px',
    },
    icon: {
      color: '#002642',
      fontSize: '24px',
    },
    accountBalanceTitle: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '24px',
      textAlign: 'center',
      color: '#002642',
    },
    dropdown: {
      [theme.breakpoints.down('md')]: {
        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'block',
      },
    }
  }),
);

const fetchTransactions = async (lastXDays: any) => {
  const response = await fetch('/finance/transactionsList?' + `lastXDays=${lastXDays}`);
  if (response.redirected) {
    return [];
  }
  const responseJSON = await response.json();
  return responseJSON;
};

const fetchLinkToken = async () => {
  const response = await fetch('/create_link_token', { method: 'POST' });
  const responseJSON = await response.json();
  return responseJSON.link_token;
};

const FinanceDashboardPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [numberOfAccounts, setNumberOfAccounts] = useState(0);
  const [transactions, setTransactions] = useState({});
  const [spending, setSpending] = useState({});
  const [investments, setInvestments] = useState({});
  const [depositories, setDepositories] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [barChartDataKeys, setBarChartDataKeys] = useState({});
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = useState('');
  const [lastXDays, setLastXDays] = useState(90);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const refreshTransactions = async (xDays: any) => {
    handleToggle();
    const transactions = await fetchTransactions(xDays);
    if (transactions && transactions.transactions && transactions.transactions[0].transactions.length > 0) {
      if (transactions && transactions.numOfAccounts) {
        setNumberOfAccounts(transactions.numOfAccounts);
      }
      setTransactions(organizeTransactions(transactions));
      handleClose();
    }
  };

  const handleDateSelect = (event: React.ChangeEvent<{ value: number }>) => {
    setLastXDays(event.target.value);
    refreshTransactions(event.target.value);
  };

  useEffect(() => {
    async function getTxns() {
      handleToggle();
      const transactions = await fetchTransactions(lastXDays);
      if (transactions && transactions.transactions && transactions.transactions[0].transactions.length > 0) {
        if (transactions && transactions.numOfAccounts) {
          setNumberOfAccounts(transactions.numOfAccounts);
        }
        setTransactions(organizeTransactions(transactions));
        let plaidToken = await fetchLinkToken();
        setToken(plaidToken);
        handleClose();
      }
    }
    getTxns();
  }, []);

  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true })
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

  const organizeTransactions = (transactions: any) => {
    let organizedSpending = {};
    let actualTypes = {};
    let mergedAccounts = [];
    let mergedTransactions = [];

    if (transactions && transactions.transactions) {
      for (let i = 0; i < transactions.transactions.length; i++) {
        if (transactions.transactions[i].accounts) {
          mergedAccounts = mergedAccounts.concat(transactions.transactions[i].accounts);
        }
      }

      let organizedTransactions = {};
      mergedAccounts.forEach(account => {
        switch(account.type) {

          case PLAID_ACCOUNT_TYPES.INVESTMENT.toLowerCase():
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.INVESTMENT;
            break;

          case PLAID_ACCOUNT_TYPES.DEPOSITORY.toLowerCase():
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.DEPOSITORY;
            break;

          case PLAID_ACCOUNT_TYPES.CREDIT.toLowerCase():
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.CREDIT;
            break;

          case PLAID_ACCOUNT_TYPES.LOAN.toLowerCase():
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.LOAN;
            break;

          case PLAID_ACCOUNT_TYPES.OTHER.toLowerCase():
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.OTHER;
            break;

          default:
            break;
        }

        organizedTransactions[account.account_id] = {
          ...account,
          transactions: [],
        };
      });


      const keys = {};
      for (let i = 0; i < transactions.transactions.length; i++) {
        if (transactions.transactions[i].transactions)
          mergedTransactions = mergedTransactions.concat(transactions.transactions[i].transactions);
      }

      mergedTransactions.forEach(transaction => {
        let type = actualTypes[transaction.account_id];
        switch (type) {

          case PLAID_ACCOUNT_TYPES.INVESTMENT:
            if (transaction.category && transaction.amount > 0) {
              // skip transaction amount if negative (meaning its a credit to your account)
              if (investmentBarData[transaction.category[0]]) {
                investmentBarData[transaction.category[0]] = investmentBarData[transaction.category[0]] + parseFloat(transaction.amount.toFixed(2));
                investmentBarData[transaction.category[0]] = parseFloat(investmentBarData[transaction.category[0]].toFixed(2))
              } else {
                investmentBarData[transaction.category[0]] = parseFloat(transaction.amount.toFixed(2));
              }
            }
            break;

          case PLAID_ACCOUNT_TYPES.DEPOSITORY:
            // skip transaction amount if negative (meaning its a credit to your account)
            if (transaction.category && transaction.amount > 0) {
              if (depositoryBarData[transaction.category[0]]) {
                depositoryBarData[transaction.category[0]] = depositoryBarData[transaction.category[0]] + parseFloat(transaction.amount.toFixed(2));
                depositoryBarData[transaction.category[0]] = parseFloat(depositoryBarData[transaction.category[0]].toFixed(2))
              } else {
                depositoryBarData[transaction.category[0]] = parseFloat(transaction.amount.toFixed(2));
              }
            }
            break;

          case PLAID_ACCOUNT_TYPES.CREDIT:
            // skip transaction amount if negative (meaning its a credit to your account)
            if (transaction.category && transaction.amount > 0) {
              if (creditBarData[transaction.category[0]]) {
                creditBarData[transaction.category[0]] = creditBarData[transaction.category[0]] + parseFloat(transaction.amount.toFixed(2));
                creditBarData[transaction.category[0]] = parseFloat(creditBarData[transaction.category[0]].toFixed(2))
              } else {
                creditBarData[transaction.category[0]] = parseFloat(transaction.amount.toFixed(2));
              }
            }
            break;

          case PLAID_ACCOUNT_TYPES.LOAN:
            // skip transaction amount if negative (meaning its a credit to your account)
            if (transaction.category && transaction.amount > 0) {
              if (loanBarData[transaction.category[0]]) {
                loanBarData[transaction.category[0]] = loanBarData[transaction.category[0]] + parseFloat(transaction.amount.toFixed(2));
                loanBarData[transaction.category[0]] = parseFloat(loanBarData[transaction.category[0]].toFixed(2))
              } else {
                loanBarData[transaction.category[0]] = parseFloat(transaction.amount.toFixed(2));
              }
            }
            break;

          case PLAID_ACCOUNT_TYPES.OTHER:
            // skip transaction amount if negative (meaning its a credit to your account)
            if (transaction.category && transaction.amount > 0) {
              if (otherBarData[transaction.category[0]]) {
                otherBarData[transaction.category[0]] = otherBarData[transaction.category[0]] + parseFloat(transaction.amount.toFixed(2));
                otherBarData[transaction.category[0]] = parseFloat(otherBarData[transaction.category[0]].toFixed(2))
              } else {
                otherBarData[transaction.category[0]] = parseFloat(transaction.amount.toFixed(2));
              }
            }

            break;
        }
        // skip transaction amount if negative (meaning its a credit to your account) because this is for spending
        if (transaction.category && transaction.amount > 0) {
          if (organizedSpending[transaction.category[0]]) {
            organizedSpending[transaction.category[0]].transactions.push(transaction);
            organizedSpending[transaction.category[0]].totalAmount =
              organizedSpending[transaction.category[0]].totalAmount + transaction.amount
          } else {
            organizedSpending[transaction.category[0]] = {
              category: transaction.category,
              transactions: [transaction],
              totalAmount: transaction.amount
            }
          }
        }
        organizedTransactions[transaction.account_id].transactions.push(transaction);

        if (transaction.category && !keys[transaction.category[0]]) {
          keys[transaction.category[0]] = transaction.category[0];
        }
      });
      let allChartData = [investmentBarData, depositoryBarData, creditBarData, loanBarData, otherBarData];
      let barChartData = [];

      for (let i = 0; i < allChartData.length; i++) {
        if (Object.keys(allChartData[i]).length > 1) {
          barChartData.push(allChartData[i]);
        }
      }

      setBarChartDataKeys(keys);
      setBarChartData(barChartData);
      setSpending(organizedSpending);
      return organizedTransactions;
    } else {
      return {};
    }
  };

  const buildSpendingData = () => {
    let spendingData = [];
    Object.entries(spending).forEach(([key, value]) => {
      if (value && value !== undefined && value.hasOwnProperty('totalAmount')) {
        spendingData.push({ name: key, value: parseFloat(value['totalAmount'].toFixed(2)) })
      }
    });
    return spendingData;
  };

  const getBarChartUI = () => {
    const colorArray = ['#002642', '#E59500', '#0A7EF2', '#840032', '#E5DADA', '#02040F'];
    const data = [];
    let counter = 0;
    for (const property in barChartDataKeys) {
      data.push(
        <Bar key={counter} dataKey={property} stackId="a" fill={colorArray[counter]} />
      );
      counter++;
    }
    return data;
  }

  const getAccountBalancesUI = () => {
    type GRID_SIZES = 'auto' | true | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    let accountBalances = {};
    let accountBalancesUI = [];
    let ID = 0;

    for (const property in transactions) {

      let accountType = transactions[property].type;
      let availableBalance = transactions[property].balances.available;
      let currentBalance = transactions[property].balances.current;

      if (accountBalances[accountType] === undefined) {
        accountBalances[accountType] =
          availableBalance === null
          ? currentBalance
          : availableBalance;
      } else {
        accountBalances[accountType] =
          availableBalance === null
          ? accountBalances[accountType] + currentBalance
          : accountBalances[accountType] + availableBalance;
      }
    }

    let columnSpan: GRID_SIZES = 12 / Object.keys(accountBalances).length as GRID_SIZES;

    for (const key in accountBalances) {
      let title = getCapitalizedString(key);
      let balance = accountBalances[key].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      let accountLabel = numberOfAccounts <= 1 ? 'Account' : 'Accounts';
      let depositoryUXFriendlyLabel = 'Checking & Savings';
      let accountTitle = [];

      if (title === 'Depository') {
        accountTitle.push(
          <MaterialUITooltip title={depositoryUXFriendlyLabel}>
            <p className={classes.accountName}>{title + ' ' + accountLabel}</p>
          </MaterialUITooltip>
        );
      } else {
        accountTitle.push(
          <p className={classes.accountName}>{title + ' ' + accountLabel}
          </p>
        );
      }

      accountBalancesUI.push(
        <Grid key={ID++} item xs={12} lg={3} md={6} sm={12} className={classes.balanceBox}>
          <div className={classes.individualFeature}>
            <AttachMoney fontSize={'large'} className={classes.icon} />
            <span className={classes.balance}>{balance}</span>
          </div>
          {accountTitle}
        </Grid>
      );
    }
    return accountBalancesUI;
  };

  let accountBalancesUI = getAccountBalancesUI();
  let spendingDatum = buildSpendingData();
  return (
    <Layout>
      <div className={classes.financePage}>
        <Grid container justify="center" alignContent="center" alignItems="center">
          {/* ACCOUNTS DROPDOWN */}
          {/* <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
            <span className={classes.dropdown}><FormControl className={classes.formControl}>
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
            </FormControl></span>
          </Grid> */}
        </Grid>
        <div className={classes.root}>
          <Grid container justify="center" alignContent="center" alignItems="center">
            <Grid container justify="center" alignContent="center" alignItems="center">
            { accountBalancesUI }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} style={{ marginTop: '75px', textAlign: 'center' }}>
              <span className={classes.chartTitle}>Spending Breakdown By Category</span>
              <span className={classes.dropdown}><FormControl className={classes.formControl}>
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
              </FormControl></span>
              <ResponsiveContainer width="95%" height={300}>
                <PieChart className={classes.centerGraph}>
                  <Pie
                    data={spendingDatum}
                    innerRadius={100}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {
                      spendingDatum.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} style={{ marginTop: '75px', textAlign: 'center' }}>
              <span className={classes.chartTitle}>Spending Breakdown By Account</span>
              <span className={classes.dropdown}><FormControl className={classes.formControl}>
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
              </FormControl></span>
              <ResponsiveContainer width="95%" height={300}>
                <BarChart
                  className={classes.centerGraph}
                  data={barChartData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {getBarChartUI()}
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            {/* <Grid item xs={12} sm={12} lg={2} md={2} >
              <Button
                onClick={routePageWithQuery.bind(this, `finance/receipts/add`, { receipt: true })}
                className={classes.uploadReceiptsBtn}
              >
                Upload Receipts
            </Button>
            </Grid> */}
            <Grid item xs={12} lg={12} md={12} sm={12} style={{ marginTop: '30px',}}>
              {token ? <PlaidLink token={token} title={'Add More Accounts'} addMoreAccounts={true} /> : null}
            </Grid>
            <Grid item xs={12} sm={12} lg={12} md={12} style={{ marginTop: '10px',marginBottom: '10px' }}>
              <MagiclyButton
                isWhiteBackgroundBtn={true}
                btnLabel={'Receipts'}
                onClick={routePage.bind(this, `finance/receipts`)}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12} md={12} style={{ marginBottom: '30px' }}>
              <MagiclyButton
                isWhiteBackgroundBtn={true}
                btnLabel={'Transactions'}
                onClick={routePage.bind(this, `finance/search`)}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FinanceDashboardPage);