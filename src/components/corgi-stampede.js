import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

function getEmoteURL(publicID) {
  return `https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_100/${publicID}`;
}

const emotes = [
  getEmoteURL('party-corgi'),
  getEmoteURL('jlengstorfcorgi'),
  getEmoteURL('chris-biscorgi'),
];

const MAXIMUM_CORGIS = 60;

const Corgi = ({ src, jumpDelay, style = {} }) => (
  <div className="corgi" style={style}>
    <img src={src} alt="" style={{ animationDelay: `${jumpDelay}ms` }} />
  </div>
);

export function CorgiStampede() {
  const [corgis, setCorgis] = useState([]);

  useEffect(() => {
    let corgiSettings = [];
    for (let i = 0; i < MAXIMUM_CORGIS; i++) {
      const duration = Math.round(Math.random() * 3000) + 2000;
      corgiSettings.push({
        duration,
        runDelay: Math.round(Math.random() * 4000),
        jumpDelay: Math.round(Math.random() * duration),
        top: Math.round(Math.random() * 100),
      });
    }

    const components = corgiSettings
      // move the highest-positioned corgis to the back
      .sort((a, b) => a.top - b.top)
      // actually create the DOM element
      .map((settings, i) => {
        const imgIndex = Math.abs(
          Math.round(Math.random() * emotes.length - 1),
        );
        const { duration, runDelay, jumpDelay, top } = settings;

        return (
          <Corgi
            key={`corgi-${i}`}
            src={emotes[imgIndex]}
            jumpDelay={jumpDelay}
            style={{
              '--scale': (top / 100) * 0.5 + 0.5,
              animationDelay: `${runDelay}ms`,
              animationDuration: `${duration}ms`,
              top,
              zIndex: i + 1,
            }}
          />
        );
      });

    setCorgis(components);
  }, []);

  return <div className="corgi-stampede">{corgis}</div>;
}
