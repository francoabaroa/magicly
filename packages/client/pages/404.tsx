import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import { withApollo } from '../apollo/apollo';

const NotFoundPage = () => {
  return (
    <Layout>
      <h1 style={{textAlign: 'center'}}>Oops! Page not found</h1>
      <h2 style={{textAlign: 'center'}}>
        <Link href="main">
          Return to Magicly
        </Link>
      </h2>
    </Layout>
  );
};

export default withApollo({ ssr: false })(NotFoundPage);