import Layout from "../components/layout/Layout";
import { MantineProvider } from "@mantine/core";

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
        <Component {...pageProps} />
      </Layout>
    </MantineProvider>
  );
}

export default MyApp;
