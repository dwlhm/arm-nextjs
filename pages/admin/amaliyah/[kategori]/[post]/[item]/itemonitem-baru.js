import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Header from '../../../../../../components/header'
import Nav from '../../../../../../components/nav'
import ErrorPage from '../../../../../../components/error-page'
import fetch from 'node-fetch'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import axios from 'axios'
import cookie from 'js-cookie'

const MDEditor = dynamic(() => import("react-markdown-editor-lite"), {
	ssr: false
})

export default function ItemonitemBaru({ data }) {

	const router = useRouter()

    const [ docs, setDocs ] = useState({
        kategori: "",
        post: "",
        item: ""
    })

    useEffect(()=>{
        if(!router.isReady) return;

        setDocs(router.query)

    }, [router.isReady]);

    const { kategori, post, item } = docs

    let manipulatedItem = item.replace(/-/g, ' ')

    const [ content, setContent ] = useState([''])

    const upItem = async event => {
        event.preventDefault()

        const url = `${process.env.NEXT_PUBLIC_hostname}/api/admin/amaliyah/${kategori}/${post}/${item}`
        const options = {
            url: url,
            method: 'POST',
            data: { body: content },
            headers: {
                Authorization: cookie.get('token'),
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.request(options).then(res => res.data).catch(err => err.response.data)

        if (res.status == 200) {
            router.push(`/admin/amaliyah/${kategori}/${post}/${item}`)

            return ''
        }


        setBewara({
            display: 'block',
            content: 'The content you entered was detected as duplicate content.'
        })
    }

    if (data.status !== 200) {
        return(<ErrorPage data={data} />)
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

                <div className="grid grid-cols-6 gap-4 mt-10 mb-5">
                    <div className="border-2 border-ungu rounded-md flex justify-center items-center">
                        <Link href={`/admin/amaliyah/${kategori}/${post}/${item}`}><a>Kembali</a></Link>
                    </div>
                    <div className="col-span-4 flex flex-wrap items-center ungu rounded-md p-3">
                        <h2 className="font-bold text-base text-white">Item Baru</h2>
                    </div>
                    <div className="flex flex-wrap items-center ungu rounded-md p-3">
                        <div className="text-xs text-white">ItemOnPost</div> 
                        <h2 className="text-base text-white">{ manipulatedItem.replace(/(^\w{1})|(\s{1}\w{1})/g, firstLetter => firstLetter.toUpperCase()) }</h2>
                    </div>
                </div>
                <form className="mb-5" onSubmit={upItem}>
                	<MDEditor
                        name="content"
                		style={{ minHeight: "500px" }}
                		renderHTML={(text) => {
                            setContent(text.split('\n'))
                            return <ReactMarkdown>{text}</ReactMarkdown>
                        }}
                	/>
                    <button type="submit" className="rounded-md ungu text-white text-base p-2 flex flex-wrap justify-center items-center w-full mt-5">
                        Simpan Item
                    </button>
                </form>  
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    console.log(context.req.cookies)
    const url = `${process.env.hostname}/api/user/ping`
    const options = {
        url: url,
        method: 'GET',
        headers: { Authorization: cookie.get('token') }
    }
    const data = await axios.request(options).then(res => res.data).catch(err => err.response.data)

    return {
        props: { data }
    }

}