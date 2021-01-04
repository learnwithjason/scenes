/** @jsx h */
import { h, Fragment } from 'preact';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { BeardGame } from './beard-game.js';
import { BoopDrop } from './boop-drop.js';
import { Effects } from './effects.js';
import { EmoteCounter } from './emote-counter.js';

const SCENES_WITH_SIDE_VIDEO = ['/monologue', '/interview'];

export function StreamBlitzOverlays() {
  const location = useLocation();
  const rightVideo = SCENES_WITH_SIDE_VIDEO.includes(location.pathname);

  return (
    <Fragment>
      <Helmet>
        <link rel="stylesheet" href="/styles/stream-blitz-overlays.css" />
      </Helmet>
      <div className="stream-blitz-overlays">
        <BeardGame rightVideo={rightVideo} />
        <BoopDrop />
        <Effects />
        <EmoteCounter />
      </div>
    </Fragment>
  );
}
