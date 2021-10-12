import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Header from '../../../components/header'
import Nav from '../../../components/nav'
import fetch from 'node-fetch'
import ErrorPage from '../../../components/error-page'
import axios from 'axios'
import cookie from 'js-cookie'
import Content from '../../../components/content'

export default function KategoriBaru({ data }) {

    const [ alias, setAlias] = useState("")
    const [ bewara, setBewara ] = useState({
        display: 'hidden',
        content: ""
    })

    const upKategori = async event => {
        event.preventDefault()

        const url = `${process.env.NEXT_PUBLIC_hostname}/api/admin/amaliyah/`
        const options = {
            url: url,
            method: 'POST',
            headers: {
                Authorization: cookie.get('token'),
                'Content-Type': 'application/json'
            },
            data: {
                name: event.target.name.value,
                alias: event.target.alias.value
            }
        }
        const res = await axios.request(options).then(res => res.data).err(err => err.response.data)

        if (res.status == 200) {
            router.push(`/admin/amaliyah`)

            return ''
        }

        setBewara({
            display: 'block',
            content: 'The content you entered was detected as duplicate content.'
        })
    }


    if (data.status == 401) {
        return(<ErrorPage data={data} />)
    }
	
	return(
        <Content 
            title='Kategori Baru'
            description='Laman Dashboard untuk membuat kategori amaliyah baru pada sistem Amaliyah Robithoh Murid'
            label='amaliyah'>
		
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
        
        </Content>
		)
}

export async function getServerSideProps(context) {

    const url = `${process.env.hostname}/api/user/ping`
    const options = {
        url: url,
        method: 'GET',
        headers: { Authorization: `Bearer ${context.req.cookies.token}`}
    }
    const data = await axios.request(options).then(res => res.data).catch(err => err.response.data)

    return {
        props: { data }
    }
}
