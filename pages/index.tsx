import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.blueText}>
      <Head>
        <title>Abiodun Freeman - Portfolio</title>
        <meta name="description" content="Portfolio of Abiodun Freeman" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="home-main">
        <h1>HOME</h1>
      </main>
    </div>
  );
};

export default Home;
