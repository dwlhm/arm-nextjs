import Link from 'next/link'

export default function Nav() {
	
	return(
		<nav className="grid grid-cols-5 gap-4 max-w-5xl mb-5 nav-top">
			<div className="rounded-md p-2 text-black text-center text-base border hover:border-black">
				<Link href="/">
					<a>Beranda</a>
				</Link>
			</div>
			<div className="rounded-md p-2 ungu text-white text-center text-base border active hover:border-black">
				<Link href="/admin/amaliyah">
					<a>Amaliyah</a>
				</Link>
			</div>
			<div className="rounded-md p-2 text-black text-center text-base border hover:border-black">
				<Link href="/admin/berita">
					<a>Berita</a>
				</Link>
			</div>
			<div className="rounded-md p-2 text-black text-center text-base border hover:border-black">
				<Link href="/admin/layanan-lain">
					<a>Layanan Lainnya</a>
				</Link>
			</div>
			<div className="rounded-md p-2 text-black text-center text-base border hover:border-black">
				<Link href="/admin/banner">
					<a>Banner</a>
				</Link>
			</div>
		</nav>
		)
}