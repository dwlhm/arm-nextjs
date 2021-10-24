const jwt = require('jsonwebtoken')
const firebase = require('firebase-admin')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { firestore } = require('../../../lib/firebase')

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

	if (req.headers.authorization) {
		const [ username, password ] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(':')
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
				affectedDevice: req.headers.['user-agent'],
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
			device: req.headers['user-agent']
		}
		try {
			dataUser.token = await jwt.sign(dataJWT, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1m' })
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