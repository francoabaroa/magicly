import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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
      marginBottom: '25px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
        marginTop: '0px',
        marginBottom: '15px',
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
  const responseJSON = await response.json();
  return responseJSON;
};

const TransactionsPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function getTxns() {
      let transactions = await fetchTransactions();
      setTransactions(transactions);
    }
    getTxns();
  }, []);

  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  return (
    <Layout>
      <div className={classes.financePage}>
        <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h2
              className={classes.title}>
              <span style={{ color: '#002642' }}>Transactions page </span>
            </h2>
          </Grid>
        </Grid>
        <div className={classes.root}>
          <Grid container justify="center" alignContent="center" alignItems="center">
            <Grid item xs={8}>
              { JSON.stringify(transactions) }
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: false })(TransactionsPage);