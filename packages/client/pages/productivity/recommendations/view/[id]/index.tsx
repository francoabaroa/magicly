import React, { useState } from 'react';
import Layout from '../../../../../components/Layout';
import { withApollo } from '../../../../../apollo/apollo';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import MagiclyPageTitle from '../../../../../components/shared/MagiclyPageTitle';
import DeleteListItemModal from '../../../../../components/productivity/DeleteListItemModal';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Notes from '@material-ui/icons/Notes';

const QUERY = gql`
  query GetListItem ($id: ID!) {
    listItem(id: $id) {
      id
      notes
      name
      type
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    deleteButton: {
      fontFamily: 'Overpass, serif',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
      },
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
    individualFeature: {
      textAlign: 'center',
      marginBottom: '15px',
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
    icon: {
      color: '#0A7EF2',
      fontSize: '14px',
    }
  }),
);

const ViewRecommendationItemPage = () => {
  const router = useRouter();
  const classes = useStyles();
  const { id } = router.query;
  const [deleteListItem, setDeleteListItem] = useState(false);
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  const getCapitalizedString = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const handleDeleteListItemOpen = () => {
    setDeleteListItem(true);
  };

  const handleDeleteListItemClose = () => {
    setDeleteListItem(false);
  };

  const getUI = (data: any) => {
    // TODO: adapt function if only required fields are passed, to show right things on the UI
    // TODO: add edit and delete functionality
    if (data && data.listItem) {
      return (
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item xs={8}>
            <MagiclyPageTitle
              title={data.listItem.name}
            />
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
          }
          <Grid item xs={7} lg={7} md={7} sm={7}>
            <Button
              onClick={handleDeleteListItemOpen}
              className={classes.deleteButton}
            >
              Delete
            </Button>
            <DeleteListItemModal
              listItem={data.listItem}
              openModal={deleteListItem}
              handleClose={handleDeleteListItemClose.bind(this)}
              pageUrl={'productivity/recommendations'}
            />
          </Grid>
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

export default withApollo({ ssr: false })(ViewRecommendationItemPage);