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

const url = process.env.TOAST_STREAM_BLITZ_URL;
const wsUrl = url.replace(/^http/, 'ws');

const isClient = typeof window !== 'undefined';

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

const client = createClient({ url, exchanges, fetch });

export const GraphQLProvider = ({ children }) => (
  <Provider value={client}>{children}</Provider>
);
