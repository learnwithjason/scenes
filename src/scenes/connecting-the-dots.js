/** @jsx h */
import { h } from 'preact';

export function ConnectingTheDots({ guest = 'Set a Guest Name' }) {
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
