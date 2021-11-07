import { useEffect, useState } from 'preact/hooks';

export function useCurrentLWJEpisode() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [episode, setEpisode] = useState();

  useEffect(() => {
    async function loadEpisode() {
      if (!loading || episode) return;

      // if an episode is in progress, we still want to show it.
      const nowMinus3Hours = new Date().getTime() - 70 * 60 * 1000;
      const episode = await fetch('https://www.learnwithjason.dev/api/schedule')
        .then((res) => res.json())
        .then((episodes) => episodes[2])
        .catch((err) => {
          setError(err);
          setLoading(false);
        });

      setLoading(false);
      setEpisode({
        title: episode.title,
        slug: episode.slug.current,
        guest: episode.guest[0].name,
      });
    }

    loadEpisode();
  }, []);

  return { episode, loading, error };
}
