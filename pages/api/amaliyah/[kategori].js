const { readKategori } = require('../../../lib/amaliyah')

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

	    res.status(200).json({
	    	status: 200,
	        message: "Success",
	        data: listPost.post
	    })

    } catch (error) {

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