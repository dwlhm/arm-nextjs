import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../../../components/header'
import Nav from '../../../../components/nav'
import ErrorPage from '../../../../components/error-page'
import axios from 'axios'
import Content from '../../../../components/content'

export default function Kategori({ data }) {

	const router = useRouter()
	const { kategori } = router.query

	return(
        <Content
            data={data}
            title={data.name}
            description="Laman Dashboard untuk membuat post baru dari kategori amaliyah pada sistem Amaliyah Robithoh Murid"
            label="amaliyah">

                <div className="flex flex-wrap justify-center items-center border-2 border-ungu rounded-md hover:border-black py-2 px-5 w-max mt-10 mb-3">
                    <Link href={`./`}><a>Kembali</a></Link>
                </div>

                <div className="my-2 grid grid-cols-6 gap-4">
                    <h4 className="ungu rounded-md text-base text-white p-5 col-span-5">{data.data.info.name}</h4>
                    <div className="border-2 border-ungu rounded-md flex justify-center items-center">
                        <Link href={`/admin/amaliyah/${kategori}/post-baru`}><a>Tambah Post</a></Link>
                    </div>
                </div>

            	{ data.data.post.map(data => ( 

                    <div key={data.alias} className="my-2 grid grid-cols-5 gap-4">
                        <h4 className="bg-gray-400 rounded-md text-base text-white p-5 col-span-3">{data.name}</h4>
                        <div className="col-span-2 grid grid-cols-4 gap-4 p-2">
                            <div className="flex flex-wrap justify-center items-center border-2 text-white border-white bg-gray-400 rounded-md hover:bg-black hover:text-white">
                                <Link href={`/admin/amaliyah/${kategori}/${data.alias}`}><a>Buka</a></Link>
                            </div>
                            <div className="col-span-2 flex flex-wrap justify-center items-center border-2 border-gray-400 rounded-md hover:bg-black hover:text-white">
                                <Link href={`/admin/amaliyah/${kategori}/${data.alias}/post-baru`}><a>Tambah Post</a></Link>
                            </div>
                            <div className="flex flex-wrap justify-center items-center border-2 border-black rounded-md hover:bg-black hover:text-white">
                                <Link href={`/admin/amaliyah/${kategori}/${data.alias}/edit-kategori`}><a>Edit</a></Link>
                            </div>
                        </div>
                    </div>

                 )) }

        </Content>
		)
}

export async function getServerSideProps(context) {
	const kategori = context.query.kategori

    const url = `${process.env.hostname}/api/admin/amaliyah/${kategori}`
    const options = {
        url: url,
        method: 'GET',
        headers: { Authorization: `Bearer ${context.req.cookies.token}`}
    }
    const data = await axios.request(options).then(res => res.data).catch(err => err.response.data)

    return {
        props: {
            data
        }
    }

}