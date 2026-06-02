"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const graphql_yoga_1 = require("graphql-yoga");
const schema_1 = require("./graphql/schema");
const yoga = (0, graphql_yoga_1.createYoga)({
    schema: schema_1.schema,
    landingPage: true // Enables GraphiQL exploration interface in local development environments
});
const server = (0, node_http_1.createServer)(yoga);
const PORT = 9000;
server.listen(PORT, () => {
    console.info(`GraphQL Yoga engine executing deployment at http://localhost:${PORT}/graphql`);
});
