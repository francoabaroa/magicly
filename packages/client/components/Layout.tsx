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
  const shouldDisplayBackButton = router.pathname === '/' || router.pathname === '/main' ? false : true;
  return (
  <div>
      <AppBar signedInUser={data && data.me ? data.me : null} />
      {shouldDisplayBackButton ?
        <Button onClick={() => router.back()}>{'< Back'}</Button> :
        null
      }

    {props.children}
  </div>
  )};

export default Layout;