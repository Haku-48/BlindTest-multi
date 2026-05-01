# Blindtest-multi
Projet réalisé entièrement par Guillaume Goetghebeur (Haku-48).
Ce projet est uniquement destiné à un usage entre amis.

## How-to

### Installer les dépendance
Effectuer, dans le repertoire source, la commande :
```
npm install
```

### Lancer le serveur
Se placer dans le répertoire *server/* et lancer le serveur via la commande :
```
npm run start
```
ou 
```
nodemon
```
si *nodemon* est installé.

### Lancer le client
Se placer ensuite dans le répertoire *client/* et effectuer la commande :
```
npm run dev
```

## Architecture générale
Mise en place d'une application temps réel full-stack avec une séparation claire entre le frontend **React** et le backend **Node.js**. 
La communication temps réel passe entièrement par **Socket.io** avec un pattern cohérent *d'acknowledgements* pour toutes les actions requête/réponse.


### Gestion des rooms
* Création et rejointe de room avec **génération d'ID court aléatoire** et vérification d'unicité. (Je me suis grandement inspiré du code présent [ici](https://www.equinode.com/fonctions-javascript/generer-une-chaine-de-caracteres-aleatoire-avec-javascript))
* Gestion complète de la déconnexion - retrait du joueur, notification des autres destruction de la room si l'hôte part avec countdown de redirection côté client.
* Settings configurables par l'hôte - thème, nombre de rounds, durée des extraits, temps de réponse, nombre maximum de joueurs - synchronisés en temps réel via **Socket.io**.

### Phase de préparation
* Chaque joueur soumet autant d'extraits que de rounds via un formulaire complet - lien YouTube, sélection d'intervalle aves slider custom, réponse principale et bonus attendus.
* Prévisualisation de l'extrait avec lecture en boucle, contrôle du volume et slider d'intervalle visuel.
* Timer de préparation côté serveur (**3min** x nbRounds) avec affichage côté client
* La phase se termine automatiquement quand tous les joueurs sont prêts ouà la fin du timer.
* Algorithme de mélange de rounds qui évite que deux extraits du même joueur se suivent

### Phase de jeu
* Ecrans de transition - countdown 1,2,3,Partez! au lancement, écran Round X/Y entre chaque round
* Player YouTube complètement caché - seul le son est utilisé.
* La vidéo charge pendant l'écran Round X/Y pour éviter l'attente au début du round
* Timer visuel avec barre de progression qui change de couleur du vert au rouge
* Toggle Restart Automatique qui persiste entre les rounds
* VolumeBar verticale custom pour contrôler le son de l'extrait
* Soumission automatique des réponse à la fin du timer

### Phase de correction
* Défilement des *guess* un par un sous la responsabilité de l'hôte
* Validation en temps réel - les clics de l'hôte sur Valide/Invalide sont broadcastés à tous instantanément
* Système de report démocratique à majorité absolue - si assez de joueurs signalent un extrait, aucun point n'est attribué pour ce round
* Logique de scoring - les guessers gagnent des points en trouvant, mais le submitter est pénalisé s'il ne reconnait pas son propre extrait
* Liste des joueurs avec indicateur visuel de ce qui a été corrigé

### Page de résultats
* Classement animé qui révèle les joueurs avec un délai
* Gestion des égalités avec rang partagé et départage alphabétique
* Podium avec styles or/argent/bronze adaptatif selon le nombre de joueurs
* Résumé personnalisé par round - pour chaque extrait le joueur voit sa réponse, la réponse attendue et les points gagnés/perdus, avec un système accordéon pour déplier les détails.

### Experience utilisateur
* Phrases aléatoires contextuelles - entre les rounds et à la fin de la partie
* FeedBackPanel dépoloyable depuis le bas de l'écran pour signaler un bug ou proposer une amélioration, envoyé via **Discord Webhook** dans deux salons dédiés
* Modale de règles complète accessible depuis le lobby
* Indicateur visuels partout - icône Lucide pour les états des cases, couleurs dynamiques pour les scores, spinners et chargement.
* Gestion des cas limites - déconnexion en cours de partie, rechargement de page, pseudo invalide, room introuvable. 