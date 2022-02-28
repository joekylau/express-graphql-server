const {
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLSchema,
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql');
const { Author, Book } = require('./models')

const AuthorType = new GraphQLObjectType({
  name: 'AuthorType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parentValue, args) {
        const author = await parentValue.populate('books');
        return author.books;
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'BookType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    author: {
      type: AuthorType,
      async resolve(parentValue, args) {
        const book = await parentValue.populate('author');
        return book.author;
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    hello: {
      type: GraphQLString,
      args: {},
      resolve(parentValue, args) {
        return "Hell World"
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parentValue, args) {
        const author = await Author.findById(args.id);
        return author; 
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: {},
      async resolve(parentValue, args) {
        return await Author.find();
      }
    },
    book: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parentValue, args) {
        const book = await Book.findById(args.id);
        return book;
      }
    },
    books: {
      type: new GraphQLList(BookType),
      args: {},
      async resolve(parentValue, args) {
        return await Book.find();
      }
    }
  })
})

const AuthorInputType = new GraphQLInputObjectType({
  name: 'AuthorInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) }
  }
})

const BookInputType = new GraphQLInputObjectType({
  name: 'BookInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    authorId: { type: new GraphQLNonNull(GraphQLID) }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addAuthor: {
      type: AuthorType,
      args: {
        author: { type: AuthorInputType }
      },
      async resolve(parentValue, args) {
        // Create author
        const author = new Author(args.author);
        await author.save();

        return author;
      }
    },
    addBook: {
      type: BookType,
      args: {
        book: { type: BookInputType }
      },
      async resolve(parentValue, args) {
        // Create book
        const book = new Book(args.book);
        book.author = args.book.authorId;
        await book.save();

        // Update author's books reference
        const author = await Author.findById(args.book.authorId);
        author.books.push(book);
        await author.save();

        return book;
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})