import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { DOC_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const QUERY = gql`
  query GetDocuments (
    $docTypes: [DocType],
    $cursor: String,
    $limit: Int
  ) {
    documents(
      docTypes: $docTypes,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        notes
        name
        type
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '40px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '10px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '10px',
      },
    },
    mediumTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '10px',
        marginBottom: '10px',
      },
    },
    smallTitle: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '18px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '15px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        marginTop: '10px',
        marginBottom: '10px',
      },
    },
    link: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Playfair Display',
      color: '#002642',
    },
    type: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Fredoka One, cursive',
      color: '#FFF',
      backgroundColor: '#840032',
      padding: '8px',
      borderRadius: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    centerText: {
      marginBottom: '14px',
      textAlign: 'center',
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '35px',
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '14px',
    },
    details: {
      color: '#0A7EF2',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '22px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
  }),
);

const ReceiptsPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let receipts: Array<any> = [];
  let hasSavedReceipts: boolean = false;
  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        docTypes: [DOC_TYPE.RECEIPT],
      }
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const routePageWithQuery = (pageName: string, queryObj: any) => {
    router.push({
      pathname: '/' + pageName,
      query: queryObj,
    }, undefined, { shallow: true });
  };

  const getIndividualReceipt = (key: any, receipt: any) => {
    return (
      <Grid key={key} container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="receipts/view/[id]" as={`receipts/view/${receipt.id}`}>
            <span className={classes.link}>{receipt.name}</span>
          </Link>
        </Grid>
        <Grid item xs={4} lg={3} md={4} sm={4}>
          <Link href="receipts/view/[id]" as={`receipts/view/${receipt.id}`}>
            <span className={classes.type}>{receipt.type}</span>
          </Link>
        </Grid>
      </Grid>
    );
  };

  if (data && data.documents && data.documents.edges && data.documents.edges.length > 0) {
    hasSavedReceipts = true;
    data.documents.edges.forEach((document, key) => {
      receipts.push(
        getIndividualReceipt(
          key,
          document
        )
      );
    });
  }

  const getMainUI = () => {
    if (hasSavedReceipts) {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <h1 className={classes.title}>Saved receipts</h1>
          </Grid>
          <Grid item xs={12} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePageWithQuery.bind(this, `finance/receipts/add`, {receipt: true})}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add receipt</span>
            </div>
          </Grid>
          {receipts}
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>Saved receipts</h1>
          </Grid>
          <Grid item xs={8} lg={7} md={7} sm={7}>
            <h1 className={classes.mediumTitle}>store receipts you accrue over time so you never lose them</h1>
          </Grid>
          <Grid item xs={12} lg={6} md={6} sm={6}>
            <div className={classes.individualFeature} onClick={routePageWithQuery.bind(this, `finance/receipts/add`, {receipt: true})}>
              <AddCircle fontSize={'small'} className={classes.icon} />
              <span className={classes.details}>add receipt</span>
            </div>
          </Grid>
        </Grid>
      );
    }
  };

  // TODO: CSS BUG where width extends past appBar width
  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(ReceiptsPage);