import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Header from '../../../../../components/header'
import Nav from '../../../../../components/nav'
import fetch from 'node-fetch'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import ErrorPage from '../../../../../components/error-page'
import axios from 'axios'
import cookie from 'js-cookie'
import Content from '../../../../../components/content'

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

    let manipulatedPost = post.replace(/-/g, ' ')

    const [ content, setContent ] = useState([''])

    const upItem = async event => {
        event.preventDefault()

        const url = `${process.env.NEXT_PUBLIC_hostname}/api/admin/amaliyah/${kategori}/${post}`
        const options = {
            url: url,
            method: 'POST',
            headers: {
                Authorization: cookie.get('token'),
                'Content-Type': 'application/json'
            },
            data: { body: content }
        }
        const res = await axios.request(options).then(res => res.data).catch(err => err.response.data)

        if (res.status == 200) {
            router.push(`/admin/amaliyah/${kategori}/${post}/`)

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
        <Content
            data={data}
            title="Item Baru"
            description="Laman Dashboard untuk membuat Item baru dari post terkait pada sistem Amaliyah Robithoh Murid"
            label="amaliyah">

                <div className="grid grid-cols-6 gap-4 mt-10 mb-5">
                    <div className="border-2 border-ungu rounded-md flex justify-center items-center">
                        <Link href={`/admin/amaliyah/${kategori}/${post}/${item}`}><a>Kembali</a></Link>
                    </div>
                    <div className="col-span-4 flex flex-wrap items-center ungu rounded-md p-3">
                        <h2 className="font-bold text-base text-white">Item Baru</h2>
                    </div>
                    <div className="flex flex-wrap flex-col justify-center ungu rounded-md p-3">
                        <div className="text-xs text-white">Post</div> 
                        <h2 className="text-base text-white">{ manipulatedPost.replace(/(^\w{1})|(\s{1}\w{1})/g, firstLetter => firstLetter.toUpperCase()) }</h2>
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

    </Content>
    )
}

export async function getServerSideProps(context) {

    const url = `${process.env.hostname}/api/user/ping`
    const options = {
        url: url,
        method: 'GET',
        headers: { Authorization: `Bearer ${context.req.cookies.token}` }
    }
    const data = await axios.request(options).then(res => res.data).catch(err => err.response.data)

    return {
        props: { data }
    }
}