import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { setContext } from "apollo-link-context";

const authLink = setContext((_, { headers }) => {
  let token = null;
  if (process.browser && localStorage) {
    token = localStorage.getItem('token');
  }

  //  TODO: when this goes stale, error on GRAPHQL
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-token': token ? token : "",
    }
  }
});

export default function createApolloClient(initialState, ctx) {
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: authLink.concat(new HttpLink({
      uri: process.env.GRAPHQL_URI, // must be absolute
      credentials: 'same-origin',
      fetch,
    })),
    cache: new InMemoryCache().restore(initialState),
  });
}