/** @jsx h */
import { h, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import { ConnectingTheDots } from '../scenes/connecting-the-dots.js';
import { CTDLowerThird } from '../components/ctd-lower-third.js';

export default function Scenes() {
  const [guest, setGuest] = useState();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const qs = new URLSearchParams(window.location.search);
    setGuest(qs.get('guest'));
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Connecting the Dots</title>
        <link rel="stylesheet" href="/styles/global.css" />
        <link rel="stylesheet" href="/styles/content.css" />
      </Helmet>
      <main className="overlay">
        <div className="top-bar" />
        <ConnectingTheDots guest={guest} />
        <div className="bottom-bar" />
        <CTDLowerThird guest={guest} />
      </main>
    </Fragment>
  );
}
