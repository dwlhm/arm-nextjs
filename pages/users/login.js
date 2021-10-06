import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
var axios = require("axios").default;
import styles from '../../styles/LOGIN.module.css'
import cookie from 'js-cookie'

export default function Login() {

    const router = useRouter()

    const postLogin = async event => {
        event.preventDefault()
        	let token = 'Basic ' + Buffer.from(event.target.email.value + ":" + event.target.password.value).toString("base64")
        	
        	let result

        	let url = 'http://localhost:3000/api/user/login';

			var options = {
			  method: 'POST',
			  url: url,
			  headers: {Authorization: token}
			};

			await axios.request(options)
				.then(res => {
					console.log(res.data)
					cookie.set('token', res.data.data)
				}).catch(err => {
					console.log(err.response.data)
				});

			return ''
    } 
	
	return(
			<div>
				<Head>
					<title>Login | Dashboard Amaliyah Robithoh Murid</title>
				</Head>

				<div id={styles.main} className="min-h-screen flex flex-col justify-center items-center">
					<Link href="/">
						<a><img className="w-32 h-32 mb-5" src="/arm_bg_ungu.svg" /></a>
					</Link>
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
