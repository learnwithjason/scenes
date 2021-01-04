/** @jsx h */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useSoundEffect } from '../hooks/use-sound-effect.js';

let Splitting;

const customEffects = {};

function DefaultEffectDisplay({ state, effect }) {
  const [caption, setCaption] = useState('');
  const { author, command } = effect;

  useEffect(() => {
    async function loadSplitting() {
      if (!author || !command) {
        return;
      }

      if (!Splitting) {
        const importedModule = await import('/web_modules/splitting.js');
        Splitting = importedModule.default;
      }

      // doing it this way avoids an issue where Splitting and React get
      // out of sync and end up duplicating text
      const htmlToSplit = `
        <div class="command-text" data-splitting>
          <span class="username">${author.username}</span>
          <span class="text">redeemed</span>
          <span class="effect">${command.name}</span>
        </div>
      `;

      setCaption(Splitting.html({ content: htmlToSplit, by: 'chars' }));
    }

    loadSplitting();
  }, [author, command]);

  return (
    <div
      className={`command-display ${
        ['starting', 'active'].includes(state) ? 'visible' : ''
      }`}
    >
      {command.image && (
        <img className="command-image" src={command.image} alt="" />
      )}
      <div dangerouslySetInnerHTML={{ __html: caption }} />
    </div>
  );
}

export function Effects() {
  const state = useSoundEffect();

  // don’t show anything if we’re idle or don’t have a valid command
  if (
    state.value === 'idle' ||
    !state.context.current ||
    !state.context.current.command
  ) {
    return;
  }

  const commandName = state.context.current.command.name;

  let EffectDisplay = DefaultEffectDisplay;
  if (customEffects.hasOwnProperty(commandName)) {
    EffectDisplay = customEffects[commandName];
  }

  return <EffectDisplay state={state.value} effect={state.context.current} />;
}
