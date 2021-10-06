import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>API Amaliyah Robithoh Murid</title>
        <meta name="description" content="API Endpoint for Amaliyah Robithoh Murid Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <img className={styles.logo} src="/arm.svg"/>
        <h1 className={styles.title}>API Amaliyah Robithoh Murid</h1>
        <button>
          <Link href="/admin/amaliyah">
            <a className="p-2 block m-2 mt-5 rounded bg-white px-5">Dashboard</a>
          </Link>
        </button>
      </main>

    </div>
  )
}
