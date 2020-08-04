import Link from 'next/link';

const Layout = (props) => (
  <div>
    <ul>
      <li>
        <Link href="/">
          <a>No SSR</a>
        </Link>
      </li>
      <li>
        <Link href="/ssr">
          <a>SSR</a>
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
        <Link href="/pricing">
          <a>Pricing</a>
        </Link>
      </li>
      <li>
        <Link href="/support">
          <a>Support</a>
        </Link>
      </li>
    </ul>
    {props.children}
  </div>
);

export default Layout;