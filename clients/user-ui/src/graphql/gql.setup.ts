import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_URI,
});

export const graphqlClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});