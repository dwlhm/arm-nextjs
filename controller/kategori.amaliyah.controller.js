module.exports = {
      POST: (req, res) => {
            console.log('i write')
            return new Promise((resolve, reject) => {
                  reject('write')
            })    
      }
}