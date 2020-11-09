import { useQuery } from '@urql/preact';

export function useTwitchChannelInfo(channel) {
  if (!channel) {
    throw new Error('useTwitchChannelInfo requires a channel to be set');
  }

  const [result] = useQuery({
    query: `
      query TwitchChannelInfo ($channel: String!) {
        channel(username: $channel) {
          username
          status
          stream {
            title
            startTime
          }
        }
      }
    `,
    variables: { channel },
  });

  return result;
}
