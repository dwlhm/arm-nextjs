const jwt = require('jsonwebtoken')
const firebase = require('firebase-admin')
const bcrypt = require('bcrypt')
const Cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const { firestore } = require('../../../lib/firebase')
import initMiddleware from '../../../lib/init-middleware'

const PRIVATE_KEY = process.env.PRIVATE_KEY
const dataJWT = {
			id: uuidv4(),
			role: 'admin',
			device: undefined
		}
let JWToken
let listDevice = []

/*
	ALUR PROGRAM >>
	* Cek headers authorization berbentuk jwt atau tidak
	* Cek device sudah login atau belum
	* Validasi data pada headers aurhorization dengan data pada env
	* Validasi data pada headers authorization dengan data pada db
	* Tulis aktivitas login di db apabila hasil validasi = true
	* return 200 apabila validasi = true, return 400 apabila validasi = false
*/

export default async function handler(req, res) {

	// JWT Check
  await initMiddleware(req, res, ['POST'], ['admin', 'author'])
  	.then(it => {
  		return res.status(it.status).json({
  			...it,
  			detail: undefined
  		})
  	}).catch(err => console.log(err))

  const [ email, password ] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(':')

  // Cek device di db
  const db = await firestore().collection('user-data').doc(email).get()
  	.then(it => it.data()).catch(err => {
  		console.error({
	  		info: err,
	  		affectedDevice: req.headers['user-agent'],
	  		date: new Date() 
  		})
  	})

  if (db.device && db.device.indexOf(req.headers['user-agent']) >= 0) {
  	return res.status(409).json({
			status: 409,
			message: 'Conflict',
			data: {},
			error: 'been logged in before'
		})
  }

  // cek username & pass di env || db
  let compareDb = await bcrypt.compare(password, db.password).then(it => it)
  	.catch(err => console.error(err))
  if (process.env.ADMIN_PASSWORD !== password && compareDb !== true) {
  	return res.status(409).json({
  		status: 401,
			message: 'Unauthorized',
			data: {},
			error: 'Incorrect data entered'
		})
  }

  if (db.device) {
  	listDevice = db.device
  }

  if (db.role) {
  	dataJWT.role = db.role
  }

  dataJWT.device = req.headers['user-agent']

  // Create JWT token
  try {
  	JWToken = await jwt.sign(dataJWT, PRIVATE_KEY, { algorithm: 'RS256' })
  } catch(err) { 
  	console.error(err) 
  	return res.status(500).json({
  		status: 500,
  		message: "Internal Server Error",
  		data: {},
  		error: "can't generate token"
  	})
  }

  await firestore().collection('user-activity').doc(dataJWT.id).create({
			username: email,
			role: dataJWT.role,
			device: dataJWT.device,
			loginOn: firebase.firestore.FieldValue.serverTimestamp()
		}).catch(err => {
			console.error(err)
			return res.status(500).json({
	  		status: 500,
	  		message: "Internal Server Error",
	  		data: {},
	  		error: "can't save login info"
	  	})
		})

	await firestore().collection('user-data').doc(email).update({
		device: listDevice.push(req.headers.device)
	}).catch(err => {
		console.error(err)
		return res.status(500).json({
	  	status: 500,
  		message: "Internal Server Error",
	 		data: {},
	 		error: "can't save login info"
	  })
	})

  return res.status(202).json({
    status: 202,
    message: 'Accepted',
  	data: {
      role: dataJWT.role,
    	token: JWToken
    },
   	error: ''
   })
}