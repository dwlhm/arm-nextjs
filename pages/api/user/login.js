const jwt = require('jsonwebtoken')
const firebase = require('firebase-admin')
const bcrypt = require('bcrypt')
const Cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { firestore } = require('../../../lib/firebase')
const initMiddleware = require('../../../lib/init-middleware')

const PUBLIC_KEY = process.env.PUBLIC_KEY,
	  PRIVATE_KEY = process.env.PRIVATE_KEY

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST'],
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
	// Run cors
  await runMiddleware(req, res, cors)

	if (req.method !== 'POST') {

		console.error({
				info: "Wrong http method, u used: " + req.method,
				affectedDevice: req.headers['user-agent'],
				date: new Date() 
			})

		res.status(405).json({
			status: 405,
			message: 'Method Not Allowed',
			data: {},
			error: 'http method used does not exist'
		})

		return
	}

	if (req.headers.authorization) {
		const [ username, password ] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(':')
		if (!username) {
			res.status(401).json({
				status: 401,
				message: 'Unauthorized',
				data: '',
				error: 'request from unregistered client'
			})
			return
		}
		let dataUser = {
			username: username,
			role: "",
			token: ""
		} 
		if (process.env.ADMIN_USERNAME == username && process.env.ADMIN_PASSWORD == password) dataUser.role = "admin"
		let verified	
		const searchDB = await firestore().collection('user').doc(username).get().then(async it => {
			let comparePW = await bcrypt.compare(password, it.data().password)
			verified = it.exists
			if (comparePW) return it.data()
			verified = false
		}).catch(err => {
			console.error({
				info: err,
				affectedDevice: req.headers['user-agent'],
				date: new Date() 
			})
			return false
		})
		if (!verified) {
			res.status(401).json({
				status: 401,
				message: 'Unauthorized',
				data: '',
				error: 'request from unregistered client'
			})
			return
		}
		dataUser.role = searchDB.role
		const dataJWT = {
			id: uuidv4(),
			role: dataUser.role,
			device: req.headers['user-agent']
		}
		try {
			dataUser.token = await jwt.sign(dataJWT, PRIVATE_KEY, { algorithm: 'RS256' })
		} catch(error) {
			console.error({
				info: error,
				affectedDevice: req.headers.['user-agent'],
				date: new Date() 
			})
		} 

		firestore().collection('user-activity').doc(dataJWT.id).create({
			username: username,
			role: dataUser.role,
			device: dataJWT.device,
			loginOn: firebase.firestore.FieldValue.serverTimestamp()
		})

		res.status(202).json({
			status: 202,
			message: 'Accepted',
			data: dataUser,
			error: ''
		})	

		return
	}

	res.status(401).json({
		status: 401,
		message: 'Unauthorized',
		data: '',
		error: 'request from unregistered client'
	})

}