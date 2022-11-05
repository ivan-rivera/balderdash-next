import Layout from "../components/layout/Layout";
import { MantineProvider } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        fontFamily: "Inter, serif",
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
        rel="stylesheet"
      />
      <Layout>
        <Head>
          <title>Balderdash!</title>
          <meta
            name="description"
            content="Balderdash the game. Play with your friends, your vocabulary and bluff your way to victory!"
          />
          <meta
            name="keywords"
            content="balderdash, game, bluff, vocabulary, fictionary"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </MantineProvider>
  );
}

export default MyApp;
