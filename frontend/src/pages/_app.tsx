import '../styles/globals.css';
import type { AppProps } from 'next/app';
import NoSsr from 'react-no-ssr';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSsr>
      <Component {...pageProps} />
    </NoSsr>
  );
}
