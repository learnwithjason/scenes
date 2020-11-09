/** @jsx h */
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { drawCircles } from '../util/circle-animation.js';

export function Logo() {
  const ref = useRef();
  useEffect(() => {
    const loop = setInterval(() => drawCircles(ref.current), 100);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="logo">
      <img
        src="https://res.cloudinary.com/jlengstorf/image/upload/f_auto,q_auto/v1589157815/lwj/logo-dark.svg"
        alt="Learn With Jason"
      />
      <canvas ref={ref}></canvas>
    </div>
  );
}
