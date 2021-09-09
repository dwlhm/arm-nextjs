import Head from 'next/head'
import Image from 'next/image'
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
        <h2 className={styles.desc}>404 | This page could not be found.</h2>
      </main>

    </div>
  )
}
