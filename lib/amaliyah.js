const firebase = require('firebase-admin')
const { firestore } = require('./firebase')

module.exports = {
    read: async function () {

        try {
            let doc = []

            const amaliyah = firestore().collection('amaliyah')

            const order = await amaliyah.doc('order').get()

            if (!order.exists) throw { code: 38.1 }

            const orderData = await order.data().kategori

            for (let index = 0; index < orderData.length; index++) {

                let kategori = await amaliyah.doc(orderData[index]).get()
                
                if (!kategori.data()) throw { code: 38.1 }

                doc.push({
                    ...kategori.data(),
                    createdAt: kategori.data().createdAt.toDate(),
                    updatedAt: kategori.data().updatedAt ? kategori.data().updatedAt.toDate() : undefined, 
                })
                
            }

            return doc

        } catch (error) {
            console.log(error)
            return error.code ? null : undefined
        }

    },
    readKategori: async function (docs) {
        
        try {

            let result = { info: null, post: null }
            let posts = await firestore().collection('amaliyah').doc(docs.kategori).get()

            if (!posts.exists) throw { code: 38.1 }

            result.info = {
                            ...posts.data(),
                            createdAt: posts.data().createdAt.toDate()
                                            ? posts.data().createdAt.toDate()
                                            : undefined,
                            updatedAt: posts.data().updatedAt 
                                            ? posts.data().updatedAt.toDate() 
                                            : undefined, 
                }

            let postsItem = await posts.ref.collection('post').get()

            if (postsItem.exists) return result

            result.post = postsItem.docs.map(it => {
                return {
                    ...it.data(),
                    createdAt: it.data().createdAt.toDate(),
                    updatedAt: it.data().updatedAt ? it.data().updatedAt.toDate() : undefined
                }
            })

            return result
            
        } catch (error) {

            console.log(error)
            return error.code ? null : undefined

        }
    },
    readPost: async function (docs) {

        try {

            let result = { info: undefined, item: [] }

            const post = await firestore().collection('amaliyah').doc(docs.kategori).collection('post').doc(docs.post).get()

            if (!post.exists) throw { code: 38.1 }

            result.info = {
                ...post.data(),
                createdAt: post.data().createdAt.toDate(),
                updatedAt: post.data().updatedAt ? post.data().updatedAt.toDate() : undefined
            }

            const order = post.data().itemsOrder

            if (order.length < 1) return result

            for (var i = 0; i < order.length; i++) {

                if (!order[i]) continue

                let item = await post.ref.collection('item').doc(order[i]).get()

                if (!item.exists) continue

                result.item.push({
                                        ...item.data(), 
                                        createdAt: item.data().createdAt.toDate(),
                                        updatedAt: item.data().updatedAt ? item.data().updatedAt.toDate() : undefined 
                                    })
            }        

            return result
            

        } catch(error) {

            console.log(error)
            return error.code ? null : undefined

        }
    }
}