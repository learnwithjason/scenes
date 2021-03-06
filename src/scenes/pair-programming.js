/** @jsx h */
import { h } from 'preact';
import { useCurrentLWJEpisode } from '../hooks/use-current-lwj-episode.js';

export function PairProgramming() {
  const { episode, loading } = useCurrentLWJEpisode();

  return loading ? null : (
    <div className="content">
      <div className="desktop"></div>
      <div className="videos">
        <div className="guest">
          <h2>
            <span>{episode.guest}</span>
          </h2>
        </div>
        <div className="host">
          <h2>
            <span>Jason Lengstorf</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
