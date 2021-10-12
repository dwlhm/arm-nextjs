const admin = require('firebase-admin')
var serviceAccount = require("./key/serviceAccountKeyDEV.json")


if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	})	
}

module.exports = {
    firestore: () => admin.firestore(),
	stop: () => admin.firestore().terminate()
}
