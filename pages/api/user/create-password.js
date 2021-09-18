import jwt from 'jsonwebtoken'
import { verify } from '../../../lib/jwt'
import { firestore } from '../../../lib/firebase'
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
	

	try {

		if (req.method !== 'POST') throw { code: 38.1 }

		const newPassword = req.body['new-password']

		const key = req.query.key

		const data = await verify(key)

		const password = await bcrypt.hash(newPassword, 10)

		await firestore().collection('user').doc(data.email).create({
			email: data.email,
			username: data.email.split("@")[0],
			password: password,
			role: 'author'
		})

		res.status(200).json({
	        status: 200,
	        message: "Success",
	        data: "Account registration successfully done."
	    })

	} catch(error) {

		console.log(error)

    	if (error.code) {

	        res.status(400).json({
	            status: 400,
	            message: "Bad Request",
	            data: null 
	        })

	        return ''

    	}

	    res.status(500).json({
	        status: 500,
	        message: "Internal Server Error",
	        data: null 
	    })

	}
}