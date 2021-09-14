import Image from 'next/image'
import styles from '../styles/HEADER.module.css'

export default function Header() {

	return (
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
		)
}