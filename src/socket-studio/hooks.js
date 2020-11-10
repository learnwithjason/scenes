import { useState } from 'preact/hooks';
import { useSubscription as useSubscriptionUrql } from '@urql/preact';

export function useTwitchChat(channel) {
  const [chat, setChat] = useState([]);
  const [commands, setCommands] = useState([]);
  const [currentCommand, setCurrentCommand] = useState();

  if (!channel) {
    throw new Error('useTwitchChat requires a channel to be set');
  }

  const useSubscription =
    typeof window !== 'undefined' ? useSubscriptionUrql : () => [{}];

  useSubscription(
    {
      query: `
        subscription TwitchMessages ($channel: String!) {
          message(channel: $channel) {
            time
            emotes {
              name
              locations
              images {
                large
              }
            }

            ... on TwitchChatCommand {
              command
              args
              handler {
                message
                audio
                image
                duration
              }
            }

            ... on TwitchChatMessage {
              html
            }

            message
            author {
              username
              roles
            }
          }
        }
      `,
      variables: { channel },
    },
    (_, response) => {
      if (response.message.command) {
        setCommands([...commands, response.message]);
        setCurrentCommand(response.message);
      } else {
        setChat([...chat, response.message]);
      }
    },
  );

  return { chat, commands, currentCommand };
}
