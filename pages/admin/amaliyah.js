import { useState } from "react"
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Head from 'next/head'
import fetch from 'node-fetch'
import Header from '../../components/header'
import Nav from '../../components/nav'
import ErrorPage from '../../components/error-page'
import axios from 'axios'
import cookie from 'js-cookie'

export default function Amaliyah({ data }) {
    
    const [ content, setContent ] = useState("")
    const [ hostname, setHostname ] = useState("")

    if (data.status == 401) {
        return(<ErrorPage title="login" link="/users/login" message={data.status + " | " + data.message} />)
    }

    return(
        <div>

            <Head>
                <title>Amaliyah | API Amaliyah Robithoh Murid</title>
                <meta name="description" content="Dashboard Amaliyah of Amaliyah Robithoh Murid" />
            </Head>

            <div className="mx-16 my-2">
                <Header />
                <Nav />
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-4">
                        <h2 className="pt-10 pb-3 text-base font-bold">Amaliyah</h2>
                    </div>
                    <div className="rounded-md ungu text-white text-base p-2 mt-10 flex flex-wrap justify-center items-center">
                        <Link href="/admin/amaliyah/kategori-baru"><a>Tambah Kategori</a></Link>
                    </div>
                </div>
                { data.data.map(data => ( 

                    <div key={ data.alias } className="my-2 grid grid-cols-5 gap-4">
                        <h4 className="ungu rounded-md text-base text-white p-5 col-span-3">{data.name}</h4>
                        <div className="col-span-2 grid grid-cols-4 gap-4 p-2">
                            <div className="flex flex-wrap justify-center items-center border-2 text-white border-white ungu rounded-md hover:bg-black hover:text-white">
                                <Link href={`/admin/amaliyah/${data.alias}`}><a>Buka</a></Link>
                            </div>
                            <div className="col-span-2 flex flex-wrap justify-center items-center border-2 border-ungu rounded-md hover:bg-black hover:text-white">
                                <Link href={`/admin/amaliyah/${data.alias}/post-baru`}><a>Tambah Post</a></Link>
                            </div>
                            <div className="flex flex-wrap justify-center items-center border-2 border-black rounded-md hover:bg-black hover:text-white">
                                <Link href={`/admin/amaliyah/${data.alias}/edit-kategori`}><a>Edit</a></Link>
                            </div>
                        </div>
                    </div>

                 )) }
            </div>
        </div>
    )
}

export async function getServerSideProps() {

    const url = `${process.env.hostname}/api/admin/amaliyah`
    const options = {
        url: url,
        method: 'GET',
        headers: { Authorization: cookie.get('token')}
    }
    const data = await axios.request(options).then(res => res.data).catch(err => err.response.data)

    return {
        props: {
            data
        }
    }

}