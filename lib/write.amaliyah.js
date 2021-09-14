const firebase = require('firebase-admin')
const { firestore } = require('./firebase')

module.exports = {
	writeKategori: async function (docs) {
        
        try {

            const amaliyah = firestore().collection('amaliyah')

            let kategoriNumber = 0

            await amaliyah.orderBy('createdAt', 'desc').limit(1).get().then(result => {
                if (!result.empty) {
                    result.forEach(document => {
                        kategoriNumber = Number(document.data().kategoriNumber)+1
                    })
                }
            })

            await amaliyah.doc(docs.alias).create({
                ...docs,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                kategoriNumber: kategoriNumber
            })

            const kategoriOrder = await amaliyah.doc('order').get()

            let orders = kategoriOrder.exists ? kategoriOrder.data().kategori : []

            orders.push(docs.alias)

            await kategoriOrder.ref.set({
                kategori: orders,
                kategoriLength: orders.length,
            })

            return true   
        } catch (error) {
            logUtil(error)
            return error.code ? null : undefined
        }

    },
    writePost: async function (docs) {
        
        try {
            await firestore().collection('amaliyah').doc(docs.kategori).collection('post').doc(docs.data.alias).create({
                ...docs.data,
                itemsOrder: [],
                itemsLength: 0,
                author: docs.author,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            return true
        } catch (error) {
            console.log(error)
            return error ? null : undefined
        }
        
    },
    writeItemAsPost: async function (docs) {
        
        try {

            const orderDetails = await firestore().collection('amaliyah').doc(docs.kategori).collection('post').doc(docs.post).get()
       
            const items = await orderDetails.ref.collection('item').orderBy("itemsNumber", "desc").limit(1).get()
            
            let itemsNumberData = items.empty ? 0 : null

            items.docs.forEach(result => {
                itemsNumberData = Number(result.data().itemsNumber)+1
            })

            await orderDetails.ref.collection('item').doc(docs.data.alias ? docs.data.alias : "item" + itemsNumberData).create({
                ...docs.data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                itemsNumber: itemsNumberData,
                author: docs.author
            })

            let orderData = orderDetails.data().itemsOrder

            orderData.push(docs.data.alias ? docs.data.alias : "item" + itemsNumberData)

            await orderDetails.ref.update({
                itemsOrder: orderData,
                itemsLength: orderData.length
            })      

            return true

        } catch (error) {

            logUtil(error)
            return error.code ? null : undefined

        }
    },
    
}