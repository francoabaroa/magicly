import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import MagiclyLoading from '../../../components/shared/MagiclyLoading';
import MagiclyError from '../../../components/shared/MagiclyError';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import MagiclyAddIconLabel from '../../../components/shared/MagiclyAddIconLabel';
import MagiclySearchIconLabel from '../../../components/shared/MagiclySearchIconLabel';
import MagiclyPageTitle from '../../../components/shared/MagiclyPageTitle';
import { DOC_TYPE } from '../../../constants/appStrings';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';

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
    emptyMarginTopBlock: {
      marginTop: '50px',
      [theme.breakpoints.down('sm')]: {
        marginTop: '20px'
      },
    },
    hugeIcon: {
      color: '#E5DADA',
      fontSize: '120px',
      marginTop: '60px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '80px',
      },
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
    tap: {
      color: '#02040F',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    someExamples: {
      color: '#02040F',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '18px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    paper: {
      fontFamily: 'Playfair Display, serif',
      color: '#FFF',
      textAlign: 'left',
      backgroundColor: "#E5DADA",
      borderRadius: '10px',
      boxShadow: '15px 15px 0 0px #02040F',
      marginBottom: '20px',
      maxWidth: '400px'
    },
    examples: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontSize: '16px',
      color: '#002642',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
      },
    },
    leftText: {
      textAlign: 'left',
    },
    toolIcon: {
      color: '#002642',
      fontSize: '18px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
    },
    docType: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    type: {
      marginLeft: '15px',
      fontSize: '20px',
      textDecoration: 'none',
      fontFamily: 'Overpass, serif',
      color: '#840032',
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
      marginBottom: '15px',
      whiteSpace: 'nowrap',
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
    horizontalLine: {
      marginTop: '20px',
      maxWidth: '900px',
    },
  }),
);

const DocumentsPage = () => {
  const router = useRouter();
  const classes = useStyles();
  let documents: Array<any> = [];
  let hasSavedDocuments: boolean = false;
  const { data, loading, error } = useQuery(
    QUERY,
    {
      variables: {
        docTypes: Object.keys(DOC_TYPE),
      }
    }
  );

  if (loading) return <MagiclyLoading open={true}/>;
  if (error) return <MagiclyError message={error.message} />;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getIndividualDocument = (key: any, document: any) => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.leftText}>
        <Grid item xs={1} lg={1} md={1} sm={1} style={{ maxWidth: '40px' }}>
          <InsertDriveFile fontSize={'large'} className={classes.toolIcon} />
        </Grid>
        <Grid item xs={10} lg={5} md={5} sm={10}>
          <Link href="documents/view/[id]" as={`documents/view/${document.id}`}>
            <span className={classes.link}>{document.name}</span>
          </Link>
        </Grid>
        <Grid item xs={1} lg={1} md={1} sm={1} className={classes.docType}>
          <Link href="documents/view/[id]" as={`documents/view/${document.id}`}>
            <span className={classes.type}>{document.type}</span>
          </Link>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <hr className={classes.horizontalLine} />
        </Grid>
      </Grid>
    );
  };

  if (data && data.documents && data.documents.edges && data.documents.edges.length > 0) {
    hasSavedDocuments = true;
    documents.push(
      <Grid item xs={12} lg={12} md={12} sm={12} xl={12} style={{ paddingBottom: '30px' }}>
        <MagiclyPageTitle
          title={'Saved Documents'}
        />
      </Grid>
    );

    data.documents.edges.forEach((document, key) => {
      documents.push(
        getIndividualDocument(
          key,
          document
        )
      );
    });
  }

  const getEmptyUI = () => {
    return (
      <Grid container justify="center" alignContent="center" alignItems="center">
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }} onClick={routePage.bind(this, 'home/documents/add')}>
          <AddAPhoto fontSize={'large'} className={classes.hugeIcon} />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center' }}>
          <span className={classes.tap}>click the camera icon to add a new document</span>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ textAlign: 'center', marginTop: '90px', marginBottom: '10px' }}>
          <span className={classes.someExamples}>some examples for inspiration</span>
        </Grid>
        <Grid container justify="center" alignContent="center" alignItems="center" className={classes.paper}>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- insurance papers</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- medical records</span>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ padding: '5px' }}>
            <span className={classes.examples}>- appliance manuals</span>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getMainUI = () => {
    if (hasSavedDocuments) {
      return (
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}>
          </Grid>

          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents/add')}>
              <MagiclyAddIconLabel />
            </div>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'home/documents/search')}>
              <MagiclySearchIconLabel />
            </div>
          </Grid>

          {documents}
        </Grid>
      );
    } else {
      return getEmptyUI();
    }
  };

  // TODO: CSS BUG where width extends past appBar width
  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(DocumentsPage);