/** @jsx h */
import { h } from 'preact';
import { useCurrentLWJEpisode } from '../hooks/use-current-lwj-episode.js';
import { Sponsors } from './sponsors.js';

export function Details() {
  const { episode, loading } = useCurrentLWJEpisode();

  return loading ? null : (
    <div className="details">
      <h1 id="episode-title">{episode.title}</h1>

      <div className="rotator">
        <div className="schedule">
          <p>
            see past and upcoming episodes at{' '}
            <strong>learnwithjason.dev</strong>
          </p>
        </div>

        <div className="captions">
          <p>
            visit <strong>lwj.dev/live</strong> to access live captions by White
            Coat Captioning
          </p>
        </div>

        <Sponsors />
      </div>
    </div>
  );
}
