/** @jsx h */
import { h, Fragment } from 'preact';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { BeardGame } from './beard-game.js';
import { BoopDrop } from './boop-drop.js';
import { Effects } from './effects.js';
import { EmoteCounter } from './emote-counter.js';
import { Submarine } from './submarine.js';

const SCENES_WITH_SIDE_VIDEO = ['/monologue', '/interview'];

export function SocketStudioOverlays() {
  const location = useLocation();
  const rightVideo = SCENES_WITH_SIDE_VIDEO.includes(location.pathname);

  return (
    <Fragment>
      <Helmet>
        <link rel="stylesheet" href="/styles/socket-studio-overlays.css?v2" />
      </Helmet>
      <div className="socket-studio-overlays">
        <Submarine />
        <BeardGame rightVideo={rightVideo} />
        <BoopDrop />
        <Effects />
        <EmoteCounter />
      </div>
    </Fragment>
  );
}
