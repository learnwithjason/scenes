/** @jsx h */
import { h, Fragment } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import { useTwitchChat } from '@socket-studio/preact';

const VALID_COMMANDS = ['grow', 'shave', 'flap'];
const INCREMENT = 10;
const BEARD_LENGTH_DEFAULT = 110;

let timeout;
let flapTimeout;

const Notifications = ({ command }) => {
  const ref = useRef();

  useEffect(() => {
    const cmd = command && command.command;
    if (!cmd || !VALID_COMMANDS.includes(cmd)) {
      return;
    }

    const rotation = Math.random() * 0.2 - 0.1;
    const drift = rotation > 0 ? rotation + 0.05 : rotation - 0.05;

    const word = document.createElement('div');
    word.classList.add('notification');
    word.style.setProperty('--angle-start', `${rotation}turn`);
    word.style.setProperty('--angle-end', `${drift}turn`);
    word.style.setProperty('--scale', `${drift}turn`);
    word.setAttribute('data-splitting', true);
    word.innerText = `${cmd}!`;

    ref.current.appendChild(word);

    async function splitByCharacters() {
      const splitting = await import('splitting');

      splitting({ by: 'chars' });
    }

    splitByCharacters();

    setTimeout(() => {
      if (ref.current) {
        ref.current.removeChild(word);
      }
    }, 2000);
  }, [command]);

  return <div ref={ref} />;
};

export function BeardGame() {
  const ref = useRef();
  const { command } = useTwitchChat('jlengstorf');

  useEffect(() => {
    const beard = ref.current.querySelector('.beard');
    beard.style.height = `${BEARD_LENGTH_DEFAULT}px`;
  }, []);

  useEffect(() => {
    if (!command) {
      return;
    }

    const cmd = command.command || {};

    if (!VALID_COMMANDS.includes(cmd)) {
      return;
    }

    const jason = ref.current;
    jason.classList.add('visible');

    const beard = jason.querySelector('.beard');
    const currentLength = parseInt(beard.style.height);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      jason.classList.remove('visible');
      beard.style.height = `${BEARD_LENGTH_DEFAULT}px`;
      beard.classList.remove('rainbow');
    }, 8000);

    if (cmd === 'flap') {
      jason.classList.add('flap');

      clearTimeout(flapTimeout);
      flapTimeout = setTimeout(() => {
        jason.classList.remove('flap');
      }, 2000);

      return;
    }

    if (cmd === 'grow') {
      beard.classList.remove('none');

      if (currentLength + INCREMENT >= BEARD_LENGTH_DEFAULT * 2) {
        beard.classList.add('rainbow');
      }

      beard.style.height = `${currentLength + INCREMENT}px`;
    }

    if (cmd === 'shave') {
      if (currentLength - INCREMENT <= BEARD_LENGTH_DEFAULT * 2) {
        beard.classList.remove('rainbow');
      }

      if (currentLength < BEARD_LENGTH_DEFAULT) {
        beard.classList.add('none');
        return;
      }

      beard.style.height = `${current - INCREMENT}px`;
    }
  }, [command]);

  return (
    <Fragment>
      <Helmet>
        <link
          rel="stylesheet"
          href="/web_modules/splitting/dist/splitting.css"
        />
        <link rel="stylesheet" href="/styles/beard-game.css" />
      </Helmet>
      <div className="beard-game">
        <div className="foreground">
          <Notifications command={command} />
          <div className="jason" ref={ref}>
            <div className="head">
              <div className="neck"></div>
              <div className="eye left"></div>
              <div className="eye right"></div>
              <div className="ear"></div>
              <div className="beard"></div>
              <div className="mouth"></div>
            </div>
            <div className="body"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
