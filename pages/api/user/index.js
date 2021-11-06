import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'
import { firestore } from '../../../lib/firebase'
import firebase from 'firebase-admin'

const cors = Cors({
	methods: ['GET']
})

let result = {
	username: undefined,
	email: undefined,
	role: undefined
}

export default async function handler(req, res) {
	
	let middleware = await initMiddleware(req, res, cors)

	let data = req.body

	if (middleware.status !== 202) {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: '',
			error: 'Not Authorized to Access this feature'
		})

		return	
	}
	let db = await firestore().collection("user-activity")
		.doc(middleware.data.id).get().catch(err => {
			console.error({
		        info: err,
		        affectedDevice: req.headers.['user-agent'],
		        date: new Date() 
	        })
			return undefined
		})

	if(!db) {
		res.status(500).json({
			status: 500,
			message: "Internal Server Error",
			data: {},
			error: "User not found"
		})
		return
	}
	db = db.data()

	if (req.method == 'GET') {

		let detail = await firestore().collection("user-data")
			.doc(db.username).get().catch(err => {
				console.error({
		          info: err,
		          affectedDevice: req.headers.['user-agent'],
		          date: new Date() 
		        })
				return undefined
			})
		if (!detail) {
			res.status(500).json({
				status: 500,
				message: "Internal Server Error",
				data: {},
				error: "User not found"
			})
			return
		}
		detail = detail.data()
		result = {
			name: detail.name,
			email: detail.username,
			role: detail.role
		}
	}

	if (req.method == "PUT" && data) {

		let edit = await firestore().collection("user-data")
			.doc(db.username).update({
				...data,
				updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
				editedBy: middleware.data.id
			}).catch(err => {
				console.error({
		          info: err,
		          affectedDevice: req.headers.['user-agent'],
		          date: new Date() 
		        })
				return undefined
			})
		if (!edit) {
			res.status(500).json({
				status: 500,
				message: "Internal Server Error",
				data: {},
				error: "User not found"
			})
			return
		}

		result.session = middleware.data.id
	}

	if (req.method == "PUT" && !data) {
		res.status(400).json({
			status: 400,
			message: "Bad Request",
			data: {},
			error: "uncompleted input data"
		})
		return
	}


	res.status(200).json({
		status: 200,
		message: "Success",
		data: result,
		error: ""
	})

	return

	
}