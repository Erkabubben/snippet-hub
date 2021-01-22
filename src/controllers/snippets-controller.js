/**
 * Module for the SnippetsController.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import { User } from '../models/crud-snippet.js'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {

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
      const user = req.session.user
      res.render('crud-snippets/user-current-snippets-new', { user })
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      // Create a new snippet...
      const userID = req.session.user._id
      const user = await User.findById(userID)
      user.snippets.push({
        name: req.body.name,
        code: req.body.code
      })

      // ...save the user to the database...
      await user.save()
      req.session.user = user

      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'A new snippet was created!' }
      res.redirect('/users/' + req.session.user._id)
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      const user = req.session.user
      res.render('crud-snippets/user-current-snippets-new', {
        validationErrors: [error.message] || [error.errors.value.message],
        user
      })
    }
  }
}
