/**
 * Module for the Authorize class.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @version 1.0.0
 */

/**
 * The methods of the Authorize class are used to determine whether a user should be given
 * access to a resource, based on the content of their session cookie. Add a callback to one
 * of the methods in the route - if the user passes the check, he/she will be given access
 * to the requested content. Otherwise an error will be thrown, preventing the controller
 * action method from being called.
 */
export class Authorize {
  /**
   * Checks whether the user has been authenticated (meaning he/she is logged on to the site).
   * Only checks that the user is logged on, not the specific identity of the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Error} - An Error object that will prevent the controller callback method from being called.
   */
  generalUser (req, res, next) {
    if (!req.session.user) {
      const error = new Error('404 Not Found')
      error.statusCode = 404
      return next(error)
    }

    next()
  }

  /**
   * Checks that the user is both authenticated and that the user's ID in the session
   * storage corresponds to the userid parameter in the parameters of the request object.
   * Used to determine access to user-specific content.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Error} - An Error object that will prevent the controller callback method from being called.
   */
  specificUser (req, res, next) {
    if (!req.session.user || req.session.user._id !== req.params.userid) {
      const error = new Error('404 Not Found')
      error.statusCode = 404
      return next(error)
    }

    next()
  }
}
