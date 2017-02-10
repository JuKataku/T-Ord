/*
    T-ORD for Tweet from discORD
*/

// DISCORD
  /*  Il faut creer un bot discord
        -> https://discordapp.com/developers/applications/me
      Il faut inviter le nouveau bot à rejoindre le salon. Uniquement le proprio peut le faire
        -> https://discordapp.com/oauth2/authorize?&client_id=YYYY&scope=bot
            (remplacer YYYY pour le Client_ID du bot)  */

global.TORD = {}

const config = require('./config')
const discord = require('./discord')

config('read', function(json){
  global.TORD = json
  discord.init(global.TORD.APIs, function(cb, opts){
    console.log(cb)
    if (opts) {
      manage(opts)
    }
  })
})

function manage(opts) {
  if (opts.service == 'Discord') {

    if (opts.act == 'permit' && opts.channel) {
      global.TORD.Config.Discord.Channels.push(opts.channel)
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'revoke' && opts.channel) {
      global.TORD.Config.Discord.Channels = global.TORD.Config.Discord.Channels.splice(opts.channel, 1)
      config('update', function(err) { if (err) { console.log(err) } })
    }

  }

  if (opts.service == 'Twitter') {

    if (opts.act == 'permit' && opts.user) {
      global.TORD.Config.Twitter.Users.push(opts.user)
      config('update', function(err) { if (err) { console.log(err) } })
    }

    if (opts.act == 'revoke' && opts.user) {
      global.TORD.Config.Twitter.Users = global.TORD.Config.Twitter.Users.splice(opts.user, 1)
      config('update', function(err) { if (err) { console.log(err) } })
    }

  }
}
