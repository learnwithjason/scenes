/** @jsx h */
import { h } from 'preact';
import {
  createClient,
  Provider,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from '@urql/preact';
import fetch from 'isomorphic-fetch';
import ws from 'isomorphic-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export function createSocketStudioClient(url) {
  const isClient = typeof window !== 'undefined';

  const wsUrl = url.replace(/^http/, 'ws');
  const subscriptionClient = isClient
    ? new SubscriptionClient(
        wsUrl,
        {
          reconnect: true,
        },
        ws,
      )
    : false;

  const exchanges = [dedupExchange, cacheExchange, fetchExchange];

  // ignore the subscription exchange during builds. this causes warnings, but
  // subscriptions don’t work server-side and this prevents a crash
  if (isClient) {
    exchanges.push(
      subscriptionExchange({
        forwardSubscription(operation) {
          return subscriptionClient.request(operation);
        },
      }),
    );
  }

  return createClient({ url, exchanges, fetch });
}

export function SocketStudioProvider({ children, client }) {
  return h(Provider, { value: client }, children);
}
