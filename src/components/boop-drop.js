/** @jsx h */
import { h } from 'preact';
import { useBoop } from '../hooks/use-boop.js';

export function BoopDrop() {
  const boopBox = useBoop();

  return (
    <canvas
      ref={boopBox}
      style={{
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
      }}
    />
  );
}
