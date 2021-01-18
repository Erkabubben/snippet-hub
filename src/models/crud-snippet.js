/**
 * Mongoose model PureNumber.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  value: {
    type: Number,
    required: '`{PATH}` is required!',
    max: [42, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
export const CrudSnippet = mongoose.model('CrudSnippet', schema)
