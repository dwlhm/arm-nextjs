import bcrypt from 'bcrypt'
import firebase from 'firebase-admin'
import { firestore } from './firebase'
import { generate } from './jwt'

module.exports = async (docs) => {

	try {

		const [ username, password ] = Buffer.from(docs.split(" ")[1], 'base64').toString().split(':')

		if (process.env.ADMIN_USERNAME == username && process.env.ADMIN_PASSWORD == password) return true

		const search = await firestore().collection('user').doc(username).get()

		if (!search.exists) throw { code: 38.1 }

		const lastAccessedInterval = Math.round(((new Date() - search.data().accessedAt.toDate())/1000)/(60*60*24*7))

		const storedPassword = await bcrypt.compare(password, search.data().password)

		if (!storedPassword) throw { code: 38.1 }

		console.log(lastAccessedInterval)

		if (search.data().loggedIn && lastAccessedInterval <= 1) return search.data().token

		const token = await generate({
			email: search.data().email,
			role: search.data().role
		}, '10')

		search.ref.update({ 
			loggedIn: true,
			token: token,
			loginAt: firebase.firestore.FieldValue.serverTimestamp(),
			accessedAt: firebase.firestore.FieldValue.serverTimestamp()
		})

		firestore().collection("userActivity").doc(token).create({
			accessedAt: firebase.firestore.FieldValue.serverTimestamp(),
			token: token,
			email: search.data().email,
			role: search.data().role
		})
console.log(token + " 1")
		return token

	} catch(error) {

		console.log(error)

		return error.code ? null : undefined

	}


} 