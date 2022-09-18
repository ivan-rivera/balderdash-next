import Layout from "../components/Layout";
import { MantineProvider } from '@mantine/core';

function MyApp({ Component, pageProps }) {
  return (
      <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
            fontFamily: "Inter, serif",
          }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=optional" rel="stylesheet"/>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
  )
}

export default MyApp
