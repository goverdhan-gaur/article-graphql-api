import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault} from '@apollo/server/plugin/landingPage/default';

import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schemas/schema.js';
import { resolvers } from './resolvers/Query.js';

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageProductionDefault()
  ],
  introspection: true
});

const server2 = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault()
  ],
  introspection: true
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

app.use(
  '/graphql-playground',
  expressMiddleware(server2),
);

await new Promise<void>((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
