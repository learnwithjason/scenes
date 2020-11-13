/** @jsx h */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export function ConnectingTheDots() {
  const [guest, setGuest] = useState();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const qs = new URLSearchParams(window.location.search);
    setGuest(qs.get('guest'));
  }, []);

  return guest ? (
    <div className="content connecting-the-dots">
      <div className="host">
        <h2>
          <span>Jason Lengstorf</span>
        </h2>
      </div>
      <div className="guest">
        <h2>
          <span>{guest}</span>
        </h2>
      </div>
    </div>
  ) : null;
}
