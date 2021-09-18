import loginLib from '../../../lib/login'

export default async function handler(req, res) {
	
	try {

		if (req.method !== 'POST') throw { code: 38.1 }

		const login = await loginLib(req.headers.authorization)

	console.log(login)

		if (!login) throw login

		res.status(200).json({
			status: 200,
			message: 'Success',
			data: 'wellcome!'
		})

	} catch(error) {

		console.log(error)

		if (error == null) {

			res.status(401).json({
    			status: 401,
    			message: 'Unauthorized',
    			data: ''
    		})

    		return ''
		}

		if (error.code) {

			res.status(400).json({
				status: 400,
				message: 'Bad Request',
				data: ''
			})

			return ''

		}

		res.status(500).json({
			status: 500,
			message: 'System Error',
			data: ''
		})


	}
}