const { firestore } = require('../lib/firebase')
const firebase = require('firebase-admin')
const jwt = require('jsonwebtoken')

export verifyJwt = async (req) => {
	let token = req.headers.authorization.split(" ")[1]

	const PUBLIC_KEY = process.env.PUBLIC_KEY

	let tokenData = await jwt.verify(key, publicKey)

	console.log(tokenData)
}