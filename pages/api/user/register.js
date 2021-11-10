const jwt = require('jsonwebtoken')
const axios = require('axios')
const { firestore } = require('../../../lib/firebase')
import initMiddleware from '../../../lib/init-middleware'

const PRIVATE_KEY = process.env.PRIVATE_KEY

/*
	ALUR PROGRAM >>
	* Cek apakah headers authorization yang dipakai sesuai role-nya
	* Cek apakah data email atau data role ada pada body request
	* Cek apakah email yang digunakan belum ada pada db
	* Buat token berisi email dan role serta valid selama seharian
	* Buat link aktivasi dengan query token yang berisi token di poin 4
	* Kirim link aktivasi melalui api mailgun
	* Apabila poin 6 berhasil return 200, apabila gagal return 500
*/

export default async function handler(req, res) {

	let unauthorized = await initMiddleware(req, res, ['POST'], ['admin'])
		.catch(err => {
			console.error(err)
			return {
				condition: true,
				data: err
			}
		})

	if (unauthorized.condition) {
		return res.status(unauthorized.data.status).json({
			...unauthorized.data,
			detail: undefined
		})
	}

	// Cek email || role di req.body
	if (!req.body.email || !req.body.role) {
		return res.status(400).json({
			status: 400,
			message: 'Bad Request',
			data: {},
			error: 'uncompleted form data'
		})
	}

	// Cek email di db
	const db = await firestore().collection('user-data').doc(req.body.email).get()
		.then(it => it.exists).catch(err => console.error(err))

	if (db) {
		return res.status(409).json({
			status: 409,
			message: "Conflict",
			data: '',
			error: 'email been registered before'
		})
	}

	// Create JWToken from email and role, valid by 1 hours
	let JWToken = await jwt.sign({
		email: req.body.email,
		role: req.body.role
	}, PRIVATE_KEY, { algorithm: "RS256", expiresIn: '1h' })

	let activationLink = `${process.env.DASHBOARD_CREATE_PASS}?token=${JWToken}`

	var options = {
			method: 'POST',
		  url: 'https://api.mailgun.net/v3/mg.amaliyahrobithohmurid.com/messages',
		 	params: {
		   	from: 'Administrator <mailgun@mg.amaliyahrobithohmurid.com>',
		    to: req.body.email,
		    subject: 'ARM Dashboard Account Registration Completion',
		    template: 'arm-dashboard-regist',
			  'h:X-Mailgun-Variables': `{"url": "${activationLink}"}`
		  },
			headers: {
				Authorization: `Basic ${process.env.MAILGUN_KEY}`
			}
		}
	const sendToken = await axios.request(options).then(res => res.data).catch(err => {
	 	console.error({
			info: err.response.data,
			device: req.headers['user-agent'],
			date: new Date()
		})
	})

	if (!sendToken) {
		return res.status(500).json({
			status: 500,
			message: 'Internal Server Error',
			data: '',
			error: 'failed to sending activationLink'
		})
	}

	return res.status(200).json({
		status: 200,
		message: "Success",
		data: JWToken,
		error: ""
	})	
}