/**
 * Routes specific to the CRUD Snippets application.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { CrudSnippetsController } from '../controllers/crud-snippets-controller.js'
import { Authorize } from './authorize.js'

export const router = express.Router()

const controller = new CrudSnippetsController()
const authorize = new Authorize() // The Authorize class is used for access control.

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)

/* Login/Logout routes */
router.get('/login', controller.login)
router.post('/login', controller.loginPost)
router.get('/logout', authorize.generalUser, controller.logout)
