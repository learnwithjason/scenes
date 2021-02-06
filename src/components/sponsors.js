import { h } from 'preact';
import { useSponsors } from '../hooks/use-sponsors.js';

export function Sponsors() {
  const sponsors = useSponsors();

  return (
    <div class="sponsors">
      <span>live captioning made possible by</span>
      <div class="logos">
        {sponsors.map((sponsor) => (
          <img key={sponsor.url} src={sponsor.image} alt={sponsor.name} />
        ))}
      </div>
    </div>
  );
}
