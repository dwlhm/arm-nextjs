import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Header from '../../../components/header'
import Nav from '../../../components/nav'
import fetch from 'node-fetch'

export default function KategoriBaru() {

    const [ alias, setAlias] = useState("")
    const [ bewara, setBewara ] = useState({
        display: 'hidden',
        content: ""
    })

    const upKategori = async event => {
        event.preventDefault()

        const res = await fetch('http://localhost:3000/api/admin/amaliyah/', {
            method: 'POST',
            body: JSON.stringify({
                name: event.target.name.value,
                alias: event.target.alias.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            router.push(`/admin/amaliyah/${event.target.alias.value}`)

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
                <title>Kategori Baru | API Amaliyah Robithoh Murid</title>
                <meta name="description" content="Create new Kategori for Amaliyah Section on Amaliyah Robithoh Murid" />
            </Head>
            <div className="mx-16 my-2">
            	<Header />
            	<Nav />
            	<div className="grid grid-cols-5 gap-4 mt-10">
                    <div className="col-span-4 flex flex-wrap items-center ungu rounded-md p-3">
                        <h2 className="text-base font-bold text-base text-white">Kategori Baru</h2>
                    </div>
                </div>
                <form className="mt-6" onSubmit={upKategori}>
                    <div className={`w-full bg-red-200 rounded-md p-5 my-5 ${bewara.display}`}>
                        <span className="mr-5 font-bold text-xs" onClick={() => setBewara({display: 'hidden', content: ''})}>X</span>{bewara.content}
                    </div>
                	<div className="grid mb-2">
	                	<label htmlFor="name" className="text-sm font-bold my-2">Nama Kategori</label>
	                	<input id="name" name="name" type="text" autoComplete="name" required className="bg-gray-100 p-2 rounded-md my-2" onChange={(e) => setAlias(e.target.value.replace(/\s/g, "-"))} />
                	</div>
                	<div className="grid mb-2">
	                	<label htmlFor="alias" className="text-sm font-bold my-2">Alias Kategori</label>
	                	<input id="alias" name="alias" type="text" autoComplete="alias" required className="bg-gray-100 p-2 rounded-md my-2" value={alias.toLowerCase()} />
                	</div>
                    <button type="submit" className="rounded-md ungu text-white text-base p-2 flex flex-wrap justify-center items-center w-full mt-5">
                        Simpan Kategori
                    </button>
                </form>
            </div>
        </div>
		)
}