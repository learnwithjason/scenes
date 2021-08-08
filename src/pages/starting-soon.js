/** @jsx h */
import { h, Fragment } from 'preact';
import { Helmet } from 'react-helmet';
import { useCurrentLWJEpisode } from '../hooks/use-current-lwj-episode.js';

export default function StartingSoon() {
  const { episode, loading } = useCurrentLWJEpisode();

  return loading ? null : (
    <Fragment>
      <Helmet>
        <style>
          {`
            html,
            body {
              margin: 0;
            }
          `}
        </style>
      </Helmet>
      <div className="content starting-soon">
        <img
          src={`https://www.learnwithjason.dev/${episode.slug}/starting-soon.jpg`}
          alt="Starting Soon"
        />
      </div>
    </Fragment>
  );
}
