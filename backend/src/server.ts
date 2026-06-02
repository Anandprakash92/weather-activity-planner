import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';

const yoga = createYoga({ 
  schema,
  landingPage: true // Enables GraphiQL exploration interface in local development environments
});

const server = createServer(yoga);

const PORT = 9000;
server.listen(PORT, () => {
  console.info(`GraphQL Yoga engine executing deployment at http://localhost:${PORT}/graphql`);
});