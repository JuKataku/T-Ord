/*
    T-ORD for Tweet from discORD
*/

global.TORD = {}

const config = require('./config')
const discord = require('./discord')

config('read', function(json){
  global.TORD = json
  discord.init(global.TORD.APIs, function(cb, opts){
    console.log(cb)
    if (opts) {
      console.log(` -- options --\n`, opts)
      manage(opts)
    }
  })
})

function manage(opts) {
  if (opts.service == 'Discord') {

    if (opts.act == 'permit' && opts.channel) {
      global.TORD.Config.Discord.Channels.Listen.push(opts.channel)
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'announcement' && opts.channel) {
      global.TORD.Config.Discord.Channels.Announcement = opts.channel
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'revoke' && opts.channel) {
      global.TORD.Config.Discord.Channels.Listen.splice(global.TORD.Config.Discord.Channels.Listen.indexOf(opts.user), 1)
      config('update', function(err) { if (err) { console.log(err) } })
    }

  }

  if (opts.service == 'Twitter') {

    if (opts.act == 'addUser' && opts.user) {
      global.TORD.Config.Twitter.Users.push(opts.user)
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'removeUser' && opts.user) {
      global.TORD.Config.Twitter.Users.splice(global.TORD.Config.Twitter.Users.indexOf(opts.user), 1)
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'addStream' && opts.name && opts.track) {
      global.TORD.Config.Twitter.Streams[opts.name] = opts.track
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'removeStream' && opts.name) {
      delete global.TORD.Config.Twitter.Streams[opts.name]
      config('update', function(err) { if (err) { console.log(err) } })
    }

  }
}
