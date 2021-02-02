import Link from 'next/link';
import React from 'react';
import Layout from '../Layout';

const MagiclyError = (props) => {
  if (props.hideLayout) {
    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Oops! An error occurred</h1>
        <h2 style={{ textAlign: 'center', marginTop: '50px' }}>{'Error: ' + props.message}</h2>
        <h2 style={{ textAlign: 'center' }}>
          <Link href="/">
            <a>Return to Magicly</a>
          </Link>
        </h2>
      </div>
    );
  }

  return (
    <Layout>
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Oops! An error occurred</h1>
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>{'Error: ' + props.message}</h2>
      <h2 style={{ textAlign: 'center' }}>
        <Link href="/">
          <a>Return to Magicly</a>
        </Link>
      </h2>
    </Layout>
  );
}

export default MagiclyError;