import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import styles from '../../styles/LOGIN.module.css'

export default function Login() {

    const router = useRouter()

    const postLogin = async event => {
        event.preventDefault()

        const api = await fetch(`http://localhost:3000/api/user/login`, {
            method: "POST",
            headers: {
                "content-length" : "0",
                "authorization" : "Basic " + Buffer.from(event.target.email.value + ":" + event.target.password.value).toString("base64")
            },
        })

        if (api.ok) {
            router.push(`/admin/amaliyah`)

            return ''
        }
    } 
	
	return(
			<div>
				<Head>
					<title>Login | Dashboard Amaliyah Robithoh Murid</title>
				</Head>

				<div id={styles.main} className="min-h-screen flex flex-col justify-center items-center">
					<img className="w-32 h-32 mb-5" src="/arm_bg_ungu.svg" />
					<form onSubmit={postLogin} className="flex flex-col h-full border border-black bg-white p-5 rounded-lg">
						<h3 className="font-bold text-lg">Login</h3>
						<input name="email" autoComplete="email" className="border border-black rounded-lg mt-5 p-2" id={styles.form} type="email" placeholder="Email" />
						<input name="password" autoComplete="password" className="border border-black rounded-lg mt-2 p-2" id={styles.form2} type="password" placeholder="Password" />
						<button className="bg ungu mt-3 px-0 py-2 rounded-lg text-white font-bold" type="submit">LOGIN</button>
					</form>
				</div>

			</div> 
		)
}
