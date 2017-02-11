/*
    T-ORD for Tweet from discORD
      -- discord.io --
*/

const Discord = require('discord.io')

var uptimeBOT = {
  initDate : new Date().getTime(),
  reconnection : 0
}

    // Function UPTIME
function uptime(callback) {
  var uptime = Math.round( (new Date().getTime() - uptimeBOT.initDate) /1000 )
  var days    =  Math.floor( uptime /60/60/24 )
  var hours   =  Math.floor( (uptime - (days *60*60*24)) /60/60 )
  var minutes =  Math.floor( (uptime - ( hours *60*60 ) - (days *60*60*24)) /60/60 )
  var secs    =  uptime - ( minutes * 60) - ( hours *60*60 ) - (days *60*60*24)
  if (days > 0) {
    callback("Day " + days + " [" + hours + ":" + minutes + ":" + secs + "]")
  } else {
    callback("[" + hours + ":" + minutes + ":" + secs + "]")
  }
}


const T = require('./twit')

function init(token, callback) {

  T.init()

  var bot = new Discord.Client({
    token: token.Discord.Token,
    autorun: true
  })

  bot.on('ready', function() {
    callback(`Logged in as ${bot.username} - ${bot.id}`)
  })

  bot.on('message', function(user, userID, channelID, message, event) {

    if( message[0] == '!') {  // uniquement si nous avons un message de la forme !COMMAND

      var command = message.slice(1, ( (message.indexOf(' ') != -1) ? message.indexOf(' '):message.length ))
      var option = message.slice(command.length+2, message.length)


        //  UPTIME
      if (command.toUpperCase() === "UPTIME" && global.TORD.Config.Discord.Channels.includes(channelID)) {
        uptime(function(uptime){
          if (option.toUpperCase() === "FULL") {
            var resMES = `${uptime} || ${uptimeBOT.reconnection} reconnection`
          } else {
            var resMES = uptime
          }
          bot.sendMessage({
            to: channelID,
            message: "```Uptime " + resMES + "```"
          })
        })
      }


        //  HELP
      if (command.toUpperCase() === "HELP") {
        if (userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id || global.TORD.Config.Discord.Channels.includes(channelID) ) {
          bot.sendMessage({
            to: channelID,
            message: "```" + helpMESG + " ```"
          })
        }
      }


        //  PERMIT
      if (command.toUpperCase() === "PERMIT") {


        if (option.toUpperCase() === "DISCORD" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
          if ( !global.TORD.Config.Discord.Channels.includes(channelID) ) {
            bot.sendMessage({
              to: channelID,
              message: '`Le Salon #' + bot.channels[channelID].name + ' est configuré pour tweeter`'
            })
            callback(`PERMIT DISCORD #${bot.channels[channelID].name}`, {service : 'Discord', act : 'permit', channel: channelID})

          } else {
            bot.sendMessage({
              to: channelID,
              message: '`Ce Salon #' + bot.channels[channelID].name + ' est déjà configuré pour tweeter`'
            })
          }
        }

        if (option.toUpperCase() === "TWITTER" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) { // voir ici si on ajoute pas des droits
          var twitterUserName
          bot.sendMessage({
            to: channelID,
            message: '`L\'utilisateur @' + bot.channels[channelID].name + ' a été ajouté`'
          })
          callback(`PERMIT TWITTER @${twitterUserName} on discord configuration`, {service : 'Twitter', act : 'permit', user: twitterUserName})
        }

      }


        //  REVOKE
      if (command.toUpperCase() === "REVOKE") {

        if (option.toUpperCase() === "DISCORD" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
          bot.sendMessage({
            to: channelID,
            message: '`Le Salon #' + bot.channels[channelID].name + ' n\'est plus configuré pour tweeter`'
          })
          callback(`REVOKE DISCORD #${bot.channels[channelID].name}`, {service : 'Discord', act : 'revoke', channel: channelID})
        }

        if (option.toUpperCase() === "TWITTER" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
          bot.sendMessage({
            to: channelID,
            message: '`L\'utilisateur @' + bot.channels[channelID].name + ' a été supprimé`'
          })
          callback(`REVOKE DISCORD #${bot.channels[channelID].name}`, {service : 'Twitter', act : 'revoke', user: twitterUserName})
        }

      }


        //  TWEET
      if (command.toUpperCase() === "TWEET" && global.TORD.Config.Discord.Channels.includes(channelID) ) {

        if (event.d.attachments) {

          if (option) {
            var msgREQ = option + ' --' + user
          } else {
            var msgREQ = ''
          }

          T.upload(msgREQ, event.d.attachments, function(cb){

            if (cb.id_str) {
              bot.sendMessage({
                to: channelID,
                message: 'TWEET : `' + bot.fixMessage(msgREQ) + '` https://twitter.com/' + cb.user.screen_name + '/status/' + cb.id_str
              })
            } else {
              bot.sendMessage({
                to: channelID,
                message: 'ERROR : `' + cb.errors[0].message + '`'
              })
            }

          })

        } else if (option == '') {
          bot.sendMessage({ to: channelID, message: '`!TWEET message`' })

        } else {
          var msgREQ = option + ' --' + user
          if (msgREQ.length >= 140){
            bot.sendMessage({ to: channelID, message: '`Message trop long`' })
          } else {
            var msgREQ = option + ' --' + user

            T.post(msgREQ, function(data){

              if (data.id_str) {
                bot.sendMessage({
                  to: channelID,
                  message: 'TWEET : `' + bot.fixMessage(msgREQ) + '` https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str
                })
              } else {
                bot.sendMessage({
                  to: channelID,
                  message: 'ERROR : `' + data.errors[0].message + '`'
                })
              }

            })

          }
        }
      }


        //  RT
      if (command.toUpperCase() === "RT" && global.TORD.Config.Discord.Channels.includes(channelID) ) {

        if (option == '') {
          bot.sendMessage({ to: channelID, message: '`!RT url`' })

        } else if ( option.toUpperCase().startsWith('HTTP') ) {
          var idTweet = option.split('/')[option.split('/').length-1]
          if ( !isNaN(idTweet) ) {
            T.rt(idTweet, function(data) {
              if (data.id_str) {
                bot.sendMessage({
                  to: channelID,
                  message: 'RT : `' + option
                })
              } else {
                bot.sendMessage({
                  to: channelID,
                  message: 'ERROR : ' + data.errors[0].message + '`'
                })
              }
            })
          }
        }
      }


        //  DESTROY
      if (command.toUpperCase() === "DESTROY" && global.TORD.Config.Discord.Channels.includes(channelID) ) {

        if (option == '') {
          bot.sendMessage({ to: channelID, message: '`!DESTROY url`' })

        } else if (option.slice(0,4).toUpperCase() == 'HTTP') {
          var idTweet = option.split('/')[option.split('/').length-1]
          if ( !isNaN(idTweet) ) {
            T.destroy(idTweet, function(data) {
              if (data.id_str) {
                bot.sendMessage({
                  to: channelID,
                  message: 'Tweet Effacé'
                })
              } else {
                bot.sendMessage({
                  to: channelID,
                  message: 'ERROR : ' + data.errors[0].message + '`'
                })
              }
            })
          }
        }
      }

    }
  })

  bot.on('disconnect', function(errMsg, code) {     // EN CAS DE DISCONNECT (un peu brutasse, mais fonctionnel)
    console.log(`   -- Reconnection du Bot Discord.`)
    bot.connect()
    uptimeBOT.reconnection++
  })

}

module.exports = {
  init: init
}

var helpMESG = `Toutes les commandes ne sont pas sensible à la casse. ( !HELP = !help = !Help)

!HELP
  pour avoir ce message (lol ?)

!PERMIT pour donner des droits en fonction des services
  |--> DISCORD pour autoriser le bot à tweet ou RT sur CE salon (only owner)
  |--> TWITTER @username pour ajouter l'écoute sur cet utilisateur

!REVOKE pour supprimer des droits donnés
  |--> DISCORD pour supprimer le bot à tweet ou RT
  |--> TWITTER @username pour supprimer l\'écoute sur cet utilisateur

!TWEET votre message
  pour envoyer un tweet
    (attention, il n'est pas possible de faire de Tweet avec plusieurs images)

!RT url du tweet
  pour RT un tweet

!DESTROY url du tweet
  pour effacer un tweet

!UPTIME
  pour savoir depuis combien de temps la session du serveur tourne
  |--> FULL pour avoir plus d'info

En cas de bug --> @JuJoueA / @SoRiz_`
