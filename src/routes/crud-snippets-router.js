/**
 * Pure numbers routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { CrudSnippetsController } from '../controllers/crud-snippets-controller.js'
import { Authorize } from './authorize.js'

export const router = express.Router()

const controller = new CrudSnippetsController()
const authorize = new Authorize()

// Map HTTP verbs and route paths to controller actions.
router.get('/', authorize.generalUser, controller.index)

router.get('/login', controller.login)
router.post('/login', controller.loginPost)
router.get('/logout', controller.logout)
