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

const graphql = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageProductionDefault()
  ],
  introspection: true
});

const playground = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault()
  ],
  introspection: true
});

await graphql.start();
await playground.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(graphql, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

app.use(
  '/graphql-playground',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(playground, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

app.get("/", (req, res) => {
  res.send("Welcome you to Article Graphql API")
})

await new Promise<void>((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
