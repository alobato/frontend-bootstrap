import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const graphqlUri = import.meta.env.VITE_GRAPHQL_URI ?? `${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/graphql`;

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUri,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
