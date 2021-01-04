import { h } from 'preact';
import { useEmoteCount } from '../hooks/use-emote-count.js';
import { CorgiStampede } from './corgi-stampede.js';

import { Stampede } from './stampede.js';

export function EmoteCounter() {
  const { ref, count, state } = useEmoteCount();

  return (
    <div>
      <div
        ref={ref}
        id="emote-counter"
        className="hidden"
        style={{
          position: 'absolute',
          top: '5%',
          right: 20,
        }}
      >
        <div className="emote-banner">
          <div className="emote">
            <img src="https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/party-corgi.gif" />
          </div>
          <svg viewBox="0 0 300 45" className="emote-message">
            <text y="32" x="150">
              corgi count: {count}
            </text>
          </svg>
        </div>
      </div>
      {(state === 'starting' || state === 'running') && <Stampede />}
      {state === 'running' && <CorgiStampede />}
    </div>
  );
}
