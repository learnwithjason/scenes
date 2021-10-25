/** @jsx h */
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  createSocketStudioClient,
  SocketStudioProvider,
} from '@socket-studio/preact';
import { Content } from '../scenes/content.js';
import { LowerThird } from '../components/lower-third.js';
import { SocketStudioOverlays } from '../components/socket-studio-overlays.js';

export default () => {
  const client = createSocketStudioClient(process.env.TOAST_SOCKET_STUDIO_URL);
  const [isBrowser] = useState(typeof window !== 'undefined');

  return (
    <Fragment>
      <Helmet>
        <title>Learn With Jason Scenes Powered By Stream Blitz</title>
        <link rel="stylesheet" href="/styles/global.css" />
        <link rel="stylesheet" href="/styles/content.css" />
      </Helmet>
      <SocketStudioProvider client={client}>
        <main className="overlay">
          {/* <div className="top-bar" /> */}
          <Fragment>
            {isBrowser ? (
              <Router>
                <Content />
                <SocketStudioOverlays />
              </Router>
            ) : null}
            {/* <div className="bottom-bar" /> */}
            <LowerThird />
          </Fragment>
        </main>
      </SocketStudioProvider>
    </Fragment>
  );
};
