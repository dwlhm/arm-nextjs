const { readKategori } = require('../../../lib/amaliyah')
const Result = require('../../../lib/result')

export default async function handler(req, res) {

	 try {

	 	if (req.method !== 'GET') throw { code: 38.1 }

		let listPost = await readKategori(req.query)

	 	if (listPost == null) throw { code: 38.1 }

	    if (listPost == undefined) throw undefined

	    if (listPost.post.length < 1) listPost.post = []

		listPost.post.forEach(it => {

			it.itemsOrder = undefined
			it.itemsLength = undefined

			return it

		})

	    throw {data: listPost.post}

    } catch (response) {

    	const data = {
    		res: res,
    		status: 201,
    		data: response.data,
    		error: response.data ? undefined : response
    	}

    	await Result(data)

    }
}