/**
 * Mongoose model CRUD Snippet application User (with schema for Snippet subdocument).
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Create a schema for the Snippet subdocuments.
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
    minLength: [3, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a User schema.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: '`{PATH}` is required!',
    unique: true,
    trim: true,
    maxlength: [100, '`{PATH}` ({VALUE}) exceeds the limit of ({MAXLENGTH}) characters.'],
    minlength: [4, '`{PATH}` ({VALUE}) is beneath the limit ({MINLENGTH}) characters.']
  },
  password: {
    type: String,
    required: '`{PATH}` is required!'
  },
  snippets: { // The User's collection of Snippets.
    type: [snippetSchema]
  }
}, {
  timestamps: true,
  versionKey: false
})

/**
 * Adds static method for salting and hashing the password. ALWAYS call
 * when registering a new user or changing a user's password!
 *
 * @param {string} password - The unhashed password.
 * @returns {string} - The bcrypt-hashed and salted password.
 */
userSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 8)
  // Throw error if entered password is not within max and min length
  if (password.length > 200) {
    throw Error('The password exceeds the limit of 200 characters.')
  } else if (password.length < 6) {
    throw Error('The password is beneath the limit of 6 characters.')
  }
  return hashedPassword
}

/**
 * Static method for authenticating user.
 *
 * @param {string} username - The entered username.
 * @param {string} password - The entered password.
 * @returns {object} - The authenticated user's Mongoose model.
 */
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
