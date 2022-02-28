const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = Schema({
  title: String,
  price: Number,
  author: { type: Schema.Types.ObjectId, ref: 'Author' }
});

bookSchema.post('findOneAndDelete', async function(doc) {
  const author = await mongoose.model('Author').findById(doc.author);
  author.books.pull({ _id: doc._id });
  await author.save();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
