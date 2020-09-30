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

function createData(name, type, category, date) {
  return { name, type, category, date };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24),
  createData('Ice cream sandwich', 237, 9.0, 37),
  createData('Eclair', 262, 16.0, 24),
  createData('Cupcake', 305, 3.7, 67),
  createData('Gingerbread', 356, 16.0, 49),
];

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
      /* identical to box height */
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
  }),
);

const fetchTransactions = async () => {
  const response = await fetch('/finance/transactionsList');
  if (response.redirected) {
    return [];
  }
  const responseJSON = await response.json();
  return responseJSON;
};

const FinanceSearchPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [transactions, setTransactions] = useState({});
  const [spending, setSpending] = useState({});
  const [investments, setInvestments] = useState({});
  const [depositories, setDepositories] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [barChartDataKeys, setBarChartDataKeys] = useState({});
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    async function getTxns() {
      handleToggle();
      const transactions = await fetchTransactions();
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
        switch (account.type) {

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
  let spendingDatum = buildSpendingData();

  return (
    <Layout>
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <h2
              className={classes.title}>
              Transactions Search
            </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name)</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                  </TableRow>
                ))}
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