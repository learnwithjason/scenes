/** @jsx h */
import { h } from 'preact';
import { useCurrentLWJEpisode } from '../hooks/use-current-lwj-episode.js';

export function Interview() {
  const { episode, loading } = useCurrentLWJEpisode();

  return loading ? null : (
    <div className="content interview">
      <div className="host">
        <h2>
          <span>Ben Hong</span>
        </h2>
      </div>
      <div className="guest">
        <h2>
          <span>{episode.guest}</span>
        </h2>
      </div>
    </div>
  );
}
