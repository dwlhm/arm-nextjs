import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

module.exports = {
	generate: async (docs, exp) => {

		try {

			const privatekey = process.env.PRIVATE_KEY

			const token = await jwt.sign(docs, privatekey, { algorithm: 'RS256', expiresIn: exp })

			return token

		} catch(error) {

			console.log(error)

			return error.code ? null : undefined

		}

	},
	verify: async (key) => {

		try {

			const publicKey = fs.readFileSync(path.resolve(__dirname, '../../../../../lib/key/public.pem'))

			const data = await jwt.verify(key, publicKey)

			return data

		} catch(error) {

			console.log(error)

			return error.code ? null : undefined

		}
	}
}