const { verify, generate } = require('./jwt')
const { firestore } = require('./firebase')
const firebase = require('firebase-admin')

module.exports = {
	verify: async (req, res) => {

		/*
			- Get authorization token
			- verify if its active token on firestore db
			- get username, token, and role from database
			- check if jwt token expired
			- if token is expired: 
			  - generate new jwt
			  - save jwt to database with username and role detail
			- return username, token and role user. If thats not detected, return as it was (undefined)
		*/

		try {

			let token = req.headers.authorization.split(" ")[1]

			const user = await firestore().collection("userActivity").doc(token).get()

			const lastAccessedInterval = Math.round(((new Date() - user.data().accessedAt.toDate())/1000)/(60*60*24*7))

			if (req.headers['user-agent'] !== user.data().userAgent && lastAccessedInterval > 1) throw { message: "undefined token" }

			let result = {
				email: user.data().email,
				role: user.data().role,
				token: token
			}

			const verifyToken = await verify(token)

			req.headers.accessToken = token

			firestore().collection("user").doc(result.email).update({
				accessedAt: firebase.firestore.FieldValue.serverTimestamp()
			})

			user.ref.update({				
				accessedAt: firebase.firestore.FieldValue.serverTimestamp()
			})

			if (verifyToken) return result

			const generatedToken = await generate({
				email: result.email,
				role: result.role
			}, '10m')

			firestore().collection("userActivity").doc(generatedToken).create({
				...result,
				userAgent: req.headers['user-agent'],
				accessedAt: firebase.firestore.FieldValue.serverTimestamp()
			})

			req.headers.accessToken = generatedToken

			return result

		} catch(error) {

			console.log(error)

			return false

		}
	},
	logout: async (req, res) => {

		/*
			- get authorization token
			- delete following userActivity doc
			- set user loggedIn to false
			- return true
		*/

		try {

			const token = req.headers.authorization.split(" ")[1]



			const user = await firestore().collection("userActivity").doc(token).get()

			const email = user.data().email

			user.ref.delete()

			await firestore().collection("user").doc(email).update({
				loggedIn: false
			})

			return true

		} catch(error) {

			console.log(error)

			return false
		}
	}
}