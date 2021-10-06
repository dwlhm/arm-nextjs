import Link from 'next/link'

export default function ErrorPage({ data }) {

	const actionLogin = <Link href='/users/login'><a className="p-2 block mt-5 rounded bg-white px-5">Login</a></Link>
	const actionToHomepage = <Link href='/'><a className="p-2 block mt-5 rounded bg-white px-5">Kembali ke beranda</a></Link>
	const status = !data ? 500 : data.status
	return(
			<p className="bg-red-500 p-5 m-5 text-center rounded font-bold">
                <div>{data.message}</div>
            	{ !data || data.status !== 401 ? actionToHomepage : actionLogin}
        	</p>
		)
}