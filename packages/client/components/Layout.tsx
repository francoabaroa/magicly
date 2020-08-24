import Link from 'next/link';
import AppBar from './AppBar';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const QUERY = gql`
  query GetMe {
    me {
      id
      firstName
      lastName
      email
      homeworks {
        title
        status
      }
    }
  }
`;

const Layout = (props) => {
  const { data, loading, error, refetch } = useQuery(QUERY);
  return (
  <div>
      <AppBar signedInUser={data && data.me ? data.me : null} />
    {props.children}
    {/* <ul>
      <li>
        <Link href="/">
          <a>Landing Page</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
      <li>
        <Link href="/blog">
          <a>Blog</a>
        </Link>
      </li>
      <li>
        <Link href="/features">
          <a>Features</a>
        </Link>
      </li>
      <li>
        <Link href="/mission">
          <a>Mission</a>
        </Link>
      </li>
      <li>
        <Link href="/plans">
          <a>Pricing</a>
        </Link>
      </li>
      <li>
        <Link href="/support">
          <a>Support</a>
        </Link>
      </li>
      <li>
        <Link href="/terms">
          <a>Terms</a>
        </Link>
      </li>
      <li>
        <Link href="/settings">
          <a>Settings</a>
        </Link>
      </li>
      <li>
        <Link href="/signup">
          <a>Sign Up</a>
        </Link>
      </li>
      <li>
        <Link href="/signin">
          <a>Sign In</a>
        </Link>
      </li>
    </ul> */}
  </div>
  )};

export default Layout;