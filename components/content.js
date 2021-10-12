import Head from 'next/head'
import Nav from './nav'
import ErrorPage from './error-page'
import styles from '../styles/HEADER.module.css'

export default function Content({ data, title, description, label, children }) {

	if (data.status !== 200) {
		<ErrorPage data={data} />
	}
	
	return(
			<>
				<Head>
		            <title>{ title } | API Amaliyah Robithoh Murid</title>
		            <meta name="description" content={ description } />
		        </Head>
		        <div className="mx-16 my-2">
		        	<div className="mb-5 mt-5">
						<div className="grid grid-cols-3 gap-4 max-w-xs">
							<div>
								<img src="/arm_bg_ungu.svg" />
							</div>
							<div className="col-span-2 flex flex-wrap content-center">
								<h1 className={styles.titleDash}>Amaliyah Robithoh Murid<br/><b>Dashboard</b></h1>
							</div>
						</div>
					</div>
		        	<Nav page={label} />
		        	{ children }
		        </div>
			</>
		)
}