import Cors from 'cors'
import { firestore } from '../../../lib/firebase'
import initMiddleware from '../../../lib/init-middleware'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET'],
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

	if (req.method !== "GET") {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: '',
			error: 'unidentified activity'
		})

		return
	}

	let data =	await firestore().collection('user-data').get().then(it => {
		if (!it.empty) {
			let result = []
			it.forEach(doc => {
				result.push({
					...doc.data(), 
					password: undefined,
					username: undefined,
					email: doc.data().username
				})
			})

			return result

		}
	})

	if (data) {
		res.status(200).json({
			status: 200,
			message: "Success",
			data: data,
			error: ""
		})

		return
	}

	
	
	res.status(401).json({
		status: 401,
		message: 'Unauthorized',
		data: '',
		error: 'the jwt token is no longer valid'
	})
}