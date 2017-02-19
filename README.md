# T-Ord

Petit bot basé sur Discord.io pour permettre d'envoyer des TWEET (avec image si besoin) / RETWEET depuis une salon Discord spécifique.

### Prérequis

  - Nodejs (dev en v6.9.1)
  - App Twitter --> https://apps.twitter.com/
  - App Discord --> https://discordapp.com/developers/applications/me

### Installation

  - Remplacer le fichier conf_DIST.json en conf.json
  - Remplir la partie "APIs" du json

```json
$ cd T-Ord
$ npm install
$ npm run start
```

  - Inviter le bot Discord dans le Serveur/Guilde :  (Uniquement le proprio du bot/app peut le faire)
      https://discordapp.com/oauth2/authorize?&client_id=YYYY&scope=bot (remplacer YYYY pour le Client_ID du bot)
  - Manager un groupe d'utilisateur pour un seul salon (exemple 'groupe twitter, #twitter')
  - Le propritaire du discord doit `!PERMIT` le salon créer au dessus. (cf Utilisation / !Help)

### Utilisation

`!HELP`  pour avoir ce message

`!INFO`  retourne les infos du serveur (Owner, Compte Tweeter, Uptime, ...)

`!PERMIT`  pour autoriser la configuration/utilisation du bot dans ce salon (only owner)

`!REVOKE`  pour supprimer la configuration/utilisation du bot dans ce salon (only owner)

`!ANNOUNCEMENT`  CE salon informera la communauté de toutes les actions Twitter (only owner)
      Il ne peut y avoir qu'un seul salon. Retaper la commande dans un autre salon pour changer son emplacement.

`!TWEET 'votre message'`  pour envoyer un tweet (impossible de faire de Tweet avec plusieurs images)
      Il est ajouté à la fin du message un --User avec nom de l'utilisateur qui va tweet
    `!TWEET -a`  pour supprimer le --User
      Il est possible de modifier cette valeur dans le conf.json (AppendMSG).
      Si AppendMSG = "" il n'y aura pas de --User a la fin du tweet

`!RT url_du_tweet`  pour RT un tweet

`!DESTROY url_du_tweet`  pour effacer un tweet
    `!DESTROY LAST`  pour effacer le dernier tweet (pas de gestion d'historique)

`!STREAM`
    `!STREAM USER ADD user`  pour ajouter un utilisateur, attention user doit être son @
    `!STREAM USER REMOVE user`  pour effacer un utilisateur
    `!STREAM ADD name track`  pour ajouter un stream avec des "tracks"
    `!STREAM REMOVE name`  pour effacer un stream

Toutes les commandes sont "no case sensitive"

**Ce que T-Ord ne sais pas faire :**
  - Créer le SecretToken et AccessToken pour Twitter, vous devez vous faire votre propre serveur oAuth.
  - Faire le café ... bien dommage, j'en aurai besoin. :'(

### Patch Note

> **0.9.0:**
> - Ajout de TOUTE la partie !STREAM ... cf !HELP pour plus d'information
> - Suppression de !UPTIME
> - Ajout de !INFO pour faire un vrai retour d'information (uptime, discord owner, twitter streams, etc ... )
> - Ajout de !ANNOUNCEMENT pour ajouter un salon informer votre communauté discord
> - Ajout de !SAY pour faire parler le bot dans le salon 'ANNOUNCEMENT'
> - Ajout des !STREAM avec la gestion d'utilisateur et de stream dans le but d'RT automatiquement en fonction de vos paramettres
> - Ajout d'option pour !TWEET afin de twitter de manière anonyme --> !TWEET -a
> - Ajour d'une variable AppendMSG pour customiser vos !TWEET

> **0.0.4:**
> - Suppression de la commande !GLOBAL (juste une oublie avant la publication)
> - Ajout de la commande !UPTIME et !UPTIME FULL pour savoir combien de reconnexion il y a eu

> **0.0.3:**
> - Première version publique

### Roadmap

>  - Localiser le soft.

### Déso / pas Déso

Je suis une bille en anglais, alors si une personne a envie de se faire le traduction ... Enjoy bro ! ;)

### Contact / Aide / Et pourquoi 42?

@JuJoueA / @SoRiz_
