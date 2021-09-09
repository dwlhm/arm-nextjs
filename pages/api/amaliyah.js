
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { read: listKategori } = require('../../lib/amaliyah')

export default async function handler(req, res) {
  try {

      let kategori = await listKategori()

      if (kategori == null) throw { code: 38.1 }

      if (kategori == undefined) throw undefined

      kategori.forEach(it => {

        it.kategoriNumber = undefined

        return it

      })

      res.status(200).json({
        status: 200,
          message: "Success",
          data: kategori
      })

    } catch(error) {

      console.log(error)

      if (error.code) {

        res.status(400).json({
          status: 400,
            message: "Bad Request",
            data: null 
        })

      }

      res.status(500).json({
        status: 500,
          message: "Internal Server Error",
          data: null 
      })

    }
}
