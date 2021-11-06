const jwt = require('jsonwebtoken')
const { firestore } = require('../../../lib/firebase')

const PUBLIC_KEY = process.env.PUBLIC_KEY

export default async function handler(req, res) {

	if (req.method !== 'GET') {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: '',
			error: 'unidentified activity'
		})

		return
	}
	const JWToken = req.headers.authorization.split(" ")[1]
	let verified

	console.log(req.headers['user-agent'])
	try {
		verified = jwt.verify(JWToken, PUBLIC_KEY)
		if (verified.device == req.headers['user-agent']) {

			await firestore().collection('user-activity').doc(verified.id).delete()

			res.status(200).json({
				status: 202,
				message: 'Accepted',
				data: 'The associated user-activity has been removed',
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
		data: '',
		error: 'the jwt token is no longer valid'
	})
}