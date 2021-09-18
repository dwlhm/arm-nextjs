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

            for (let index = 0; index <= orderData.length; index++) {

                let kategori = await amaliyah.doc(orderData[index]).get()
                
                if (!kategori.data()) continue

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

            const post = await firestore().collection('amaliyah').doc(docs.kategori)
                                            .collection('post').doc(docs.post).get()

            if (!post.exists) throw { code: 38.1 }

            let maxLength = docs.limit || docs.page || (docs.page && docs.limit ) ? (docs.page*docs.limit) : undefined
            let minLength = docs.limit ? maxLength-docs.limit >= 0 ? maxLength-docs.limit : 0 : undefined

            result.info = {
                ...post.data(),
                page: docs.page,
                limit: docs.limit,
                createdAt: post.data().createdAt.toDate(),
                updatedAt: post.data().updatedAt ? post.data().updatedAt.toDate() : undefined
            }

            let order = post.data().itemsOrder

            if (maxLength) order = order.slice(minLength, maxLength)

            if (order.length < 1) return result

            for (var i = 0; i <= order.length; i++) {

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
    },
    readItemOnPost: async function (docs, settings) {

        try {

            let doc = { info: null, item: [] }

            const sub = await firestore().collection('amaliyah').doc(docs[0])
                                        .collection('post').doc(docs[1])
                                        .collection('item').doc(docs[2]).get()

            if (!sub.exists) throw { code: 38.1 }

            let maxLength = settings.limit || settings.page || (settings.page && settings.limit ) ? (settings.page*settings.limit) : undefined
            let minLength = settings.limit ? maxLength-settings.limit >= 0 ? maxLength-settings.limit : 0 : undefined

            doc.info = {
                ...sub.data(),
                page: settings.page,
                limit: settings.limit,
                createdAt: sub.data().createdAt.toDate(),
                updatedAt: sub.data().updatedAt ? sub.data().updatedAt.toDate() : undefined
            }

            let items = doc.info.itemsOrder

            if (settings.maxLength) items = items.slice(minLength, maxLength)

            if (!items) return doc
            
            for (let index = 0; index <= items.length; index++) {
                const element = await sub.ref.collection('item')
                                            .doc(items[index]).get()

                if (!element.exists) continue

                doc.item.push({
                    ...element.data(),
                    createdAt: element.data().createdAt.toDate(),
                    updatedAt: element.data().updatedAt 
                                    ? element.data().updatedAt.toDate() 
                                    : undefined, 
                })
                
            }

            return doc
            
        } catch (error) {

            console.log(error)
            return error.code ? null : undefined
            
        }
        
    }
}