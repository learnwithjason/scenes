/** @jsx h */
import { h, Fragment } from 'preact';
import { Helmet } from 'react-helmet';
import { Logo } from './logo.js';
import { FCCLogo } from './fcc-logo.js';

export function CTDLowerThird({ guest = 'Guest Name' }) {
  return (
    <Fragment>
      <Helmet>
        <link rel="stylesheet" href="/styles/lower-third.css" />
      </Helmet>
      <div className="lower-third ctd">
        <Logo />
        <FCCLogo />
        <div className="ctd-details">
          <h1>Connecting the Dots:</h1>
          <p>How {guest} built a great career in tech</p>
        </div>
      </div>
    </Fragment>
  );
}
