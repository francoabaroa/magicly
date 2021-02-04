import React, { useState } from 'react';
import Layout from '../../../../../components/Layout';
import { withApollo } from '../../../../../apollo/apollo';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import MagiclyLoading from '../../../../../components/shared/MagiclyLoading';
import MagiclyError from '../../../../../components/shared/MagiclyError';
import MagiclyPageTitle from '../../../../../components/shared/MagiclyPageTitle';
import MagiclyEditIconLabel from '../../../../../components/shared/MagiclyEditIconLabel';
import MagiclySearchIconLabel from '../../../../../components/shared/MagiclySearchIconLabel';
import ListItemRow from '../../../../../components/productivity/ListItemRow';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const QUERY = gql`
  query GetList ($id: ID!) {
    list(id: $id) {
      id
      name
      type
      listItems {
        id
        name
        type
        complete
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
    individualFeature: {
      textAlign: 'center',
      marginBottom: '15px',
    },
    icon: {
      color: 'rgba(0, 38, 66, 0.8)',
      fontSize: '14px',
    }
  }),
);

const ViewShoppingListPage = (props) => {
  const router = useRouter();
  const classes = useStyles();
  let listItems: Array<any> = [];
  let hasSavedListItems: boolean = false;
  const { id } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { id },
  });

  if (loading) return <MagiclyLoading open={true} />;
  if (error && id) {
    // TODO: temp, because on initial load router.query is undefined
    return <MagiclyError message={error.message} />;
  } else if (error) {
    return <MagiclyLoading open={true} />;
  }

  const getCapitalizedString = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined, { shallow: true });
  };

  const getIndividualListItem = (key: any, listItem: any) => {
    return (
      <ListItemRow
        key={key}
        listItem={listItem}
        isShoppingList={true}
      />
    );
  };

  if (data && data.list && data.list.listItems && data.list.listItems.length > 0) {
    hasSavedListItems = true;

    listItems.push(
      <Grid item xs={12} lg={12} md={12} sm={12} xl={12} style={{ paddingBottom: '30px' }}>
        <MagiclyPageTitle
          title={data.list.name}
        />
      </Grid>
    );

    data.list.listItems.forEach((listItem, key) => {
      listItems.push(
        getIndividualListItem(
          key,
          listItem
        )
      );
    });
  }

  const getMainUI = () => {
    if (hasSavedListItems) {
      return (
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Grid item lg={12} sm={12} xs={12} md={12} className={classes.emptyMarginTopBlock}>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, `productivity/shopping/edit/${data.list.id}`)}>
              <MagiclyEditIconLabel />
            </div>
          </Grid>
          <Grid item xs={4} lg={5} md={5} sm={5}>
            <div className={classes.individualFeature} onClick={routePage.bind(this, 'productivity/shopping/search')}>
              <MagiclySearchIconLabel />
            </div>
          </Grid>

          {listItems}

        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout>
      {getMainUI()}
    </Layout>
  );
};

export default withApollo({ ssr: false })(ViewShoppingListPage);