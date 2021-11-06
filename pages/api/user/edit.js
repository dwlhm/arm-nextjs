import Cors from 'cors'
import { firestore } from '../../../lib/firebase'
import initMiddleware from '../../../lib/init-middleware'
import firebase from 'firebase-admin'

const cors = Cors({
	methods: ['PUT']
})

export default async function handler(req, res) {

	let middleware = await initMiddleware(req,res,cors)

	let data = req.body
	let query = req.query.email

	if (middleware.status == 202 && req.method == 'PUT' && data && query) {

		let db = await firestore().collection('user-data').doc(query).update({
			...data,
			updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
			editedBy: middleware.data.id
		}).catch(err => {
			console.error({
	          info: err,
	          affectedDevice: req.headers.['user-agent'],
	          date: new Date() 
	        })
			res.status(500).json({
				status: 500,
				message: "Internal Server Error",
				data: "",
				error: "user not found"
			})
			return undefined
		})

		if (db) {
			res.status(200).json({
				status: 200,
				message: "Success",
				data: "Succesfully edited",
				error: ""
			})	
		}

		return
	}

	res.status(401).json({
		status: 401,
		message: 'Unauthorized',
		data: '',
		error: 'Not Authorized to Access this feature'
	})
}