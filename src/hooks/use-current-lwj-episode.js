import { useEffect, useState } from 'preact/hooks';

export function useCurrentLWJEpisode() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [episode, setEpisode] = useState();

  useEffect(() => {
    async function loadEpisode() {
      if (!loading || episode) return;

      // if an episode is in progress, we still want to show it.
      const nowMinus3Hours = new Date().getTime() - 180 * 60 * 1000;
      const episode = await fetch(
        'https://vnkupgyb.apicdn.sanity.io/v1/graphql/production/default',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query ($date: DateTime!) {
                allEpisodes(where: { date_gte: $date }) {
                  title
                  slug {
                    current
                  }
                  date
                  guest {
                    name
                  }
                }
              }
            `,
            variables: {
              date: new Date(nowMinus3Hours).toISOString(),
            },
          }),
        },
      )
        .then((res) => res.json())
        .then((res) =>
          res.data.allEpisodes
            // sort by date so the next episode is first
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            // grab the first episode
            .find(Boolean),
        )
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
