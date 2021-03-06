const path = require('path');
const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

const { authMiddleware } = require('./utils/auth');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware

});


// integrate our Apollo server with the Express application as middleware
server.start().then(() => {
	server.applyMiddleware({ app });
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
// back-end server's code to serve up the React front-end code in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// WILDCARD GET ROUTE
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});



// const express = require('express');
// // import ApolloServer
// const { ApolloServer } = require('apollo-server-express');
// const { authMiddleware } = require('./utils/auth');

// // import our typeDefs and resolvers
// const { typeDefs, resolvers } = require('./schemas');
// const db = require('./config/connection');

// const PORT = process.env.PORT || 3001;
// const app = express();

// const startServer = async () => {
//   // create a new Apollo server and pass in our schema data
//   const server = new ApolloServer({ 
//     typeDefs, 
//     resolvers, 
//     context: authMiddleware 
//   });

  
//   // Start the Apollo server
//   // integrate our Apollo server with the Express application as middleware
// await server.start().then(() => {
// 	server.applyMiddleware({ app });
// });

//   // integrate our Apollo server with the Express application as middleware
//   server.applyMiddleware({ app });

//   // log where we can go to test our GQL API
//   console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
// };

// // Initialize the Apollo server
// startServer();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// db.once('open', () => {
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//   });
// });