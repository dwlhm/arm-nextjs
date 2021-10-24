import jwt from 'jsonwebtoken'
import { verify } from '../../../lib/jwt'
import { firestore } from '../../../lib/firebase'
import bcrypt from 'bcrypt'

const PUBLIC_KEY = process.env.PUBLIC_KEY,
	  PRIVATE_KEY = process.env.PRIVATE_KEY

export default async function handler(req, res) {

	if (req.method !== 'POST') {
		res.status(405).json({
			status: 405,
			message: 'Method Not Allowed',
			data: {},
			error: 'http method used does not exist'
		})
	}
	let verified
	const JWToken = req.query.token
	try {
		verified = jwt.verify(JWToken, PUBLIC_KEY)
		if (verified) {
			const getNewPassword = req.body['new-password']
			const createPassword = await bcrypt.hash(getNewPassword, 10)
			await firestore().collection('user-data').doc(verified.username).create({
				username: verified.username,
				password: createPassword,
				role: verified.role	
			}).then(it => {
				res.status(201).json({
					status: 201,
					message: 'Created',
					data: {
						username: verified.username,
						role: verified.role
					},
					error: ''
				})	
			}).catch(error => {
				console.log(error.code)
				res.status(409).json({
					status: 409,
					message: 'Conflict',
					data: '',
					error: 'user duplication'
				})
			})
		}
	} catch(error) {
		console.error({
			info: error,
			affectedDevice: req.headers['user-agent'],
			date: new Date() 
		})
	}
	
	console.log(verified)

	res.status(401).json({
		status: 401,
		message: 'Unauthorized',
		data: '',
		error: 'request from unregistered client'
	})
	

	/*try {

		if (req.method !== 'POST') throw { code: 38.1 }

		const newPassword = req.body['new-password']

		const key = req.query.key

		const data = await verify(key)

		const password = await bcrypt.hash(newPassword, 10)

		await firestore().collection('user').doc(data.email).create({
			email: data.email,
			username: data.email.split("@")[0],
			password: password,
			role: 'author'
		})

		res.status(200).json({
	        status: 200,
	        message: "Success",
	        data: "Account registration successfully done."
	    })

	} catch(error) {

		console.log(error)

    	if (error.code) {

	        res.status(400).json({
	            status: 400,
	            message: "Bad Request",
	            data: null 
	        })

	        return ''

    	}

	    res.status(500).json({
	        status: 500,
	        message: "Internal Server Error",
	        data: null 
	    })

	}*/
}