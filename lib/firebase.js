const admin = require('firebase-admin')
var serviceAccount = require("./key/serviceAccountKey.json")


if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://xcampportanidb.firestore.com"
	})	
}

module.exports = {
    firestore: () => admin.firestore(),
	stop: () => admin.firestore().terminate()
}
