/*
    T-ORD for Tweet from discORD
      -- twit --
      /*
*/

const fs = require('fs')
const https = require('https')
const Twit = require('twit')
var T

function init(callback) {
  T = new Twit({
    consumer_key: global.TORD.APIs.Twitter.consumerKey,
    consumer_secret: global.TORD.APIs.Twitter.consumerSecret,
    access_token: global.TORD.APIs.Twitter.AccessToken,
    access_token_secret: global.TORD.APIs.Twitter.SecretToken
  })
  T.get('account/verify_credentials', { skip_status: true }).then(function (res) {
    if (global.TORD.APIs.Twitter.screen_name != res.data.screen_name) {
      global.TORD.APIs.Twitter.screen_name = res.data.screen_name
      callback({act : 'update', 'screen_name' : res.data.screen_name})
    }
  })
  stream(init, function(res){
    console.log(res)
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

var TOStreams = {}

function stream(act, name, track, callback) {

  function loadSTREAM(name, track, callback) {
    TOStreams[name] = T.stream('statuses/filter', { track: track })

    TOStreams[name].on('tweet', function(tweet) {
      callback({name : name, tweet: tweet})
    })
  }

  if (act == 'status') {
    callback = name
    callback(TOStreams)
  }

  if (act == 'init') {
    callback = name
    if ( Object.keys(global.TORD.Config.Twitter.Streams).length > 0 ) {
      for (var i = 0; i < Object.keys(global.TORD.Config.Twitter.Streams).length; i++ ) {
        loadSTREAM(Object.keys(global.TORD.Config.Twitter.Streams)[i], global.TORD.Config.Twitter.Streams[Object.keys(global.TORD.Config.Twitter.Streams)[i]], function(res) {
          callback(res)
        })
      }
    } else {
      callback(`on n'est rien à lancer`)
    }
  }

  if (act == 'add') {
    loadSTREAM(name, track, function(res) {
      callback(res)
    })
  }

  if (act == 'remove') {
    callback = track
    delete TOStreams[name]
    callback(TOStreams)
  }

}



module.exports = {
  init : init,
  post : postTWEET,
  upload : uploadTWEET,
  rt : reTWEET,
  destroy : destroyTWEET,
  stream : stream
}
