import React from 'react';
import AppBar from '../components/AppBar';
import AppContainer from '../components/AppContainer';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Index = () => {
  const router = useRouter();

  if (Cookies.get('signedin')) {
    router.push('/main', undefined);
  }

  return (
    <Layout>
      <h1>This should be rendered on client side</h1>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Index);