import Link from 'next/link';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { withApollo } from '../../../apollo/apollo';
import Cookies from 'js-cookie';

import { HOME_WORK_STATUS } from '../../../constants/appStrings';

// todo: missing executionDate cause of date bug
const QUERY = gql`
  query GetMyHomeworks {
    me {
      id
      firstName
      lastName
      email
      homeworks {
        id
        title
        status
        type
        notificationType
        keywords
        cost
        costCurrency
        notes
        executor
      }
    }
  }
`;

const HomeWorkPage = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(QUERY);

  let pastWork: Array<any> = [];
  let upcomingWork: Array<any> = [];
  let hasHomeWork: boolean = false;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!Cookies.get('signedin')) {
    // navigate('/')
  }

  if (data && data.me && data.me.homeworks) {
    hasHomeWork = true;
    data.me.homeworks.forEach((homework, key) => {
      if (homework.status === HOME_WORK_STATUS.PAST) {
        pastWork.push(<p key={key}>{homework.title + ' - ' + homework.type}</p>);
      } else {
        upcomingWork.push(<p key={key}>{homework.title + ' - ' + homework.type}</p>);
      }
    });
  }

  const viewHomeWork = () => {};

  const getMainUI = (
    hasHomeWork: boolean,
    pastWork: Array<any>,
    upcomingWork: Array<any>
  ) => {
    if (hasHomeWork) {
      return (
        <div>
          <ul>
            <li>
              <Link href="/home/work/add">
                <a>Home Work Add</a>
              </Link>
            </li>
            <li>
              <Link href="/home/work/view">
                <a>Home Work View</a>
              </Link>
            </li>
          </ul>
          <h1>Upcoming</h1>
          { upcomingWork }
          <h1>Past</h1>
          { pastWork }
        </div>
      );
    } else {
      return (
        <ul>
          <li>
            <Link href="/home/work/add">
              <a>Home Work Add</a>
            </Link>
          </li>
        </ul>
      );
    }
  }

  return (
    <Layout>
      <h1>HomeWork Page</h1>
      {/* <pre>Data: {JSON.stringify(data)}</pre>
      <button onClick={() => refetch()}>Refetch</button> */}
      { getMainUI(hasHomeWork, pastWork, upcomingWork) }
    </Layout>
  );
};

export default withApollo({ ssr: false })(HomeWorkPage);