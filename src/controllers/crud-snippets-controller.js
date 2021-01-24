/**
 * Module for the CrudSnippetsController.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import { User } from '../models/crud-snippet.js'
import mongoose from 'mongoose'

/**
 * Encapsulates a controller.
 */
export class CrudSnippetsController {
  /**
   * Displays the index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      // Retrieve a random user from the database
      
      let featuredSnippet = {}
      for (let i = 0; i < 20; i++) {
        const randomUserArray = await User.aggregate([{ $sample: { size: 1 } }])
        const randomUserSnippets = randomUserArray[0].snippets
        if (randomUserSnippets.length > 0) {
          // Local random range function
          function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
          }

          const selectedSnippet = randomUserSnippets[getRndInteger(0, randomUserSnippets.length)]
          featuredSnippet.name = selectedSnippet.name
          featuredSnippet.code = selectedSnippet.code
          featuredSnippet.username = randomUserArray[0].username
          featuredSnippet.userid = randomUserArray[0]._id
          break
        }
      }
      //console.log(randomUser)
      const user = req.session.user
      res.render('crud-snippets/index', { user, featuredSnippet })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays the login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = req.session.user
      res.render('crud-snippets/login', { user })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logs out the user by destroying the session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async logout (req, res) {
    req.session.destroy()
    res.redirect('/login')
  }

  /**
   * Called when a user attempts to log in. Checks the validity of the entered
   * username and password. If the credentials are valid, the user is authenticated
   * with a session cookie and redirected.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
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
}
