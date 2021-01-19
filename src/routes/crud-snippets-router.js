/**
 * Pure numbers routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { CrudSnippetsController } from '../controllers/crud-snippets-controller.js'

export const router = express.Router()

const controller = new CrudSnippetsController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)

router.get('/login', controller.login)
router.get('/users/new', controller.usersNew)
router.post('/users/create', controller.userCreate)

//router.get('/new', controller.new)
//router.post('/create', controller.create)
