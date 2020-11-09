/** @jsx h */
import { h, Fragment } from 'preact';
import { Helmet } from 'react-helmet';
import { Logo } from './logo.js';
import { Details } from './details.js';
import { Chat } from './chat.js';

export function LowerThird() {
  return (
    <Fragment>
      <Helmet>
        <link rel="stylesheet" href="/styles/lower-third.css" />
      </Helmet>
      <div className="lower-third">
        <Logo />
        <Details />
        <Chat />
      </div>
    </Fragment>
  );
}
