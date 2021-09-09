const { readPost } = require('../../../lib/amaliyah')

export default async function handler(req, res) {

	try {

		if (req.method !== 'GET') throw { code: 38.1 }

		const { kategori } = req.query

		if (kategori.length == 2) {

			let post = await readPost({kategori: kategori[0], post: kategori[1]})

			if (post == null) throw { code: 38.1 }

			if (post == undefined) throw undefined

			if (post.item.length < 1) throw { code: 38.1 }

			post.item.forEach(it => {

				it.itemsNumber = undefined
				it.itemsOrder = undefined
				it.itemsLength = undefined

				return it

			})

			res.status(200)
			res.json({
				status: 200,
				message: 'Success',
				data: post.item
			})

			return ''

		}

		throw { code: 38.1 }


	} catch(error) {

		console.log(error)
    	
    	if (error.code) {

    		res.status(200)
    		res.json({
    			status: 400,
    			message: "Bad Request",
    			data: null
    		})

    		return ''

    	}

    	res.status(500)
    	res.json({
    		status: 500,
    		message: "Internal Server Error",
    		data: null
    	})

	}
}