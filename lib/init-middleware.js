import jwt from 'jsonwebtoken'

const PUBLIC_KEY = process.env.PUBLIC_KEY

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      if (!req.headers.authorization || !req.headers.authorization.split(" ")[1]) {

        console.error({
          info: 'activity of an unregistered identity',
          affectedDevice: req.headers.['user-agent'],
          date: new Date() 
        })

        return reject({
          status: 401,
          message: 'Unauthorized',
          data: JWToken,
          error: 'activity of an unregistered identity'
        })
      }

  const token = req.headers.authorization.split(" ")[1]

  let verified

  try {
    verified = jwt.verify(token, PUBLIC_KEY)

    if (verified.device == req.headers['user-agent']) {

      return resolve({
        status: 202,
        message: 'Accepted',
        data: verified,
        error: ''
      })

    }
  } catch(error) {
    console.error({
      info: error,
      affectedDevice: req.headers['user-agent'],
      date: new Date() 
    })
  }

  return reject({
    status: 401,
    message: 'Unauthorized',
    data: {},
    error: 'the jwt token is no longer valid'
  })

    })
  })
}