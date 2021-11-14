import { firestore } from '../../../lib/firebase'
import initMiddleware from '../../../lib/init-middleware'

export default async function handler(req, res) {

	const rejected = await initMiddleware(req, res, ["GET"], ["admin", "editor"])
		.then(it => it).catch(err => {
			console.log(err)
			return err
		})

	if (rejected.status !== 202) {
		return res.status(401).json({
			...rejected,
			detail: undefined
		})
	}

	// read db
	const db = await firestore().collection("user-data").get()
		.then(it => {
			let result = []
			it.forEach(doc => {
				result.push({
					...doc.data(), 
					password: undefined,
					editedBy: undefined
				})
			})
			return {
				status: true,
				data: result
			}
		}).catch(err => {
			console.log(err)
			return {
				status: false,
				data: err
			}
		})

	if (db.status !== true) {
		return res.status(500).json({
			status: 500,
			message: "Internal Server Error",
			data: "",
			error: "data not found in db"
		})
	}

	return res.status(200).json({
		status: 200,
		message: "Success",
		data: db.data,
		error: ""
	})

	/*if (req.method !== "GET") {
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
	})*/
}