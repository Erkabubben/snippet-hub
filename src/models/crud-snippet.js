/**
 * Mongoose model PureNumber.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    trim: true,
    unique: true,
    maxLength: [100, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [4, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  },
  password: {
    type: String,
    required: '`{PATH}` is required!',
    maxLength: [1000, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [8, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Salts and hashes password before save.
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
