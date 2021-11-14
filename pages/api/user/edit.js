import { firestore } from '../../../lib/firebase'
import initMiddleware from '../../../lib/init-middleware'
import firebase from 'firebase-admin'

export default async function handler(req, res) {

	const rejected = await initMiddleware(req,res,["PUT"], ["admin"]).catch(err => {
		console.log(err)
		return true
	})

	if (rejected == true) {
		return res.status(401).json({
			status: 401,
			message: "Unauthorized",
			data: "",
			error: "Unauthorized role"
		})
	}

	let data = req.body
	let email = req.query.email

	if (!data.name && !data.role && !email) {
		res.status(400).json({
			status: 400,
			message: "Bad Request",
			data: "",
			error: "uncompleted form data"
		})
	}

	// write update
	const db = await firestore().collection("user-data").doc(email)
		.update({
			...data,
			updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
		}).then(it => true).catch(err => console.log(err))

	if (!db) {
		return res.status(500).json({
			status: 500,
			message: "Internal Server Error",
			data: "",
			error: "can't to update data in db"
		})
	}

	return res.status(200).json({
		status: 200,
		message: "Success",
		data: "The user successfully edited",
		error: ""
	})
}