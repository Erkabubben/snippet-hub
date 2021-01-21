/**
 * Module for the UsersController.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import moment from 'moment'
import { User } from '../models/crud-snippet.js'

/**
 * Encapsulates a controller.
 */
export class UsersController {

  authorizeGeneral (req, res, next) {
    if (!req.session.user) {
      const error = new Error ('Forbidden')
      error.statusCode = 404
      return next(error)
    }

    next()
  }


  async new (req, res, next) {
    try {
      const session = req.session.user
      res.render('crud-snippets/user-new', { session })
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      // Create a new user...
      const user = new User({
        username: req.body.username,
        password: req.body.password
      })

      // ...save the user to the database...
      await user.save()

      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'A new user was created!' }
      res.redirect('/')
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      const session = req.session.user
      res.render('crud-snippets/user-new', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value,
        session
      })
    }
  }

  async show (req, res, next) {
    try {
      const user = req.session.user
      const profileID = req.params.userid
      if (user && profileID === user._id) {
        res.render('crud-snippets/user-current-profile', { user, profileID })
      } else {
        res.render('crud-snippets/user-profile', { user, profileID })
      }
    } catch (error) {
      next(error)
    }
  }

}
