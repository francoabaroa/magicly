import Link from 'next/link';
import AppBar from './AppBar';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

const Layout = (props) => {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(QUERY);
  let signedInUser = null;

  if (data && data.me) {
    signedInUser = data.me;
  } else if (router && router.query && router.query.me && typeof router.query.me === 'string') {
    signedInUser = JSON.parse(router.query.me);
  } else {
    signedInUser = null;
  }

  return (
  <div>
      <AppBar signedInUser={signedInUser} />
    {props.children}
  </div>
  )};

export default Layout;