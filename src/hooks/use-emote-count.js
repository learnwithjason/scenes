import { useEffect, useRef } from 'preact/hooks';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import { useTwitchChat } from '@socket-studio/preact';

const getEmoteCount = (countableEmotes, message) => {
  const isCountable = (emote) => countableEmotes.includes(emote.name);
  const matchingEmotes = message.emotes
    ? message.emotes.filter(isCountable)
    : [];

  const count = matchingEmotes.reduce((total, emote) => {
    const emoteCount = emote && emote.locations && emote.locations.length;
    return total + emoteCount || 0;
  }, 0);

  return count;
};

const BARK =
  typeof window !== 'undefined'
    ? new Audio(
        'https://res.cloudinary.com/jlengstorf/video/upload/e_loop:2/v1573662421/lwj-sfx/bark.mp3',
      )
    : null;
const CORGI_PARADE_SONG =
  typeof window !== 'undefined'
    ? new Audio(
        'https://res.cloudinary.com/jlengstorf/video/upload/so_25.8,eo_33.2,e_volume:-80/v1573608942/lwj-sfx/busybody.mp3',
      )
    : null;

let counterTimeout;

const emoteCountMachine = Machine(
  {
    id: 'emote-count',
    initial: 'idle',
    context: {
      element: null,
      count: 0,
      newEmotes: 0,
      trigger: 50,
      cooldown: 20000,
      emotes: ['jlengsCorgi', 'chrisb24PartyCorgi'],
    },
    states: {
      idle: {
        on: {
          CHAT_MESSAGE: {
            actions: 'updateCount',
            target: 'updating',
          },
        },
      },
      updating: {
        on: {
          '': [
            {
              cond: (context) => {
                const shouldShowCounter =
                  context.newCount > 0 && context.count < context.trigger;
                return shouldShowCounter;
              },
              target: 'counter-visible',
            },
            {
              cond: (context) => context.count >= context.trigger,
              target: 'starting',
            },
            {
              target: 'idle',
            },
          ],
        },
      },
      'counter-visible': {
        invoke: {
          src: (context) => {
            return new Promise((resolve) => {
              context.element.classList.remove('hidden');
              context.element.classList.add('visible');

              clearTimeout(counterTimeout);
              counterTimeout = setTimeout(() => {
                context.element.classList.add('hidden');

                setTimeout(() => {
                  context.element.classList.remove('visible');
                  resolve();
                }, 500);
              }, 4000);
            });
          },
          onDone: 'hiding',
        },
        on: {
          CHAT_MESSAGE: {
            actions: 'updateCount',
          },
        },
      },
      hiding: {
        on: {
          '': [
            {
              cond: (context) => context.count >= context.trigger,
              target: 'starting',
            },
            {
              target: 'idle',
            },
          ],
        },
      },
      starting: {
        invoke: {
          src: () =>
            new Promise((resolve) => {
              BARK.play();
              setTimeout(() => resolve(), 3000);
            }),
          onDone: 'running',
        },
      },
      running: {
        entry: assign({ count: 0 }),
        invoke: {
          src: () =>
            new Promise((resolve) => {
              CORGI_PARADE_SONG.play();
              setTimeout(() => {
                resolve();
              }, 10000);
            }),
          onDone: 'cooldown',
        },
      },
      cooldown: {
        invoke: {
          src: (context) =>
            new Promise((resolve) => setTimeout(resolve, context.cooldown)),
          onDone: 'idle',
        },
      },
    },
  },
  {
    actions: {
      updateCount: assign((context, { element, message }) => {
        const newCount = getEmoteCount(context.emotes, message);

        return {
          element,
          newCount,
          count: context.count + newCount,
        };
      }),
    },
  },
);

export const useEmoteCount = () => {
  const ref = useRef();
  const { chat } = useTwitchChat(process.env.TOAST_TWITCH_CHANNEL);
  const [message] = chat.slice(-1);
  const [state, send] = useMachine(emoteCountMachine);

  useEffect(() => {
    if (!message || !message.emotes) return;

    send({ type: 'CHAT_MESSAGE', element: ref.current, message });
  }, [message, ref]);

  return { ref, count: state.context.count, state: state.value };
};
