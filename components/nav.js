import Link from 'next/link'

export default function Nav({page}) {
	
	return(
		<nav className="grid grid-cols-5 gap-4 max-w-5xl mb-5 nav-top">
			<div className={`rounded-md p-2 text-center text-base border hover:border-black ${page == 'beranda' ? 'ungu text-white' : ''}`}>
				<Link href="/">
					<a>Beranda</a>
				</Link>
			</div>
			<div className={`rounded-md p-2 text-center text-base border hover:border-black ${page == 'amaliyah' ? 'ungu text-white' : ''}`}>
				<Link href="/admin/amaliyah">
					<a>Amaliyah</a>
				</Link>
			</div>
			<div className={`rounded-md p-2 text-center text-base border hover:border-black ${page == 'berita' ? 'ungu text-white' : ''}`}>
				<Link href="/admin/berita">
					<a>Berita</a>
				</Link>
			</div>
			<div className={`rounded-md p-2 text-center text-base border hover:border-black ${page == 'layanan-lain' ? 'ungu text-white' : ''}`}>
				<Link href="/admin/layanan-lain">
					<a>Layanan Lainnya</a>
				</Link>
			</div>
			<div className={`rounded-md p-2 text-center text-base border hover:border-black ${page == 'banner' ? 'ungu text-white' : ''}`}>
				<Link href="/admin/banner">
					<a>Banner</a>
				</Link>
			</div>
		</nav>
		)
}