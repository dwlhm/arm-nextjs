const { auth, result } = require('../../../lib')
const { kategoriAmaliyah } = require('../../../controller')

export default async function handler(req, res) {
	
	let data = {
		res: res,
		status: 500,
		data: [],
		err: ''
	}

	const params = req.query.amaliyah

	try {

		data.status = 200
		data.data = await kategoriAmaliyah[req.method](req, res).catch(err => {throw err})
	
	} catch(err) {

		data.status = 405
		data.data = []
		data.err = err.info

	}

	return result(data)

}