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
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import AttachMoney from '@material-ui/icons/AttachMoney';

import {
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 1000, pv: 4398, amt: 2210,
  },
];

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
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '34px',
      color: '#002642',
      marginTop: '30px',
      marginBottom: '75px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
        marginBottom: '25px',
      },
    },
    chartTitle: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '32px',
      textAlign: 'center',
      color: '#000000',
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
      width: '370px',
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
      color: '#0A7EF2',
    },
    balance: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '32px',
      textAlign: 'center',
      color: '#000',
    },
    individualFeature: {
      textAlign: 'center',
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '22px',
    },
    accountBalanceTitle: {
      fontFamily: 'Playfair Display, serif',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '24px',
      textAlign: 'center',
      color: '#000',
    },
    spacing: {
      marginTop: '75px',
      [theme.breakpoints.down('md')]: {
        marginTop: '0px',
      },
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

const FinanceDashboardPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [transactions, setTransactions] = useState({});
  const [spending, setSpending] = useState({});
  const [investments, setInvestments] = useState({});
  const [depositories, setDepositories] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [barChartDataKeys, setBarChartDataKeys] = useState({});
  const [open, setOpen] = React.useState(false);
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
    if (transactions && transactions.transactions && transactions.transactions.transactions.length > 0) {
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
      if (transactions && transactions.transactions && transactions.transactions.transactions.length > 0) {
        setTransactions(organizeTransactions(transactions));
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
    let investmentAccounts = {};
    let depositoryAccounts = {};
    let creditAccounts = {};
    let loanAccounts = {};
    let otherAccounts = {};
    let actualTypes = {};

    if (transactions && transactions.transactions) {
      let accounts = transactions.transactions.accounts;
      let organizedTransactions = {};

      accounts.forEach(account => {
        switch(account.type) {

          case PLAID_ACCOUNT_TYPES.INVESTMENT.toLowerCase():
            investmentAccounts['type'] = PLAID_ACCOUNT_TYPES.INVESTMENT;
            investmentAccounts[account.account_id] = {
              transactions: [],
              type: PLAID_ACCOUNT_TYPES.INVESTMENT,
              subtype: account.subtype,
            };
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.INVESTMENT;
            break;

          case PLAID_ACCOUNT_TYPES.DEPOSITORY.toLowerCase():
            depositoryAccounts['type'] = PLAID_ACCOUNT_TYPES.DEPOSITORY;
            depositoryAccounts[account.account_id] = {
              transactions: [],
              type: PLAID_ACCOUNT_TYPES.DEPOSITORY,
              subtype: account.subtype,
            };
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.DEPOSITORY;
            break;

          case PLAID_ACCOUNT_TYPES.CREDIT.toLowerCase():
            creditAccounts['type'] = PLAID_ACCOUNT_TYPES.CREDIT;
            creditAccounts[account.account_id] = {
              transactions: [],
              type: PLAID_ACCOUNT_TYPES.CREDIT,
              subtype: account.subtype,
            };
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.CREDIT;
            break;

          case PLAID_ACCOUNT_TYPES.LOAN.toLowerCase():
            loanAccounts['type'] = PLAID_ACCOUNT_TYPES.LOAN;
            loanAccounts[account.account_id] = {
              transactions: [],
              type: PLAID_ACCOUNT_TYPES.LOAN,
              subtype: account.subtype,
            };
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.LOAN;
            break;

          case PLAID_ACCOUNT_TYPES.OTHER.toLowerCase():
            otherAccounts['type'] = PLAID_ACCOUNT_TYPES.LOAN;
            otherAccounts[account.account_id] = {
              transactions: [],
              type: PLAID_ACCOUNT_TYPES.OTHER,
              subtype: account.subtype,
            };
            actualTypes[account.account_id] = PLAID_ACCOUNT_TYPES.OTHER;
            break;

          default:
            otherAccounts[account.account_id] = {
              transactions: [],
            };
            break;
        }

        organizedTransactions[account.account_id] = {
          ...account,
          transactions: [],
        };
      });


      const keys = {};
      transactions.transactions.transactions.forEach(transaction => {
        let type = actualTypes[transaction.account_id];
        switch (type) {

          case PLAID_ACCOUNT_TYPES.INVESTMENT:
            if (investmentBarData[transaction.category[0]]) {
              // TODO: Frank, the ABS value is temporary and parseInt is temporary
              investmentBarData[transaction.category[0]] = investmentBarData[transaction.category[0]] + parseInt(Math.abs(transaction.amount).toFixed(2));
            } else {
              investmentBarData[transaction.category[0]] = parseInt(Math.abs(transaction.amount).toFixed(2));
            }
            investmentAccounts[transaction.account_id].transactions.push(transaction);
            break;

          case PLAID_ACCOUNT_TYPES.DEPOSITORY:
            if (depositoryBarData[transaction.category[0]]) {
              depositoryBarData[transaction.category[0]] = depositoryBarData[transaction.category[0]] + parseInt(Math.abs(transaction.amount).toFixed(2));
            } else {
              depositoryBarData[transaction.category[0]] = parseInt(Math.abs(transaction.amount).toFixed(2));
            }
            depositoryAccounts[transaction.account_id].transactions.push(transaction);
            break;

          case PLAID_ACCOUNT_TYPES.CREDIT:
            if (creditBarData[transaction.category[0]]) {
              creditBarData[transaction.category[0]] = creditBarData[transaction.category[0]] + parseInt(Math.abs(transaction.amount).toFixed(2));
            } else {
              creditBarData[transaction.category[0]] = parseInt(Math.abs(transaction.amount).toFixed(2));
            }
            creditAccounts[transaction.account_id].transactions.push(transaction);
            break;

          case PLAID_ACCOUNT_TYPES.LOAN:
            if (loanBarData[transaction.category[0]]) {
              loanBarData[transaction.category[0]] = loanBarData[transaction.category[0]] + parseInt(Math.abs(transaction.amount).toFixed(2));
            } else {
              loanBarData[transaction.category[0]] = parseInt(Math.abs(transaction.amount).toFixed(2));
            }
            loanAccounts[transaction.account_id].transactions.push(transaction);
            break;

          case PLAID_ACCOUNT_TYPES.OTHER:
            if (otherBarData[transaction.category[0]]) {
              otherBarData[transaction.category[0]] = otherBarData[transaction.category[0]] + parseInt(Math.abs(transaction.amount).toFixed(2));
            } else {
              otherBarData[transaction.category[0]] = parseInt(Math.abs(transaction.amount).toFixed(2));
            }
            otherAccounts[transaction.account_id].transactions.push(transaction);
            break;
        }


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
        organizedTransactions[transaction.account_id].transactions.push(transaction);
        if (!keys[transaction.category[0]]) {
          keys[transaction.category[0]] = transaction.category[0];
        }
      });
      let data = [investmentBarData, depositoryBarData, creditBarData, loanBarData, otherBarData];
      let barChartData = [];
      for (let i = 0; i < data.length; i++) {
        if (Object.keys(data[i]).length > 1) {
          barChartData.push(data[i]);
        }
      }

      setBarChartDataKeys(keys);
      setBarChartData(barChartData);
      setSpending(organizedSpending);
      setInvestments(investmentAccounts);
      setDepositories(depositoryAccounts);
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

  const buildDepositoryData = () => {
    let depositoryData = [];
    Object.entries(depositories).forEach(([key, value]) => {
      console.log(key, value);
    });
  };

  let spendingDatum = buildSpendingData();
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getAccountBalancesUI = () => {
    type GRID_SIZES = 'auto' | true | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    let accountBalances = {};
    let accountBalancesUI = [];
    for (const property in transactions) {
      let accountType = transactions[property].type;
      let availableBalance = transactions[property].balances.available;
      let currentBalance = transactions[property].balances.current;

      if (accountBalances[accountType] === undefined) {
        if (availableBalance === null) {
          accountBalances[accountType] = currentBalance;
        } else if (availableBalance !== null) {
          accountBalances[accountType] = availableBalance;
        }
      } else {
        if (availableBalance === null) {
          accountBalances[accountType] = accountBalances[accountType] + currentBalance;
        } else if (availableBalance !== null) {
          accountBalances[accountType] = accountBalances[accountType] + availableBalance;
        }
      }
    }

    let columnSpan: GRID_SIZES = 12 / Object.keys(accountBalances).length as GRID_SIZES;
    let ID = 0;
    for (const key in accountBalances) {
      let title = getCapitalizedString(key);
      let balance = accountBalances[key].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      accountBalancesUI.push(
        <Grid key={ID} item xs={12} lg={columnSpan} md={columnSpan} sm={12} style={{ textAlign: 'center' }}>
          <div className={classes.individualFeature}>
            <AttachMoney fontSize={'large'} className={classes.icon} />
            <span className={classes.balance}>{balance}</span>
          </div>
          <p className={classes.accountName}>{title} Account</p>
        </Grid>
      );
      ID++;
    }
    return accountBalancesUI;
  };

  let accountBalancesUI = getAccountBalancesUI();
  return (
    <Layout>
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={6} lg={12} md={12} sm={12} style={{ textAlign:'center' }}>
            <h2
              className={classes.title}>
              Your Finance Dashboard
            </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
            { accountBalancesUI }
            <Grid item xs={12} sm={12} md={6} lg={6} style={{marginTop: '75px', textAlign: 'center'}}>
              <span className={classes.chartTitle}>Breakdown By Account</span>
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
            <Grid item xs={12} sm={12} md={6} lg={6} style={{ marginTop: '75px', textAlign: 'center' }}>
              <span className={classes.chartTitle}>Breakdown By Spending Category</span>
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
            <Grid item xs={12} sm={12} lg={2} md={2} style={{marginTop: '75px'}}>
              <Button
                onClick={routePageWithQuery.bind(this, `finance/receipts/add`, { receipt: true })}
                className={classes.receiptsButton}
              >
                Upload Receipts
            </Button>
            </Grid>
            <Grid item xs={12} sm={12} lg={2} md={2} className={classes.spacing}>
              <Button
                onClick={routePage.bind(this, `finance/receipts`)}
                className={classes.viewReceiptsButton}
              >
                View Receipts
            </Button>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} md={12}>
              <Button
                onClick={routePage.bind(this, `finance/search`)}
                className={classes.viewOrSearchButton}
              >
                View or Search Transactions
            </Button>
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