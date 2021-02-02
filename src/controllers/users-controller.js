/**
 * Module for the UsersController (RESTful methods for the Users collection).
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { User } from '../models/crud-snippet.js'

/**
 * Encapsulates a controller.
 */
export class UsersController {
  /**
   * Displays a form for registering a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async new (req, res, next) {
    try {
      const user = req.session.user
      res.render('crud-snippets/user-new', { user })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new User based on the form content and adds to the Users collection
   * in the database.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      // Hashes the entered password and creates a new User based on the form data.
      const hashedPassword = await User.hashPassword(req.body.password)
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      })
      // Saves the user to the database.
      await user.save()
      // Redirects and shows a flash message.
      req.session.flash = { type: 'success', text: 'A new user has been registered.' }
      res.redirect('../login')
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      const user = req.session.user
      res.render('crud-snippets/user-new', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value,
        user
      })
    }
  }

  /**
   * Displays a user's personal profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async show (req, res, next) {
    try {
      const viewedProfileID = req.params.userid
      // Render current user's profile if the userid of the displayed page corresponds with id of session user.
      if (req.session.user && (req.params.userid === req.session.user._id)) {
        const user = req.session.user
        res.render('crud-snippets/user-current-profile', { user, viewedProfileID }) // Render View with controls for editing available
      } else {
        const user = req.session.user
        // Otherwise check if the id of viewed profile is a valid ObjectId.
        if (mongoose.Types.ObjectId.isValid(viewedProfileID)) {
          const userFromMongoDB = await User.findById(viewedProfileID)
          // If a user with corresponding id is found in the database, render that user's profile.
          if (userFromMongoDB !== null) {
            // Create object based on User model.
            const otherUserSnippets = []
            userFromMongoDB.snippets.forEach(element => {
              const e = {
                name: element.name,
                code: element.code
              }
              otherUserSnippets.push(e)
            })
            const otherUser = {
              username: userFromMongoDB.username,
              snippets: otherUserSnippets
            }
            res.render('crud-snippets/user-other-profile', { user, otherUser, viewedProfileID }) // Render View without controls for editing
          /* Display 404 if userid in URL has no document in user database */
          } else {
            const error = new Error('404 Not Found')
            error.statusCode = 404
            throw error
          }
        /* Display 404 if userid in URL is not valid ObjectID */
        } else {
          const error = new Error('404 Not Found')
          error.statusCode = 404
          throw error
        }
      }
    } catch (error) {
      next(error)
    }
  }
}
