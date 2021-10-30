import Link from 'next/link';
import Head from 'next/head';
import Date from '../components/date';
import { useState, useEffect } from 'react';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';

const useHook = () => {
  const [newJoke, setNewJoke] = useState(null);
  const [loading, setLoading] = useState(false);

  async function callAPI() {
    setLoading(true);
    const call = await fetch('https://icanhazdadjoke.com/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const toJSON = await call.json();
    setNewJoke(toJSON.joke);
    setLoading(false);
  }

  useEffect(() => {
    callAPI();
  }, []);

  return { newJoke, loading, callAPI };
};

export default function Home({ allPostsData }) {
  const { newJoke } = useHook();

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className={utilStyles.textCenter}>{newJoke || 'Incoming punchline ✌️'}</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
}
