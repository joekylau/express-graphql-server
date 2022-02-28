const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = Schema({
  name: String,
  age: Number,
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

authorSchema.post('findOneAndDelete', async function(doc) {
  await mongoose.model('Book').deleteMany({ author: doc._id });
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
