import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import {
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F72C25', '#34113F'];
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
      fontSize: '30px',
      color: '#002642',
      marginTop: '0px',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
        marginBottom: '5px',
      },
    },
    financePage: {
      marginRight: '30px',
      marginLeft: '30px',
      marginTop: '55px',
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

const FinanceDashboardPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [transactions, setTransactions] = useState({});
  const [spending, setSpending] = useState({});
  const [investments, setInvestments] = useState({});
  const [depositories, setDepositories] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [barChartDataKeys, setBarChartDataKeys] = useState({});

  useEffect(() => {
    async function getTxns() {
      const transactions = await fetchTransactions();
      if (transactions && transactions.transactions && transactions.transactions.transactions.length > 0) {
        setTransactions(organizeTransactions(transactions));
      }
    }
    getTxns();
  }, []);

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

      setBarChartDataKeys(keys);
      setBarChartData([
        investmentBarData,
        depositoryBarData,
        creditBarData,
        loanBarData,
        otherBarData
      ]);
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
    const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    const data = [];
    for (const property in barChartDataKeys) {
      let randomKey = Math.floor(Math.random() * Math.floor(49));
      data.push(
        <Bar key={randomKey} dataKey={property} stackId="a" fill={colorArray[randomKey]} />
      )
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

  return (
    <Layout>
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h2
              className={classes.title}>
              <span style={{ color: '#002642' }}>Dashboard</span>
            </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
            <Grid item xs={6}>
              <PieChart width={500} height={500}>
                <Pie
                  data={spendingDatum}
                  cx={200}
                  cy={200}
                  outerRadius={150}
                  fill="#8884d8"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                >
                  {
                    spendingDatum.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </Grid>
            <Grid item xs={6}>
              <BarChart
                width={500}
                height={300}
                data={barChartData}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                { getBarChartUI() }
              </BarChart>
            </Grid>
            <Grid item xs={6}>
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(FinanceDashboardPage);