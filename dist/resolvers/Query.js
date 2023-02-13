import { articles } from "../db.js";
export const resolvers = {
    Query: {
        article: () => articles,
        firstPageArticles: () => {
            return articles.slice(0, 30);
        },
        retrievePageArticles: (parent, { page }, context) => {
            const startFrom = 30 * page;
            return articles.slice(startFrom, startFrom + 30);
        }
    },
};
