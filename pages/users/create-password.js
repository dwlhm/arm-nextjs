import { useRouter } from 'next/router'
import Head from 'next/head'
import fetch from 'node-fetch'
import styles from '../../styles/LOGIN.module.css'

export default function CreatePassword() {

    const router = useRouter()
    const { jwt } = router.query

    const createPassword = async event => {
        event.preventDefault()

        const api = await fetch(`http://localhost:3001/api/user/create-password?key=${jwt}`, {
            method: 'POST',
            body: JSON.stringify({
               'new-password': event.target.password.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (api.ok) {
            router.push(`/users/login`)

            return ''
        }
            
            
    }
	
	return(
			<div>
				<Head>
					<title>CreatePassword | Dashboard Amaliyah Robithoh Murid</title>
				</Head>

				<div id={styles.main} className="min-h-screen flex flex-col justify-center items-center">
					<img className="w-32 h-32 mb-5" src="/arm_bg_ungu.svg" />
					<form onSubmit={createPassword} className="flex flex-col h-full border border-black bg-white p-5 rounded-lg">
						<h3 className="font-bold text-lg">Create Password</h3>
						<input name="password" autoComplete="password" className="border border-black rounded-lg mt-2 p-2" id={styles.form} type="password" placeholder="Password" />
						<button className="bg ungu mt-3 px-0 py-2 rounded-lg text-white font-bold" type="submit">LOGIN</button>
					</form>
				</div>

			</div> 
		)
}
