/** @jsx h */
import { h } from 'preact';
import { useCurrentLWJEpisode } from '../hooks/use-current-lwj-episode.js';

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

        <div className="sponsors">
          <span>live captioning made possible by</span>
          <img
            src="https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1596391942/lwj/sponsors.png"
            alt="sponsors"
          />
        </div>
      </div>
    </div>
  );
}
