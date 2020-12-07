import Link from 'next/link';
import React from 'react';
import Layout from '../../../../../components/Layout';
import { withApollo } from '../../../../../apollo/apollo';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Notes from '@material-ui/icons/Notes';
import Build from '@material-ui/icons/Build';
import AttachMoney from '@material-ui/icons/AttachMoney';

const QUERY = gql`
  query GetDocumentUrl ($id: ID!) {
    getDocumentAndUrl(id: $id) {
      url
      document {
        id
        name
        notes
        docValue
        homework {
          id
          title
        }
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
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    docDetails: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'bold',
      fontSize: '24px',
      color: '#002642',
      marginTop: '25px',
      marginBottom: '5px',
      margin: 'auto',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        marginTop: '15px',
        marginBottom: '0px',
      },
    },
    individualFeature: {
      textAlign: 'center',
      marginBottom: '5px',
    },
    details: {
      color: '#0A7EF2',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '24px',
      margin: 'auto',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    detailsUnderlined: {
      color: '#0A7EF2',
      fontFamily: 'Playfair Display, serif',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '24px',
      margin: 'auto',
      textDecoration: 'underline',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
      },
    },
    icon: {
      color: '#0A7EF2',
      fontSize: '14px',
    },
    imagePreview: {
      width: '500px',
      height: '200px',
    },
    thumb: {
      height: '200px',
      margin: 'auto',
      width: '50%',
      border: '3px solid #840032',
      backgroundPosition: 'top top',
      backgroundSize: 'cover',
      borderRadius: '30px',
      '&:hover': {
        height: '300px',
      },
      marginBottom: '0px',
      [theme.breakpoints.down('xs')]: {
        width: '350px',
        height: '140px',
      },
    }
  }),
);

const ViewDocumentPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  }

  const openInNewWindow = (url: string) => {
    window.open(url);
  }

  const getCapitalizedString = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const getUI = (data: any) => {
    // TODO: adapt function if only required fields are passed, to show right things on the UI
    // TODO: add edit and delete functionality
    if (data && data.getDocumentAndUrl && data.getDocumentAndUrl.url) {
      let homework = null;
      if (data.getDocumentAndUrl.document.homework && data.getDocumentAndUrl.document.homework.id) {
        homework = data.getDocumentAndUrl.document.homework;
      }
      return (
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center">
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>{data.getDocumentAndUrl.document.name}</h1>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <div
              key={id.toString()}
              onClick={openInNewWindow.bind(this, data.getDocumentAndUrl.url)}
              style={{ backgroundImage: `url('${data.getDocumentAndUrl.url}')` }}
              className={classes.thumb}>
            </div>
          </Grid>

          {
            homework !== null ?
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <div className={classes.individualFeature}>
                  <Build fontSize={'small'} className={classes.icon} />
                  <span className={classes.detailsUnderlined} onClick={routePage.bind(this, `home/work/view/${homework.id}`)}>{homework.title}</span>
                </div>
              </Grid> :
              null
          }

          {
            data.getDocumentAndUrl.document.docValue ?
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <div className={classes.individualFeature}>
                  <AttachMoney fontSize={'small'} className={classes.icon} />
                  <span className={classes.details}>{data.getDocumentAndUrl.document.docValue}</span>
                </div>
              </Grid> :
              null
          }

          {
            data.getDocumentAndUrl.document.notes.length > 0 ?
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <div className={classes.individualFeature}>
                  <Notes fontSize={'small'} className={classes.icon} />
                  <span className={classes.details}>{data.getDocumentAndUrl.document.notes}</span>
                </div>
              </Grid> :
              null
          }

          <Grid item xs={8} style={{ paddingTop: '0px'}}>
            <p style={{ fontSize: '14px', textAlign: 'center', marginTop: '0px' }}>Click the preview above to see the full image.</p>
          </Grid>

          <Grid item xs={8}>
            <p style={{fontSize: '12px', textAlign: 'center'}}>To protect you and your data, the image at <a target="_blank" href={data.getDocumentAndUrl.url}>this link</a> will only be available for 15 minutes. Please refresh the page for a new link.</p>
          </Grid>
          {/* <Grid item xs={8}>
            <h1 className={classes.title}> {data.listItem.name}</h1>
          </Grid>
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <div className={classes.individualFeature}>
              <Add fontSize={'small'} style={{ color: '#0A7EF2' }} />
              <span className={classes.details}>{data.listItem.type}</span>
            </div>
          </Grid>
          {
            data.listItem.notes && data.listItem.notes.length > 0 ?
              <Grid item xs={7} lg={7} md={7} sm={7}>
                <div className={classes.individualFeature}>
                  <Notes fontSize={'small'} className={classes.icon} />
                  <span className={classes.details}>{data.listItem.notes}</span>
                </div>
              </Grid> :
              null
          } */}
        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout>
      {getUI(data)}
    </Layout>
  );
};

export default withApollo({ ssr: false })(ViewDocumentPage);