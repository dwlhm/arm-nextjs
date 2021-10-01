import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Header from '../../../../components/header'
import Nav from '../../../../components/nav'
import fetch from 'node-fetch'

export default function PostBaru() {

	const router = useRouter()
	const { kategori } = router.query

    const [ alias, setAlias] = useState("")
    const [ bewara, setBewara ] = useState({
        display: 'hidden',
        content: ""
    })

    const upPost = async event => {
        event.preventDefault()

        const res = await fetch(`https://api.amaliyahrobithohmurid.com/api/admin/amaliyah/${kategori}`, {
            method: 'POST',
            body: JSON.stringify({
                name: event.target.name.value,
                alias: event.target.alias.value,
                description: event.target.deskripsi.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            router.push(`/admin/amaliyah/${kategori}/${event.target.alias.value}`)

            return ''
        }


        setBewara({
            display: 'block',
            content: 'The content you entered was detected as duplicate content.'
        })
    }
	
	return(
		<div>
			<Head>
                <title>Post Baru | API Amaliyah Robithoh Murid</title>
                <meta name="description" content="Create new Post for Amaliyah Section Following Post on Amaliyah Robithoh Murid" />
            </Head>
            <div className="mx-16 my-2">
            	<Header />
            	<Nav />
            	<div className="grid grid-cols-6 gap-4 mt-10">
            		<div className="border-2 border-ungu rounded-md flex justify-center items-center">
                        <Link href={`/admin/amaliyah/${kategori}`}><a>Kembali</a></Link>
                    </div>
                    <div className="col-span-5 flex flex-wrap items-center ungu rounded-md p-3">
                        <h2 className="text-base font-bold text-base text-white">Post Baru</h2>
                    </div>
                </div>
                <form className="mt-6" onSubmit={upPost}>
                    <div className={`w-full bg-red-200 rounded-md p-5 my-5 ${bewara.display}`}>
                        <span className="mr-5 font-bold text-xs" onClick={() => setBewara({display: 'hidden', content: ''})}>X</span>{bewara.content}
                    </div>
                	<div className="grid mb-2">
	                	<label htmlFor="name" className="text-sm font-bold my-2">Nama Post</label>
	                	<input id="name" name="name" type="text" autoComplete="name" required className="bg-gray-100 p-2 rounded-md my-2" onChange={(e) => setAlias(e.target.value.replace(/\s/g, "-"))} />
                	</div>
                	<div className="grid mb-2">
	                	<label htmlFor="alias" className="text-sm font-bold my-2">Alias Post</label>
	                	<input id="alias" name="alias" type="text" autoComplete="alias" disabled className="bg-gray-100 p-2 rounded-md my-2" value={alias.toLowerCase()} />
                	</div>
                	<div className="grid mb-2">
	                	<label htmlFor="deskripsi" className="text-sm font-bold my-2">Deskripsi Post</label>
	                	<textarea id="deskripsi" name="deskripsi" type="text" autoComplete="deskripsi" required className="bg-gray-100 p-2 rounded-md my-2"/>
                	</div>
                    <button type="submit" className="rounded-md ungu text-white text-base p-2 flex flex-wrap justify-center items-center w-full mt-5">
                        Simpan Post
                    </button>
                </form>
            </div>
        </div>
		)
}