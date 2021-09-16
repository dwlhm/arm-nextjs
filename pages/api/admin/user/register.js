import fetch from 'node-fetch'

export default async function handler(req,res) {

	try {

		if (req.method !== 'POST') throw { code: 38.1 }

		//console.log(Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString())

		const to = req.body.to

		const link = req.body.link

		if (!to || !link) throw { code: 38.1 }

		let url = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages?`
		url += `from=dwiilham%40sandbox73aa666e86f2425eb1d6fae0316f14fd.mailgun.org&`
		url += `to=${to.replace('@', '%40')}&`
		url += `subject=ARM%20Author%20Registration%20Completion&`
		url += `html=Open%20this%20link%20to%20proceed%20to%20the%20next%20stage%20of%20the%20registration%20process%20%3Ca%20href="${link}"%3E${link}%3C%2Fa%3E%3Cbr%2F%3E%3Cbr%2F%3EThanks.`

		let options = {
			method: 'POST',
			headers: {
			    Authorization: 'Basic YXBpOjQyZWViMzg2YjExZTc5MDgzMzRkY2JiMzA1M2E3MDM3LTkwMzQ2YTJkLTA5MDYwOTNm'
			}
		}

		const send = await fetch(url, options)

		const result = await send.json()

		if (!result.id) throw { code: 38.1 }

		res.status(200).json({
	        status: 200,
	        message: "Success",
	        data: result
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