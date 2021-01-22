/**
 * Mongoose model CRUD Snippet User.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Create a user schema.
const snippetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: '`{PATH}` is required!',
    trim: true,
    maxLength: [100, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [4, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  },
  code: {
    type: String,
    required: '`{PATH}` is required!',
    maxLength: [1000000, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a user schema.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    unique: true,
    trim: true,
    maxLength: [100, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [4, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  },
  password: {
    type: String,
    required: '`{PATH}` is required!',
    maxLength: [1000, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minLength: [6, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  },
  snippets: {
    type: [snippetSchema]
  }
}, {
  timestamps: true,
  versionKey: false
})

// Salts and hashes password before save.
//userSchema.pre('save', async function () {
//    this.password = await bcrypt.hash(this.password, 8)
//})

// Adds static method for salting and hashing password.
userSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 8)
  return hashedPassword
}

// Adds static method for authenticating user.
userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  // If no user is found or password is wrong, throw an error.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }

  // If user is found and password is correct - return the user.
  return user
}



// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
//export const Snippet = mongoose.model('Snippet', snippetSchema)
