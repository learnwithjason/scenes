/** @jsx h */
import { h, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  createSocketStudioClient,
  SocketStudioProvider,
} from '@socket-studio/preact';
// } from './socket-studio/index.js';
import { LowerThird } from './components/lower-third.js';
import { StreamBlitzOverlays } from './components/stream-blitz-overlays.js';
import { ConnectingTheDots } from './scenes/connecting-the-dots.js';
import { CTDLowerThird } from './components/ctd-lower-third.js';

export default ({ children }) => {
  const client = createSocketStudioClient(process.env.TOAST_SOCKET_STUDIO_URL);
  const [isBrowser] = useState(typeof window !== 'undefined');
  const [isCTD, setIsCTD] = useState(false);

  useEffect(() => {
    const url = new URL(window.location);

    setIsCTD(url.pathname === '/connecting-the-dots');
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Learn With Jason Scenes Powered By Stream Blitz</title>
        <link rel="stylesheet" href="/styles/global.css" />
        <link rel="stylesheet" href="/styles/content.css" />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.14.2/matter.js"
          integrity="sha512-gYH92QFYJSMUZ5sOAtkAyyShHFf8cipWjMHVWD9f4244kx3xeSn7cUcep4UxaHCKwTKU/Nzq5Lk0EkbuQGkeSg=="
          crossorigin="anonymous"
        ></script>
      </Helmet>
      <SocketStudioProvider client={client}>
        <main className="overlay">
          <div className="top-bar" />
          {isCTD ? (
            <Fragment>
              <ConnectingTheDots />
              <div className="bottom-bar" />
              <CTDLowerThird />
            </Fragment>
          ) : (
            <Fragment>
              {isBrowser ? (
                <Router>
                  {children}
                  <StreamBlitzOverlays />
                </Router>
              ) : null}
              <div className="bottom-bar" />
              <LowerThird />
            </Fragment>
          )}
        </main>
      </SocketStudioProvider>
    </Fragment>
  );
};
