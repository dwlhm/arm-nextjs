import axios from 'axios'

module.exports = {
	/*
		melakukan permintaan data ke endpoint admin dengan data @data
		@data: {
			url (string): url tujuan,
			method (string): method yang digunakan,
			body (object): isi body yang akan dikirim,
			token (string): token jwt untuk autentikasi
		}
	*/
	admin: async (data) => {

	    const options = {
	        url: data.url,
	        method: data.method,
	        body: data.body || undefined,
	        headers: { Authorization: `Bearer ${data.token}` }
	    }

	    return await axios.request(options).then(res => res.data).catch(err => err.response.data)
	}
}