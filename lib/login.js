import bcrypt from 'bcrypt'
import { firestore } from './firebase'

module.exports = async (docs) => {

	try {

		const [ username, password ] = Buffer.from(docs.split(" ")[1], 'base64').toString().split(':')

		if (process.env.ADMIN_USERNAME == username && process.env.ADMIN_PASSWORD == password) return true

		const search = await firestore().collection('user').doc(username).get()

		if (!search.exists) throw { code: 38.1 }

		const storedPassword = await bcrypt.compare(password, search.data().password)

		if (!storedPassword) throw { code: 38.1 }

		return true

	} catch(error) {

		console.log(error)

		return error.code ? null : undefined

	}


} 