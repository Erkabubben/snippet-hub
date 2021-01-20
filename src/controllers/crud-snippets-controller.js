/**
 * Module for the CrudSnippetsController.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import moment from 'moment'
import { User } from '../models/crud-snippet.js'

/**
 * Encapsulates a controller.
 */
export class CrudSnippetsController {

  authorizeGeneral (req, res, next) {
    if (!req.session.user) {
      const error = new Error ('Forbidden')
      error.statusCode = 404
      return next(error)
    }

    next()
  }

  /*checkIfLoggedIn (req) {
    if (!req.session.user) {
      return false
    } else {
      return true
    }
  }*/

  /**
   * Displays a list of pure numbers.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        //pureNumbers: (await PureNumber.find({}))
        //  .map(pureNumber => ({
        //    id: pureNumber._id,
        //    createdAt: moment(pureNumber.createdAt).fromNow(),
        //    value: pureNumber.value
        //  pureNumbers: 1
        //  }))
        //  .sort((a, b) => a.value - b.value)
      }
      if (false) {
        
      } else {
        //res.redirect('/login')
      }
      const user = req.session.user
      res.render('crud-snippets/index', { viewData, user })
    } catch (error) {
      next(error)
    }
  }

  async login (req, res, next) {
    try {
      const viewData = {
        //pureNumbers: (await PureNumber.find({}))
        //  .map(pureNumber => ({
        //    id: pureNumber._id,
        //    createdAt: moment(pureNumber.createdAt).fromNow(),
        //    value: pureNumber.value
        //  pureNumbers: 1
        //  }))
        //  .sort((a, b) => a.value - b.value)
      }
      const user = req.session.user
      res.render('crud-snippets/login', { user })
    } catch (error) {
      next(error)
    }
  }

  async logout (req, res, next) {
    req.session.destroy()
    res.redirect('/')
  }

  async loginPost (req, res, next) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate(() => {})
      req.session.user = user
      res.redirect('/users/' + user._id)
    } catch (error) {
      next(error)
    }
  }

  async usersNew (req, res, next) {
    try {
      const user = req.session.user
      res.render('crud-snippets/usersNew', { user })
    } catch (error) {
      next(error)
    }
  }

  async userCreate (req, res, next) {
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
      const user = req.session.user
      res.render('crud-snippets/usersNew', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value,
        user
      })
    }
  }

  /**
   * Returns a HTML form for creating a new pure number.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
//  async new (req, res) {
//    const viewData = {
//      value: undefined
//    }
//    res.render('pure-numbers/new', { viewData })
//  }

  /**
   * Creates a new pure number.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
//  async create (req, res) {
//    try {
      // Create a new pure number...
//      const pureNumber = new PureNumber({
//        value: req.body.value
//      })

      // ...save the number to the database...
//      await pureNumber.save()

      // ...and redirect and show a message.
//      req.session.flash = { type: 'success', text: 'The pure number was saved successfully.' }
//      res.redirect('.')
//    } catch (error) {
      // If an error, or validation error, occurred, view the form and an error message.
//      res.render('pure-numbers/new', {
//        validationErrors: [error.message] || [error.errors.value.message],
//        value: req.body.value
//      })
//    }
//  }
}
