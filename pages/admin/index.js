export default async function handler(req, res) {

	res.json({'route': req.method})
}