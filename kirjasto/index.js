const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
//var _ = require('lodash')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const config = require('./utils/config')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

console.log('connecting to', config.MONGODB_URI_LIBRARY)

mongoose.connect(config.MONGODB_URI_LIBRARY, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
  username: String!
  favoriteGenre: String!
  id: ID!
  }

  type Token {
  value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  } 
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author, genres: { $in: [args.genre] } }) //why i can put the whole author object instead of ID?
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author })
      } else if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } })
      } else {
        return Book.find({})
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: (root) => {
      let res = Author.findById(root.author)
      return res
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const existingAuthor = await Author.findOne({ name: args.author })
      if (!existingAuthor) {
        const author = new Author({ name: args.author, bookCount: 1 })
        const book = new Book({ ...args, author: author })
        try {
          await author.save()
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      } else {
        existingAuthor.bookCount += 1
        const book = new Book({ ...args, author: existingAuthor })
        try {
          await existingAuthor.save()
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      let authorToEdit = await Author.findOne({ name: args.name })
      if (authorToEdit) {
        try {
          authorToEdit.born = args.setBornTo
          await authorToEdit.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return authorToEdit
      } else {
        authorToEdit = null
        return authorToEdit
      }
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl  }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
