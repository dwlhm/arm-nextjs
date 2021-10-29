const jwt = require('jsonwebtoken')
const axios = require('axios')
const cors = require('cors')
const { firestore } = require('../../../lib/firebase')
const initMiddleware = require('../../../lib/init-middleware')

const PRIVATE_KEY = process.env.PRIVATE_KEY

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST'],
})

export default async function handler(req, res) {

	await initMiddleware(req, res, cors).then(it => {
		if (it.data.role !== 'editor') {
			res.status(401).json({
				status: 401,
				message: 'Unauthorized',
				data: '',
				error: 'unidentified activity'
			})

			return
		}
	}).catch(err => {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: '',
			error: 'unidentified activity'
		})

		return
	})

	if (req.method !== "POST") {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: '',
			error: 'unidentified activity'
		})

		return
	}

	if (!req.body.email || !req.body.role) {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: getToken,
			error: 'unidentified activity'
		})

		return
	}

	const userData = {
		username: req.body.email,
		role: req.body.role
	}

	const checkUsername = await firestore().collection('user-data').doc(userData.username).get().then(it => it.exists).catch(err => {
		console.error({
			info: error,
			device: req.headers['user-agent'],
			date: new Date()
		})
	})

	if (checkUsername) {``
		res.status(409).json({
			status: 409,
			message: 'Conflict',
			data: '',
			error: 'user duplication'
		})

		return
	}

	try {
		const getToken = await jwt.sign(userData, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1h' })
		var options = {
			method: 'POST',
		  	url: 'https://api.mailgun.net/v3/mg.amaliyahrobithohmurid.com/messages',
		  	params: {
		    	from: 'Administrator <mailgun@mg.amaliyahrobithohmurid.com>',
			    to: userData.username,
			    subject: 'ARM Dashboard Account Registration Completion',
			    template: 'arm-dashboard-regist',
			    'h:X-Mailgun-Variables': `{"url": "https://dashboard.amaliyahrobithohmurid.com/user/create-password?token=${getToken}"}`
		  	},
			headers: {
			    Authorization: 'Basic YXBpOjQyZWViMzg2YjExZTc5MDgzMzRkY2JiMzA1M2E3MDM3LTkwMzQ2YTJkLTA5MDYwOTNm'
			}
		};
	    const sendToken = await axios.request(options).then(res => res.data).catch(err => {
	    	console.error({
				info: err.response.data,
				device: req.headers['user-agent'],
				date: new Date()
			})
			res.status(401).json({
				status: 401,
				message: 'Unauthorized',
				data: '',
				error: 'unidentified activity'
			})

			return
	    })
		res.status(202).json({
			status: 202,
			message: 'Accepted',
			data: getToken,
			error: ''
		})

		return
	} catch (error) {
		console.error({
			info: error,
			device: req.headers['user-agent'],
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