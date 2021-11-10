import jwt from 'jsonwebtoken'
import { firestore } from '../../../lib/firebase'
import bcrypt from 'bcrypt'
import initMiddleware from '../../../lib/init-middleware'

const PUBLIC_KEY = process.env.PUBLIC_KEY,
	  PRIVATE_KEY = process.env.PRIVATE_KEY
let verify, password, allowed

export default async function handler(req, res) {

	// JWT headers authorization check!
	const unauthorized = initMiddleware(req, res, ['GET','POST'])
		.then(it => true).catch(err => console.error(err))
	// return 401 if JWT detected
	if (unauthorized == true) {
		return res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: {},
			error: 'the activation link is no longer valid'
		})
	}

	const token = req.query.token

	if (req.method == 'GET') {
		try {
			allowed = await jwt.verify(token, PUBLIC_KEY)
		} catch(err) {
			console.error(err)
		}

		if (!allowed) {
			return res.status(401).json({
				status: 401,
				message: 'Unauthorized',
				data: '',
				error: 'invalid token'
			})
		}

		return res.status(200).json({
			status: 200,
			message: 'Success',
			data: 'valid tokens',
			error: ''
		})
	}

	if (!token) {
		return res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: {},
			error: 'invalid activation link'
		})
	}

	if (!req.body['new-password']) {
		return res.status(400).json({
			status: 400,
			message: 'Unauthorized',
			data: {},
			error: 'uncompleted form data'
		})
	}

	// verify JWT token on 'token' query
	try {
		verify = await jwt.verify(token, PUBLIC_KEY)
		password = await bcrypt.hash(req.body['new-password'], 10)
	} catch(err) {
		console.error(err)
	}

	if (!verify) {
		return res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: {},
			error: 'invalid token data'
		})
	}

	const duplication = await firestore().collection('user-data').doc(verify.email)
		.get().then(it => it.exists).catch(err => console.error(err))

	if (duplication) {
		return res.status(409).json({
			status: 409,
			message: 'Duplicate',
			data: {},
			error: 'duplicate email'
		})
	}

	const db = await firestore().collection('user-data').doc(verify.email)
		.create({
			email: verify.email,
			password: password,
			role: verify.role
		}).then(it => true).catch(err => console.error(err))

	if (!db) {
		return res.status(500).json({
			status: 500,
			message: 'Internal Server Error',
			data: {},
			message: 'db writing failed'
		})
	}

	return res.status(200).json({
		status: 200,
		message: 'Success',
		data: {
			token: token,
			email: verify.email,
			role: verify.role,
			created: true
		}
	})
}