import initMiddleware from '../../../lib/init-middleware'
import { firestore } from '../../../lib/firebase'
import firebase from 'firebase-admin'

export default async function handler(req, res) {
	
	const rejected = await initMiddleware(req, res, ["GET"], ["admin", "editor"])
		.then(it => it)
		.catch(err => {
			console.log(err)
			return err
		})

	if (rejected.status !== 202) {
		res.status(rejected.status).json({
			...rejected,
			detail: undefined
		})
	}

	// read db
	const db = await firestore().collection("user-activity")
		.doc(rejected.data.id)
		.get().then(it => {
			let dataUser = it.data()
			return {
				status: it.exists,
				data: dataUser
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

	const profil = await firestore().collection("user-data")
		.doc(db.data.email).get()
		.then(it => {
			let dataUser = it.data()
			return {
				status: it.exists,
				data: dataUser
			}
		}).catch(err => {
			console.error(err)
			return {
				status: false,
				data: err
			}
		})

	if (profil.status !== true) {
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
		data: {
			...profil.data,
			password: undefined,
			editedBy: undefined,
			loginOn: undefined
		},
		error: ""
	})
}