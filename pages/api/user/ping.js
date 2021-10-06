import { verify } from '../../../lib/auth'

export default async function handler(req, res) {

	const ping = await verify(req, res)

	if (!ping) {
		res.status(401).json({
			status: 401,
			message: 'Unauthorized',
			data: ping
		})

		return ''
	} 

	res.status(200).json({
		status: 200,
		message: 'Success',
		data: ping
	})
}