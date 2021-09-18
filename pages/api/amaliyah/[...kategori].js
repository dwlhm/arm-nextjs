const { readPost, readItemOnPost } = require('../../../lib/amaliyah')
import fetch from 'node-fetch'

export default async function handler(req, res) {

	try {

		if (req.method !== 'GET') throw { code: 38.1 }

		const { page, limit, kategori } = req.query

		let maxLength = page*limit
		let minLength = maxLength-limit

		if (kategori.length == 2) {

			let post = await readPost({kategori: kategori[0], post: kategori[1], maxLength: maxLength, minLength: minLength})

			if (post == null) throw { code: 38.1 }

			if (post == undefined) throw undefined

			if (post.item.length < 1) post.item = []

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

		
		let item = await readItemOnPost(kategori)

		const url = `https://amaliyah-mursyid.herokuapp.com/api/v1/app/amaliyah/${kategori[0]}/${kategori[1]}/${kategori[2]}`

		//let item = await fetch(url).then(it => it.json())

		if (item == null) throw { code: 38.1 }

		if (item == undefined) throw undefined

		/*if (item.item.length < 1) item.item = []

		item.item.forEach(it => {

			it.itemsNumber = undefined
			it.itemsOrder = undefined
			it.itemsLength = undefined

			return it

		})*/

		res.status(200)
		res.json({
			status: 200,
			message: 'Success',
			data: item
		})

		return ''

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