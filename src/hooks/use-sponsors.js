import { useState, useEffect } from 'preact/hooks';

export function useSponsors() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetch('https://www.learnwithjason.dev/api/sponsors')
      .then((res) => res.json())
      .then((data) => setSponsors(data));
  }, []);

  return sponsors;
}
