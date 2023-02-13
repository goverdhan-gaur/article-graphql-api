export const typeDefs = `#graphql
    type Query {
        article: [Article!]!,
        firstPageArticles: [Article!]!
        retrievePageArticles(page: Int): [Article!]!
    }

    type Article {
        id: ID!,
        author: String,
        createdAt: String,
        score: Int,
        updatedAt: String,
        title: String,
        text: String,
        type: String,
        url: String
    }
`;