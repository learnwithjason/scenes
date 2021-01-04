/** @jsx h */
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTwitchChat } from '@socket-studio/preact';
import { useBoop } from '../hooks/use-boop.js';

export function BoopDrop() {
  const { chat } = useTwitchChat(process.env.TOAST_TWITCH_CHANNEL);
  const { boopRef, addBoop } = useBoop();

  useEffect(() => {
    if (!window) {
      return;
    }

    const [message] = chat.slice(-1);
    if (!message || !message.emotes) return;

    message.emotes.forEach((emote) => {
      if (emote.name === 'jlengsBOOP') {
        emote.locations.forEach(() => addBoop());
      }
    });
  }, [chat.length]);

  return (
    <canvas
      ref={boopRef}
      style={{
        height: 570,
        left: 0,
        position: 'absolute',
        top: 0,
        width: 1280,
      }}
    />
  );
}
