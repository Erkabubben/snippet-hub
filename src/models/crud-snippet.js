/**
 * Mongoose model PureNumber.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
/* const schema = new mongoose.Schema({
  value: {
    type: Number,
    required: '`{PATH}` is required!',
    max: [42, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  }
}, {
  timestamps: true,
  versionKey: false
}) */

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    trim: true,
    maxLength: [100, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [3, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  },
  password: {
    type: String,
    required: '`{PATH}` is required!',
    maxLength: [1000, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [6, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
export const CrudSnippet = mongoose.model('CrudSnippet', schema)
