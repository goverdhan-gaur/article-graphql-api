import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const typeDefs = `#graphql
    type Query {
        books: [Book!]!
        author: [Author!]!
    }

    type Book {
        id: ID!
        title: String!
        author: Author!
    }

   type Author {
        id: ID!
        name: String!
        books: [Book!]!
    }
`;
const books = [
    {
        id: "b1",
        title: 'Book One',
        author: 'Sahil'
    },
    {
        id: "b1",
        title: 'Book Three',
        author: 'Sahil'
    },
    {
        id: "b1",
        title: 'Book Four',
        author: 'Sahil'
    },
    {
        id: "b2",
        title: 'Book Two',
        author: 'Shivani'
    }
];
const authors = [
    {
        id: "a1",
        name: 'Sahil'
    },
    {
        id: "a2",
        name: 'Shivani'
    }
];
const resolvers = {
    Query: {
        books: () => books,
        author: () => authors
    },
    Author: {
        books: (parent, _args, context) => {
            const { name } = parent;
            return books.filter(book => book.author === name);
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log(url);
