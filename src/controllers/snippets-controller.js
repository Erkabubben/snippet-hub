/**
 * Module for the SnippetsController (RESTful methods for the Snippets collection).
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import { User } from '../models/crud-snippet.js'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Displays a form for creating a new code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async new (req, res, next) {
    try {
      const user = req.session.user
      res.render('crud-snippets/user-current-snippets-new', { user })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new snippet based on the form content and adds it to the user's snippets
   * array in the database. The user is then redirected.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    try {
      // Retrieve the User model from the database and add the new snippet.
      const userID = req.session.user._id
      const user = await User.findById(userID)
      user.snippets.push({
        name: req.body.name,
        code: req.body.code
      })

      // Save the updated User model to the database and update the User model in the session storage.
      await user.save()
      req.session.user = user

      // Redirect and show a flash message.
      req.session.flash = { type: 'success', text: 'A new code snippet was created.' }
      res.redirect('../')
    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
      const user = req.session.user
      res.render('crud-snippets/user-current-snippets-new', {
        validationErrors: [error.message] || [error.errors.value.message],
        user
      })
    }
  }

  /**
   * Displays a page asking the user to confirm that he/she wants to delete the snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async remove (req, res, next) {
    try {
      const user = req.session.user
      const userDB = await User.findById(user._id)
      const snippetDB = userDB.snippets.id(req.params.snippetid)
      const snippet = {
        id: snippetDB._id,
        name: snippetDB.name,
        code: snippetDB.code
      }
      res.render('crud-snippets/user-current-snippets-remove', { user, snippet })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a user's code snippet from the database, then redirects the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      // Retrieve the User model from the database and delete the snippet.
      const userID = req.session.user._id
      const user = await User.findById(userID)
      user.snippets.id(req.params.snippetid).remove()
      // Save the updated User model to the database and update the User model in the session storage.
      await user.save()
      req.session.user = user
      // Redirect and show a flash message.
      req.session.flash = { type: 'success', text: 'The snippet was deleted.' }
      res.redirect('../../')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a form for editing an existing code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async edit (req, res, next) {
    try {
      // Retrieve the User model and snippet from the database.
      const dbUser = await User.findById(req.session.user._id)
      const snippet = dbUser.snippets.id(req.params.snippetid)
      // Handlebars variables setup.
      const snippetID = req.params.snippetid
      const snippetName = snippet.name
      const snippetCode = snippet.code
      const user = req.session.user
      // Render form.
      res.render('crud-snippets/user-current-snippets-edit', { user, snippetName, snippetCode, snippetID })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves and updates a user's code snippet, stores the updated User model
   * in the database, then redirects the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      // Retrieve the User model from the database.
      const userID = req.session.user._id
      const user = await User.findById(userID)
      // Find the snippet subdocument in the snippets array and update it based on form data.
      const snippet = user.snippets.id(req.params.snippetid)
      snippet.name = req.body.name
      snippet.code = req.body.code
      // Save the updated User model to the database and update the User model in the session storage.
      await user.save()
      req.session.user = user
      // Redirect and show a flash message.
      req.session.flash = { type: 'success', text: 'The code snippet was updated.' }
      res.redirect('../../')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a specified code snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async show (req, res, next) {
    try {
      const user = req.session.user
      const viewedProfileID = req.params.userid
      // Retrieve the User model of the current page from the database.
      const viewedProfileUserDB = await User.findById(viewedProfileID)
      const snippetDB = viewedProfileUserDB.snippets.id(req.params.snippetid)
      // Create snippet object based on MongoDB data
      const snippet = {
        name: snippetDB.name,
        code: snippetDB.code,
        _id: snippetDB._id
      }
      // Create viewedProfileUser object based on MongoDB data
      const viewedProfileUser = {
        username: viewedProfileUserDB.username,
        _id: viewedProfileUserDB._id
      }
      if (user && req.params.userid === user._id) { // If the displayed snippet belongs to the logged in user, display with edit/delete buttons
        res.render('crud-snippets/user-current-snippets-show', { user, viewedProfileUser, snippet })
      } else { // Otherwise, the snippet can only be viewed and not edited.
        res.render('crud-snippets/user-snippets-show', { user, viewedProfileUser, snippet })
      }
    } catch (error) {
      next(error)
    }
  }
}
