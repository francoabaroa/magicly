import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { createUploadLink } from 'apollo-upload-client';

export default function createApolloClient(initialState, ctx) {
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    //@ts-ignore
    link: createUploadLink({
      uri: process.env.GRAPHQL_URI, // must be absolute
      credentials: 'include',
      fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  });
}