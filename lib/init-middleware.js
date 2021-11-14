import jwt from 'jsonwebtoken'
import cors from 'cors'
import { firestore } from './firebase'

const PUBLIC_KEY = process.env.PUBLIC_KEY
let verified

export default function runMiddleware(req, res, method, authorization) {

  const fn = cors({ methods: method })

  return new Promise((resolve, reject) => {

    fn(req, res, async (result) => {
        
      if (method.indexOf(req.method) == -1) {
        return reject({
              status: 401,
              message: 'Unauthorized',
              data: {},
              detail: {},
              error: 'activity of an unregistered identity'
            })
      }

      if (result instanceof Error) {
        return reject(result)
      }

      if (!req.headers.authorization || !req.headers.authorization.split(" ")[1]) {

        console.error({
          info: 'activity of an unregistered identity',
          affectedDevice: req.headers.['user-agent'],
          date: new Date() 
        })

        return reject({
          status: 401,
          message: 'Unauthorized',
          data: {},
          detail: {},
          error: 'activity of an unregistered identity'
        })
      }

      const token = req.headers.authorization.split(" ")[1]

      try {
        verified = jwt.verify(token, PUBLIC_KEY)

        if (authorization.indexOf(verified.role) == -1) {

          return reject({
            status: 401,
            message: 'Unauthorized',
            data: {},
            detail: {
              role: verified.role
            },
            error: 'Your type of role is not allowed here'
          })
        }

        if (verified.device == req.headers['user-agent']) {

          const db = await firestore().collection("user-activity").doc(verified.id)
            .get().then(it => {
              return {
                status: true
              }
            }).catch(err => console.log(err))

          if (db.status == true) {
            return resolve({
              detail: result,
              status: 202,
              message: 'Accepted',
              data: {
                role: verified.role,
                id: verified.id,
                token: token
              },
              detail: verified,
              error: ''
            }) 
          }

        }
      } catch(error) {
        console.error({
          info: error,
          affectedDevice: req.headers['user-agent'],
          date: new Date() 
        })
      }

      return reject({
        status: 401,
        message: 'Unauthorized',
        data: {},
        detail: {},
        error: 'the jwt token is no longer valid'
      })

    })
  })
}