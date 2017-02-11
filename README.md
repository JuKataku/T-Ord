# T-Ord

Petit bot basé sur Discord.io pour permettre d'envoyer des TWEET (avec image si besoin) / RETWEET depuis une salon Discord spécifique.

### Prérequis

> - Nodejs (dev en v6.9.1)
> - App Twitter --> https://apps.twitter.com/
> - App Discord --> https://discordapp.com/developers/applications/me

### Installation

> - Remplacer le fichier conf_DIST.json en conf.json
> - Remplisser la partie "APIs" du json

>  - Nodejs (dev en v6.9.1)
>  - App Twitter --> https://apps.twitter.com/
>  - App Discord --> https://discordapp.com/developers/applications/me

### Installation

>  - Remplacer le fichier conf_DIST.json en conf.json
>  - Remplisser la partie "APIs" du json

```sh
$ cd T-Ord
$ npm install
$ npm run start
```

> - Inviter le bot Discord dans le Serveur/Guilde :  (Uniquement le proprio du bot/app peut le faire)
>      https://discordapp.com/oauth2/authorize?&client_id=YYYY&scope=bot (remplacer YYYY pour le Client_ID du bot)
> - Manager un groupe d'utilisateur pour un seul salon (exemple 'groupe twitter, #twitter')
> - Le propritaire du discord doit !PERMIT DISCORD le salon créer au dessus.

**Ce que T-Ord ne sais pas faire :**
> - Créer le SecretToken et SecretToken pour Twitter, vous devez vous faire votre propre serveur oAuth.
> - Faire le café ... bien dommage, j'en aurai besoin. :'(

### Patch Note

> **0.0.3:**
> - Première version publique

> **0.0.4:**
> - Suppression de la commande !GLOBAL (juste une oublie avant la publication)
> - Ajout de la commande !UPTIME et !UPTIME FULL pour savoir combien de reconnexion il y a eu

### Roadmap

> - Ajout de loop "search" avec certain paramettre pour automatiquement RT suivant ces conditions.
> - Lister et Manager ces recherches
> - Passer T-Ord en multi-sessions pour manager plusieurs discord/tweeter en même temps.
=======
### Prochaine version

Ajout de loop "search" avec certain paramettre pour automatiquement RT suivant ces conditions.

### Déso / pas Déso

Je suis une bille en anglais, alors si une personne a envie de ce faire le traduction ... Enjoy bro ! ;)

### Contact / Aide / Et pourquoi 42?

@JuJoueA / @SoRiz_
