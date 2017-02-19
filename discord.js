/*
    T-ORD for Tweet from discORD
      -- discord.io --
*/

const packageJSON = require('./package.json')
const Discord = require('discord.io')

var uptimeBOT = {
  initDate : new Date().getTime(),
  reconnection : 0,
  lastTweet : ''
}

const T = require('./twit')

function init(token, callback) {

  var bot = new Discord.Client({
    token: token.Discord.Token,
    autorun: true
  })


    // Function SIMTYPE
  function simType(channel) {
    if (!channel && global.TORD.Config.Discord.Channels.Announcement) {
      bot.simulateTyping(global.TORD.Config.Discord.Channels.Announcement, function() {})
    } else if (channel === "ALL") {
      simType()
      if (global.TORD.Config.Discord.Channels.Listen.length > 0) {
        for (var i = 0; i < global.TORD.Config.Discord.Channels.Listen.length; i++) {
          simType(global.TORD.Config.Discord.Channels.Listen[i])
        }
      }
    } else {
      bot.simulateTyping(channel)
    }
  }

    // Function channelExist
  function channelExist(channelID, type, callback) {
    if (type == 'Announcement') {
      if (!bot.channels[channelID]) {
        callback(`  - Le channel Announcement n'existe plus`, {service : 'Discord', act : 'announcement', channel: ''})
      }
    } else if (type == 'Listen') {

    }
  }

    // Function BOTTALK
  function botTalk(channel, msg, other) {

    if (other == 'full' && global.TORD.Config.Discord.Channels.Announcement && bot.channels[global.TORD.Config.Discord.Channels.Announcement]) {
      botTalk( global.TORD.Config.Discord.Channels.Announcement, msg )
      botTalk( channel, msg )

    } else if (other == 'announcement' && global.TORD.Config.Discord.Channels.Announcement && bot.channels[global.TORD.Config.Discord.Channels.Announcement]){
      botTalk( global.TORD.Config.Discord.Channels.Announcement, msg )

    } else {
      bot.sendMessage({
        to: channel,
        message: msg
      })
    }
  }


    // Function deleteMSG
  function deleteMSG(channelID, limit) {
    if (!limit) {
      limit = 1
    } else if (limit >= 100) {
      limit = 100
    }
    function eraserMSG(channelID, msgID, i) {
      setTimeout(function(){
        bot.deleteMessage({ channelID: channelID, messageID: msgID }, function(err){
          if (err) { console.log(err) }
        })
      }, i * 500)
    }
    bot.getMessages({
      channelID: channelID,
      limit: Number(limit)
    }, function(error, messageArr) {
      for (var i = 0; i < messageArr.length; i++) {
        eraserMSG(channelID, messageArr[i].id, i)
      }
    })
  }

    // Function buildINFO
  function buildINFO(dataIN, callback) {

    function listListen() {
      var res = ''
      for (var i = 0; i < global.TORD.Config.Discord.Channels.Listen.length; i++ ) {
        res += '`#' + bot.channels[global.TORD.Config.Discord.Channels.Listen[i]].name + '` '
      }
      return res
    }

    function listTUsers() {
      var res = ''
      for (var i = 0; i < global.TORD.Config.Twitter.Users.length; i++ ) {
        res += '`@' + global.TORD.Config.Twitter.Users[i] + '` '
      }
      return res
    }

    function listStream() {
      var res = ''
      for (var i = 0; i < Object.keys(global.TORD.Config.Twitter.Streams).length; i++ ) {
        res += '        `' + Object.keys(global.TORD.Config.Twitter.Streams)[i] + ' : ' + global.TORD.Config.Twitter.Streams[Object.keys(global.TORD.Config.Twitter.Streams)[i]] + '`\n '

      }
      return res
    }

    var resMSG = `
__**DISCORD**__

    Server Name : \`${bot.servers[ bot.channels[dataIN.channelID].guild_id ].name}\`
    Owner : \`${bot.users[ bot.servers[ bot.channels[dataIN.channelID].guild_id ].owner_id ].username}\`
    Channel Announcement : \`${(global.TORD.Config.Discord.Channels.Announcement ? '#' + bot.channels[global.TORD.Config.Discord.Channels.Announcement].name : 'none' )}\`
    Channels Listening : ${ (global.TORD.Config.Discord.Channels.Listen.length > 0 ? listListen() : '`none`' ) }

__**TWITTER**__

    Screen Name : \`@${global.TORD.APIs.Twitter.screen_name}\`
    Url : \`http://twitter.com/@${global.TORD.APIs.Twitter.screen_name}\`
    Users Listening : ${ (global.TORD.Config.Twitter.Users.length > 0 ? listTUsers() : '`none`' ) }
    Streams :
${ (Object.keys(global.TORD.Config.Twitter.Streams).length > 0 ? listStream() : '`none`' ) }
__**BOT / APPs**__

  **BOT**
      Uptime : \`${dataIN.uptime}\`
      Reconnexion : \`${uptimeBOT.reconnection}\`

  **APPS**
      T-Ord : \`v${packageJSON.version}\`
      NodeJS : \`${process.version}\` `
    callback(resMSG)
  }


    // Function UPTIME
  function uptime(callback) {
    var uptime = Math.round( (new Date().getTime() - uptimeBOT.initDate) /1000 )
    var dd = Math.floor( uptime /60/60/24 )
    var hh = Math.floor( (uptime - (dd *60*60*24)) /60/60 )
    var mm = Math.floor( (uptime - ( hh *60*60 ) - (dd *60*60*24)) /60 )
    var sec = uptime - ( mm * 60) - ( hh *60*60 ) - (dd *60*60*24)

    callback( (dd < 0 ? "Day " + dd +  + " " : "") + "[" +
      (hh < 10 ? "0" + hh : hh) + ":" +
      (mm < 10 ? "0" + mm : mm) + ":" +
      (sec < 10 ? "0" + sec : sec) + "]" )
  }


  T.init(function(res){
    if (res.act == 'update') { // dans le cas ou le twitter du bot a changé de screen_name.
      callback('UPDATE screen_name ON TWITTER', {service : 'Twitter', act : 'updateScreenName', screen_name: res.screen_name} )
    }
  })


  bot.on('ready', function() {
    simType('ALL')
    callback( `
 -- [DISCORD] Logged with [ ${bot.username} || ${bot.id} ]
 -- [TWITTER] Logged with [ @${global.TORD.APIs.Twitter.screen_name} ]
 ` )
    bot.setPresence({ game: { name : "[T-Ord] v" + packageJSON.version } })
    T.stream('init', function(res){

      if (res.tweet.in_reply_to_status_id_str == null && global.TORD.Config.Twitter.Users.indexOf(res.tweet.user.screen_name) >= 0) {
        T.rt(res.tweet.id_str, function(data) {
          if (data.id_str) {
            callback(`  - STREAM RT | https://twitter.com/${data.retweeted_status.user.screen_name}/status/${data.retweeted_status.id_str}`)
            botTalk('', `**RT @ ${data.retweeted_status.user.screen_name}** @here https://twitter.com/${data.retweeted_status.user.screen_name}/status/${data.retweeted_status.id_str}`, 'announcement')
          } else {
            callback(`  - STREAM RT | ERROR : ${data.errors[0].message}`)
            botTalk('', `ERROR : ${data.errors[0].message}`)
          }
        })
      }

    })
  })


  bot.on('message', function(user, userID, channelID, message, event) {

    if( message[0] == '!') {

      var command = message.slice(1, ( (message.indexOf(' ') != -1) ? message.indexOf(' '):message.length ))
      var option = message.slice(command.length+2, message.length)

        //  HELP (owner || in permit channel)
      if (command.toUpperCase() === "HELP") {
        if (userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id || global.TORD.Config.Discord.Channels.Listen.includes(channelID) ) {
          callback('  - ' + command.toUpperCase())
          botTalk(channelID, helpMESG)
        }
      }

          // INFO
      if (command.toUpperCase() === "INFO" && global.TORD.Config.Discord.Channels.Listen.includes(channelID) ) {
        uptime(function(uptime) {
          buildINFO({channelID: channelID, uptime: uptime}, function(resMSG){
            callback('  - ' + command.toUpperCase())
            botTalk(channelID, resMSG)
          })
        })
      }

        //  PURGE (owner only)
      if (command.toUpperCase() === "PURGE") {
        if (userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
          simType(channelID)
          if ( !isNaN(option.split(' ')[0]) ) {
            callback('  - ' + command.toUpperCase() + (option ? ' ' + option : ''))
            deleteMSG(channelID, option.split(' ')[0])
          }
        }
      }


        //  DISCORD
          // PERMIT (owner only)
      if (command.toUpperCase() === "PERMIT" && option.toUpperCase() === "" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
        if ( !global.TORD.Config.Discord.Channels.Listen.includes(channelID) ) {
          callback('  - ' + command.toUpperCase(), {service : 'Discord', act : 'permit', channel: channelID})
          botTalk( channelID, `__**PERMIT**__\n       **#${bot.channels[channelID].name}** est configuré pour tweeter`)
        } else {
          botTalk( channelID, `__**PERMIT**__\n       **#${bot.channels[channelID].name}** est déjà configuré pour tweeter`)
        }
      }

          // ANNOUNCEMENT (owner only)
      if (command.toUpperCase() === "ANNOUNCEMENT" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
        function chan(callback){
          if (option.slice(0, 2) === "<#" && bot.servers[ bot.channels[option.replace(/<|#|>/gi , '')].guild_id ] ) {
            callback(option.replace(/<|#|>/gi , ''))
          } else {
            callback(channelID)
          }
        }
        chan(function(channel){
          callback('  - ' + command.toUpperCase() + (option ? ' ' + bot.fixMessage(option) : ''), {service : 'Discord', act : 'announcement', channel: channel})
          botTalk( channelID, `__**ANNOUNCEMENT**__\n       **#${bot.channels[channel].name}** servira pour informer votre communauté discord`)
        })
      }

          // REVOKE (owner only)
      if (command.toUpperCase() === "REVOKE" && option.toUpperCase() === "" && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {
        callback('  - ' + command.toUpperCase(), {service : 'Discord', act : 'revoke', channel: channelID})
        botTalk( channelID, `__**REVOKE**__\n       **#${bot.channels[channelID].name}** n'est plus configuré pour tweeter`)
      }

          // SAY (on channel permit and if ANNOUNCEMENT)
      if (command.toUpperCase() === "SAY" && global.TORD.Config.Discord.Channels.Listen.includes(channelID) && global.TORD.Config.Discord.Channels.Announcement) {
        if (option) {
          callback('  - ' + command.toUpperCase() + ' : ' + option)
          botTalk( channelID, "*" + option + "*", 'announcement' )
        }
      }


        // TWITTER
          // TWEET (channel permit)
      if (command.toUpperCase() === "TWEET" && global.TORD.Config.Discord.Channels.Listen.includes(channelID) ) {
        if (option == '') { option = 'none'}

        function buildMSG(option, user, callback) {
          var anonymus = '-a'
          if (option != 'none') {
            if ( global.TORD.Config.Twitter.AppendMSG == '' || option.split(' ')[0] == anonymus) {
              if (option.split(' ')[0] == anonymus) {
                callback(option.slice(option.split(' ')[0].length +1, option.length))
              } else {
                callback(option)
              }
            } else {
              callback(`${option} ${global.TORD.Config.Twitter.AppendMSG}${user}`)
            }
          } else {
            callback('')
          }
        }

        buildMSG(option, user, function(resMSG){

          if (resMSG.length >= 140){ // message trop long
            botTalk( channelID, "`Message trop long`")

          } else if (event.d.attachments.length > 0) { // cas avec une image

            T.upload(bot.fixMessage(resMSG), event.d.attachments, function(data){
              if (data.id_str) {
                callback(`  - ${command.toUpperCase()} ${resMSG}`)
                botTalk(channelID, `** @ ${global.TORD.APIs.Twitter.screen_name} ** @here https://twitter.com/${data.user.screen_name}/status/${data.id_str}`, 'announcement')
              } else {
                callback(`  - ${command.toUpperCase()} ERROR : ${data.errors[0].message}`)
                botTalk(channelID, `ERROR : ${data.errors[0].message}`, 'announcement')
              }
            })

          } else if (option == '') { // cas sans message
            botTalk( channelID, "`!TWEET votre message`")

          } else {

            T.post(bot.fixMessage(resMSG), function(data){
              if (data.id_str) {
                callback(`  - ${command.toUpperCase()} ${resMSG}`)
                var msg = `** @ ${global.TORD.APIs.Twitter.screen_name} ** @here
        *${resMSG}*
          <https://twitter.com/${data.user.screen_name}/status/${data.id_str}> `
                botTalk(channelID, msg, 'announcement')
                uptimeBOT.lastTweet = data.id_str
              } else {
                callback(`  - ${command.toUpperCase()} ERROR : ${data.errors[0].message}`)
                botTalk(channelID, `ERROR : ${data.errors[0].message}`)
              }
            })

          }

        })
      }

        // RT (channel permit)
      if (command.toUpperCase() === "RT" && global.TORD.Config.Discord.Channels.Listen.includes(channelID) ) {

        if (option == '') {
          botTalk( channelID, "`!RT url_du_tweet`")

        } else if ( option.toUpperCase().startsWith('HTTP') ) {
          var idTweet = option.split('/')[option.split('/').length-1]
          if ( !isNaN(idTweet) ) {
            T.rt(idTweet, function(data) {
              if (data.id_str) {
                callback(`  - ${command.toUpperCase()} https://twitter.com/${data.retweeted_status.user.screen_name}/status/${data.retweeted_status.id_str}`)
                botTalk(channelID, `**RT @ ${data.retweeted_status.user.screen_name}** @here https://twitter.com/${data.retweeted_status.user.screen_name}/status/${data.retweeted_status.id_str}`, 'announcement')
              } else {
                callback(`  - ${command.toUpperCase()} ERROR : ${data.errors[0].message}`)
                botTalk(channelID, `ERROR : ${data.errors[0].message}`)
              }
            })
          }
        }
      }

        // DESTROY (channel permit)
      if (command.toUpperCase() === "DESTROY" && global.TORD.Config.Discord.Channels.Listen.includes(channelID) ) {

        if (option == '') {
          botTalk( channelID, "`!RT url_du_tweet`")

        } else if (option.slice(0,4).toUpperCase() == 'HTTP' || option.toUpperCase() == 'LAST') {

          (option.toUpperCase() == 'LAST' ? idTweet = uptimeBOT.lastTweet : idTweet = option.split('/')[option.split('/').length-1])

          if ( !isNaN(idTweet) ) {
            T.destroy(idTweet, function(data) {
              if (data.id_str) {
                callback(`  - ${command.toUpperCase()}`)
                var msg = `**TWEET** \`effacé\``
                botTalk(channelID, msg)
              } else {
                callback(`  - ${command.toUpperCase()} ERROR : ${data.errors[0].message}`)
                botTalk(channelID, `ERROR : ${data.errors[0].message}`)
              }
            })
          }
        }
      }

        // STREAM (owner only & in channel permit)
      if (command.toUpperCase() === "STREAM" && global.TORD.Config.Discord.Channels.Listen.includes(channelID) && userID == bot.servers[ bot.channels[channelID].guild_id ].owner_id) {

        var options = option.toUpperCase().split(' ')

        if (options[0] === "LIST" && options.length == 1) { // ici on check directement dans les streams et non dans le global.TORD
          T.stream('status', function(data){
            var msg = `__**STREAM LIST**__ \n`
            for (var i = 0; i < Object.keys(data).length; i++){
              msg += `    ${Object.keys(data)[i]} : \`${global.TORD.Config.Twitter.Streams[Object.keys(data)[i]]}\`\n`
            }
            callback(`  - ${command.toUpperCase()} ${options[0]}`)
            botTalk(channelID, msg)
          })
        }

        if (options[0] === "USER" && options.length == 3) {

          if (bot.fixMessage(options[2]).slice(0,1) == '@') {
            var cUser = bot.fixMessage(option.split(' ')[2]).slice(1,bot.fixMessage(option.split(' ')[2]).length)
          } else {
            var cUser = option.split(' ')[2]
          }

          if (options[1] === "ADD") {

            if (global.TORD.Config.Twitter.Users.indexOf(cUser) >= 0) {
              botTalk(channelID, `__**STREAM USER**__\n        **@ ${cUser}** est déjà dans la liste des utilisateurs.`)
            } else if (cUser == global.TORD.APIs.Twitter.screen_name) {
              botTalk(channelID, `__**STREAM USER**__\n       Impossible de mettre le Owner en écoute sur lui même. Cela pourrait créer un cataclisme sans fin, une boucle infini sans fin qui pourrait continuer jusqu'à l'infini voir au dela ... (t'es compris ou bien ? xD)`)
            } else {
              callback(`  - ${command.toUpperCase()} ${options[0]} ${options[1]} ${cUser}`, {service : 'Twitter', act : 'addUser', user: cUser})
              botTalk(channelID, `__**STREAM USER**__\n       **@ ${cUser}** a été ajouté à la liste`)
            }

          } else if (options[1] === "REMOVE") {

            if (global.TORD.Config.Twitter.Users.indexOf(cUser) == -1) {
              botTalk(channelID, `__**STREAM USER**__\n       **@ ${cUser}** n'est pas dans la liste`)
            } else {
              callback(`  - ${command.toUpperCase()} ${options[0]} ${options[1]} ${cUser}`, {service : 'Twitter', act : 'removeUser', user: cUser})
              botTalk(channelID, `__**STREAM USER**__\n       **@ ${cUser}** a été supprimé de la liste`)
            }

          }
        }

        if (options[0] === "ADD") {
          if (options[1] === "USER") { // ne pas confondre avec !stream user add
            botTalk(channelID, `__**WARNING**__\n       ne pas confondre !STREAM USER ADD et !STREAM ADD USER.\n       \!HELP\` pour plus d\'information`)
          } else {
            var name = option.slice(options[0].length +1, option.length).split(' ')[0]
            var track = bot.fixMessage(option.slice(options[0].length +name.length +2, option.length))

            if ( global.TORD.Config.Twitter.Streams[name] ) {
              botTalk(channelID, `__**STREAM ADD**__\n       \`${name}\` existe déjà comme stream`)

            } else {

              T.stream('add', name, track, function(res){

                if (res.tweet.in_reply_to_status_id_str == null && global.TORD.Config.Twitter.Users.indexOf(res.tweet.user.screen_name) >= 0) {
                  T.rt(res.tweet.id_str, function(data) {
                    if (data.id_str) {
                      callback(`  - STREAM RT | https://twitter.com/${data.retweeted_status.user.screen_name}/status/${data.retweeted_status.id_str}`)
                      botTalk('', `**RT @ ${data.retweeted_status.user.screen_name}** @here https://twitter.com/${data.retweeted_status.user.screen_name}/status/${data.retweeted_status.id_str}`, 'announcement')
                    } else {
                      callback(`  - STREAM RT | ERROR : ${data.errors[0].message}`)
                      botTalk('', `ERROR : ${data.errors[0].message}`)
                    }
                  })
                }

              })
              botTalk(channelID, `__**STREAM ADD**__\n       \`${name}\` ajouté comment stream en écoute sur \`${track}\``)
              callback(`  - ${command.toUpperCase()} ${options[0]} ${options[1]} ${cUser}`, {service : 'Twitter', act : 'addStream', name: name, track: track})

            }

          }
        }

        if (options[0] === "REMOVE" && options.length == 2) {

          if (options[1] === "USER") { // ne pas confondre avec !stream user add
            botTalk(channelID, `__**WARNING**__\n       ne pas confondre !STREAM USER REMOVE et !STREAM REMOVE USER.\n       \!HELP\` pour plus d\'information`)

          } else {
            var name = option.slice(options[0].length +1, option.length).split(' ')[0]
            if ( !global.TORD.Config.Twitter.Streams[name] ) {
              botTalk(channelID, `__**STREAM REMOVE**__\n       \`${name}\` n'existe pas comme stream`)

            } else {
              T.stream('remove', name, function(res){
                botTalk(channelID, `__**STREAM REMOVE**__\n       \`${name}\` a été supprimer dans les streams`)
                callback(`  - ${command.toUpperCase()} ${options[0]} ${options[1]}`, {service : 'Twitter', act : 'removeStream', name: name})
              })
            }
          }
        }

      }

    }
  })

  bot.on('disconnect', function(errMsg, code) {     // EN CAS DE DISCONNECT (un peu brutasse, mais fonctionnel)
    console.log(`  - Reconnection du Bot Discord [${uptimeBOT.reconnection}]`)
    uptimeBOT.reconnection++
    setTimeout(function() {
      bot.connect()
    }, 1 * 1000)
  })

}

module.exports = {
  init: init
}

var helpMESG = `
__**COMMANDES**__

    \`!HELP\`  pour avoir ce message (lol ?)

    \`!INFO\`  retourne les infos du serveur (Owner, Compte Tweeter, Uptime, ...)

    \`!PERMIT\`  pour autoriser la configuration/utilisation du bot dans ce salon (only owner)

    \`!REVOKE\`  pour supprimer la configuration/utilisation du bot dans ce salon (only owner)

    \`!ANNOUNCEMENT\`  **CE salon** informera la communauté de toutes les actions Twitter (only owner)
          Il ne peut y avoir qu'un seul salon. Retaper la commande dans un autre salon pour changer son emplacement.

    \`!TWEET\ 'votre message'\`  pour envoyer un tweet (impossible de faire de Tweet avec plusieurs images)
          Il est ajouté à la fin du message un *--User* avec nom de l'utilisateur qui va tweet
        \`!TWEET -a\`  pour supprimer le *--User*
          Il est possible de modifier cette valeur dans le conf.json (AppendMSG).
          Si AppendMSG = "" il n'y aura pas de *--User* a la fin du tweet

    \`!RT url_du_tweet\`  pour RT un tweet

    \`!DESTROY url_du_tweet\`  pour effacer un tweet

    \`!STREAM\`
        \`!STREAM USER ADD user\`  pour ajouter un utilisateur, attention user doit être son @
        \`!STREAM USER REMOVE user\`  pour effacer un utilisateur
        \`!STREAM ADD name track\`  pour ajouter un stream avec des "tracks"
        \`!STREAM REMOVE name\`  pour effacer un stream

    *Toutes les commandes sont "no case sensitive"*

__**CONTACT / AIDE / BUG**__

    Twitter : @JuJoueA / @SoRiz_
    GitHub : SoRizz`
