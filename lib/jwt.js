import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

module.exports = {
	/*
		membuat token jwt dari data @docs dan @exp
		@docs: data untuk disimpan di token jwt
		@exp: waktu berlaku token jwt
	*/
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
	/*
		verifikasi token jwt dari data @key
		@key: token jwt untuk diverifikasi 
	*/
	verify: async (key) => {

		try {

			const publicKey = process.env.PUBLIC_KEY

			const data = await jwt.verify(key, publicKey)

			return data

		} catch(error) {

			console.log(error)

			return error.code ? null : undefined

		}
	}
}