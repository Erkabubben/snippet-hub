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

  async remove (req, res, next) {
    try {
      const user = req.session.user
      res.render('crud-snippets/user-current-snippets-remove', { user })
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      // Create a new snippet...
      const userID = req.session.user._id
      const user = await User.findById(userID)
      user.snippets.id(req.params.snippetid).remove()
      // ...save the user to the database...
      await user.save()
      req.session.user = user
      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'The snippet was deleted.' }
      res.redirect('/users/' + req.session.user._id)
    } catch (error) {
      next(error)
    }
  }

  async edit (req, res, next) {
    try {
      const dbUser = await User.findById(req.session.user._id)
      const snippet = dbUser.snippets.id(req.params.snippetid)
      const snippetName = snippet.name
      const snippetCode = snippet.code
      const user = req.session.user
      res.render('crud-snippets/user-current-snippets-edit', { user, snippetName, snippetCode })
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      // Create a new snippet...
      const userID = req.session.user._id
      const user = await User.findById(userID)
      const snippet = user.snippets.id(req.params.snippetid)
      snippet.name = req.body.name
      snippet.code = req.body.code
      // ...save the user to the database...
      await user.save()
      req.session.user = user
      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'The code snippet was updated.' }
      res.redirect('/users/' + req.session.user._id)
    } catch (error) {
      next(error)
    }
  }
}
