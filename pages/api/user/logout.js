import { logout } from "../../../lib/auth"

export default async function handler(req, res) {

	try {

		const result = await logout(req, res)

		if (!result) throw "Bad Request"

		res.status(200).json({
			status: 200,
			message: "Success"
		})

	} catch(error) {

		res.status(400).json({
			status: 400,
			message: "Bad Request"
		})
	}
}