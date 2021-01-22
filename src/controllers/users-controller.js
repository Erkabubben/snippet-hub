/**
 * Module for the UsersController.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import moment from 'moment'
import mongoose from 'mongoose'
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
      const user = req.session.user
      res.render('crud-snippets/user-new', { user })
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      // Create a new user...
      const hashedPassword = await User.hashPassword(req.body.password)
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      })

      // ...save the user to the database...
      await user.save()

      // ...and redirect and show a message.
      req.session.flash = { type: 'success', text: 'A new user was created!' }
      res.redirect('/')
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

  async show (req, res, next) {
    try {
      
      const viewedProfileID = req.params.userid
      //const userID = req.session.user._id
      //const user = await User.findById(userID)
      if (req.session.user && (req.params.userid === req.session.user._id)) {
        //const profileID = req.params.userid
        //const user = req.session.user
        const user = req.session.user
        res.render('crud-snippets/user-current-profile', { user, viewedProfileID })
      } else {
        const user = req.session.user
        if (mongoose.Types.ObjectId.isValid(viewedProfileID)) {
          const otherUser = await User.findById(viewedProfileID)
          if (otherUser !== null) {
            console.log(otherUser.username)
            res.render('crud-snippets/user-other-profile', { user, otherUser, viewedProfileID })
          } else {
            const error = new Error ('404 Not Found')
            error.statusCode = 404
            throw error
          }
        } else {
          const error = new Error ('404 Not Found')
          error.statusCode = 404
          throw error
        }
      }
    } catch (error) {
      next(error)
    }
  }

}
