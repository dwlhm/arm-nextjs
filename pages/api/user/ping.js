import initMiddleware from '../../../lib/init-middleware'

export default async function handler(req, res) {

	const middleware = await initMiddleware(req, res, ['GET'], ['admin', 'editor'])
		.then(it => it).catch(err => err)

	res.status(middleware.status).json({
		...middleware,
		detail: undefined,
		device: req.headers['user-agent']
	})
}