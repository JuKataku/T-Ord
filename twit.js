/*
    T-ORD for Tweet from discORD
      -- twit --
*/

const fs = require('fs')
const https = require('https')
const Twit = require('twit')
var T

function init() {
  T = new Twit({
    consumer_key: global.TORD.APIs.Twitter.consumerKey,
    consumer_secret: global.TORD.APIs.Twitter.consumerSecret,
    access_token: global.TORD.APIs.Twitter.AccessToken,
    access_token_secret: global.TORD.APIs.Twitter.SecretToken
    // timeout_ms: 60*1000  /* semblerait que ce soit lui qui soit à la source de bug/shutdown du script */
  })
}

function postTWEET(msg, callback) {
  T.post('statuses/update', { status: msg }, function(err, data, response) {
    callback(data)
  })
}

function uploadTWEET(msg, attachments, callback) {

  var tmpNAME = attachments[0].url.split('/')[attachments[0].url.split('/').length-1]
  var tmpIMG = fs.createWriteStream(tmpNAME)

  tmpIMG.on('close', function(){

    var b64content = fs.readFileSync(tmpNAME, { encoding: 'base64' })

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {

      var mediaIdStr = data.media_id_string
      var altText = "upload by T-Ord"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      T.post('media/metadata/create', meta_params, function (err, data, response) {

        if (!err) {
          var params = { status: msg, media_ids: [mediaIdStr] }
          T.post('statuses/update', params, function (err, data, response) {

            fs.unlink(tmpNAME, function(err){
              if (err) {
                callback(err)
              } else {
                callback(data)
              }

            })

          })
        }
      })
    })

  })

  https.get( attachments[0].url, function(res) {
    res.pipe(tmpIMG)
  })


}

function reTWEET(id, callback) {
  T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
    callback(data)
  })
}

function destroyTWEET(id, callback) {
  T.post('statuses/destroy/:id', { id: id }, function (err, data, response) {
    callback(data)
  })
}



module.exports = {
  init : init,
  post : postTWEET,
  upload : uploadTWEET,
  rt : reTWEET,
  destroy : destroyTWEET
}
