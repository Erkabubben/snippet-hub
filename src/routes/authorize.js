/**
 * Module for the CrudSnippetsController.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class Authorize {
    generalUser (req, res, next) {
        if (!req.session.user) {
          const error = new Error ('Not Found')
          error.statusCode = 404
          return next(error)
        }
    
        next()
      }
    
    specificUser (req, res, next) {
    if (!req.session.user || req.session.user._id !== req.params.userid) {
        const error = new Error ('Not Found')
        error.statusCode = 404
        return next(error)
    }

    next()
    }
}