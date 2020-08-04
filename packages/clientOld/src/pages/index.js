import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>Home Page!</h1>
      <div>
        <Link href="/features"><a>Features</a></Link>
      </div>
      <div>
        <Link href="/pricing"><a>Pricing</a></Link>
      </div>
      <div>
        <Link href="/mission"><a>Mission</a></Link>
      </div>
      <div>
        <Link href="/blog"><a>Blog</a></Link>
      </div>
      <div>
        <Link href="/about"><a>About</a></Link>
      </div>
      <div>
        <Link href="/support"><a>Support</a></Link>
      </div>
    </div>
  )
}