import { useEffect } from 'preact/hooks';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import { useTwitchChat } from '@socket-studio/preact';

const formatCommand = (msg) => {
  const { duration, message, audio, image } = msg?.handler || {};

  if (!message && !audio && !image) {
    return {};
  }

  return {
    author: msg.author,
    command: {
      name: msg.command,
      message,
      audio,
      image,
      duration: duration * 1000, // convert seconds to milliseconds
    },
  };
};

const handleQueue = {
  ADD_TO_QUEUE: {
    actions: 'commandAddToQueue',
  },
};

const COMMAND_ASSET_CACHE = {};

const commandMachine = Machine(
  {
    id: 'commands',
    initial: 'idle',
    context: {
      current: {},
      queue: [],
    },
    states: {
      idle: {
        on: {
          ADD_TO_QUEUE: {
            actions: 'commandSetCurrent',
            target: 'loadingCommandAssets',
          },
        },
      },
      loadingCommandAssets: {
        on: handleQueue,
        invoke: {
          src: 'commandLoadAssets',
          onDone: 'starting',
          onError: 'error',
        },
      },
      starting: {
        on: handleQueue,
        after: {
          TRANSITION_DURATION: 'active',
        },
      },
      active: {
        entry: 'commandPlayAudio',
        on: handleQueue,
        after: {
          COMMAND_DURATION: 'stopping',
        },
      },
      stopping: {
        on: handleQueue,
        after: {
          TRANSITION_DURATION: 'checkingForQueuedCommands',
        },
        exit: assign({ current: {} }),
      },
      checkingForQueuedCommands: {
        on: {
          ...handleQueue,
          '': [
            {
              cond: (context) => context.queue.length > 0,
              target: 'startNextCommand',
            },
            { target: 'idle' },
          ],
        },
      },
      startNextCommand: {
        on: {
          ...handleQueue,
          '': {
            actions: 'commandGetNextFromQueue',
            target: 'loadingCommandAssets',
          },
        },
      },
      error: {
        entry: (context, event) => console.error({ context, event }),
        on: {
          ...handleQueue,
          '': [
            {
              cond: (context) => context.queue.length > 0,
              target: 'startNextCommand',
            },
            { target: 'idle' },
          ],
        },
      },
    },
  },
  {
    actions: {
      commandSetCurrent: assign({
        current: (_context, event) => {
          const cmd = formatCommand(event.command);
          console.log({ event, cmd });
          return cmd;
        },
      }),
      commandAddToQueue: assign({
        queue: (context, event) => {
          const cmd = formatCommand(event.command);
          console.log({ event, cmd, context, queue: true });
          return [...context.queue, cmd];
        },
      }),
      commandGetNextFromQueue: assign({
        current: (context) => context.queue[0],
        queue: (context) => context.queue.slice(1),
      }),
      commandPlayAudio: (context) => {
        console.log({ context });
        if (!context.current.command?.audio) {
          return;
        }

        const sfx = COMMAND_ASSET_CACHE[context.current.command.audio];

        console.log({ sfx });
        sfx.play();
      },
    },
    services: {
      commandLoadAssets: (context) => {
        const imagePromise = new Promise((resolve, reject) => {
          const { image } = context.current.command;

          if (!image) {
            resolve(true);
            return;
          }

          if (COMMAND_ASSET_CACHE[image]) {
            resolve(COMMAND_ASSET_CACHE[image]);
            return;
          }

          const img = new Image();

          img.onload = () => {
            COMMAND_ASSET_CACHE[image] = img;
            resolve(img);
          };

          img.onerror = (err) => {
            console.error(err);
            reject(err);
          };

          img.src = image;
        });

        const soundPromise = new Promise((resolve, reject) => {
          const { audio } = context.current.command;

          if (!audio) {
            resolve(true);
            return;
          }

          if (COMMAND_ASSET_CACHE[audio]) {
            resolve(COMMAND_ASSET_CACHE[audio]);
            return;
          }

          const sfx = new Audio();

          sfx.addEventListener('canplaythrough', () => {
            COMMAND_ASSET_CACHE[audio] = sfx;
            resolve(sfx);
          });

          sfx.onerror = (err) => {
            console.error(err);
            reject(err);
          };

          sfx.src = audio;
        });

        return Promise.all([imagePromise, soundPromise]);
      },
    },
    delays: {
      TRANSITION_DURATION: 600,
      COMMAND_DURATION: (context) => {
        return context.current.command.duration ?? 4000;
      },
    },
  },
);

export function useSoundEffect(config) {
  const { currentCommand: command } = useTwitchChat(
    process.env.TOAST_TWITCH_CHANNEL,
  );
  const [state, send] = useMachine(commandMachine, config);

  useEffect(() => {
    if (
      !command ||
      !command.handler ||
      (!command.handler?.message &&
        !command.handler?.audio &&
        !command.handler?.image)
    )
      return;

    send({ type: 'ADD_TO_QUEUE', command });
  }, [command]);

  return state;
}
