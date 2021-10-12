const { httpCode } = require('../config');

/*
	Modul ini digunakan untuk menyederhanakan pengaturan output 
	setiap endpoint api
	@data = {
		res: nextjs http response,
		data: data yang diminta,
		error: pesan error 
	}
*/

module.exports = async (data) => {

	console.log(data.err) // menampilkan pesan error jika ada

	data.res.status(data.status).json({
		status: data.status,
		message: httpCode[data.status] ? httpCode[data.status] : undefined,
		data: data.data
	})

}