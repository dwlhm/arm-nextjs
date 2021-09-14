import { readKategori } from '../../../../../lib/amaliyah'
import { writePost } from '../../../../../lib/write.amaliyah'

export default async function handler(req, res) {
	
	try {

		if (req.method == 'POST') {

	        const data = {
	        	kategori: req.query.kategori,
	            data: req.body,
	            author: 'admin'
	        }

	        await writePost(data).then(result => {
	            
	          if (result === null) throw { code: 38.1 }
	            
	          if (result === undefined) throw undefined

	          res.status(200).json({
	            status: 200,
	            message: "Success",
	            data: result 
	          })

	          return ''
	      
	        })

	        return ''

	    }

	    if (req.method !== 'GET') throw { code: 38.1 }
	    
	    let kategori = await readKategori(req.query)

	    if (kategori == undefined) throw undefined

	    res.status(200).json({
	        status: 200,
	        message: "Success",
	        data: kategori
	    })

    } catch(error) {

        console.log(error)

    	if (error.code) {

	        res.status(400).json({
	            status: 400,
	            message: "Bad Request",
	            data: null 
	        })

	        return ''

    	}

	    res.status(500).json({
	        status: 500,
	        message: "Internal Server Error",
	        data: null 
	    })

    }
}