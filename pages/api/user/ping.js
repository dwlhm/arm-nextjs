const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const Cors = require('cors')

const PUBLIC_KEY = process.env.PUBLIC_KEY,
	  PRIVATE_KEY = process.env.PRIVATE_KEY

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {

	await runMiddleware(req, res, cors)


	if (!req.headers.authorization || !req.headers.authorization.split(" ")[1]) {

		console.error({
			info: 'activity of an unregistered identity',
			affectedDevice: req.headers.['user-agent'],
			date: new Date() 
		})

		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: JWToken,
			error: 'activity of an unregistered identity'
		})

		return
	}

	const token = req.headers.authorization.split(" ")[1]

	console.log('ini token di sisi server')
	console.log(req.headers.authorization + " -")

	let verified

	try {
		verified = jwt.verify(token, PUBLIC_KEY)

		if (verified.device == req.headers['user-agent']) {

			res.status(200).json({
				status: 202,
				message: 'Accepted',
				data: verified,
				error: ''
			})

			return 

		}
	} catch(error) {
		console.error({
			info: error,
			affectedDevice: req.headers['user-agent'],
			date: new Date() 
		})
	}

	res.status(401).json({
		status: 401,
		message: 'Unauthorized',
		data: {},
		error: 'the jwt token is no longer valid'
	})
}