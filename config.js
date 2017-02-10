/*
    TORD for Tweet from discORD
      -- jsonfile --
*/

const jsonfile = require('jsonfile')


function jsonCONFIG(act, callback) {

  if (act == 'read') {
    jsonfile.readFile('conf.json', function(err, data){
      if (err) {
        callback(err)
      } else {
        callback(data)
      }
    })
  }

  else if (act == 'update') {
    jsonfile.writeFile('conf.json', global.TORD, {spaces: 2}, function (err) {
      callback(err)
    })
  }
}

module.exports = jsonCONFIG
