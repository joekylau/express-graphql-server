const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

mongoose.connect('mongodb+srv://joelau:8pqGMxKP6v7BZeeg@cluster0.trgl2.mongodb.net/storedb?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');