import fetch from 'node-fetch'
import { generate } from '../../../../lib/jwt'

export default async function handler(req,res) {

	try {

		if (req.method !== 'POST') throw { code: 38.1 }

		const [ username, password ] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(':')

		if (process.env.ADMIN_USERNAME !== username) throw { code: 38.2 }

		if (process.env.ADMIN_PASSWORD !== password) throw { code: 38.2 }

		const to = req.body.to

		const link = await generate({ email: to }, '1h')

		if (!to) throw { code: 38.1 }

		let url = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages?`
		url += `from=dwiilham%40sandbox73aa666e86f2425eb1d6fae0316f14fd.mailgun.org&`
		url += `to=${to.replace('@', '%40')}&`
		url += `subject=ARM%20Author%20Registration%20Completion&`
		url += `html=%3Chtml%3EOpen%20this%20link%20to%20proceed%20to%20the%20next%20stage%20of%20the%20registration%20process%3A%3Cbr%2F%3E%3Ca%20href="`
		url += `${process.env.hostname}/api/user/create-password?key=${link}"%3E`
		url += `${process.env.hostname}/api/user/create-password?key=${link}%3C%2Fa%3E%3Cbr%2F%3E%3Cbr%2F%3EThanks.%3C%2Fhtml%3E`

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

    	if (!error.code) {

		    res.status(500).json({
		        status: 500,
		        message: "Internal Server Error",
		        data: null 
		    })

    	}

    	if (error.code == 38.2) {

    		res.status(401).json({
    			status: 401,
    			message: 'Unauthorized',
    			data: ''
    		})

    		return ''
    	}

	    res.status(400).json({
	        status: 400,
	        message: "Bad Request",
            data: null 
	    })

	    return ''

	}


}