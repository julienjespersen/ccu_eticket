# Scanner de etickets

Le Ciné-club universitaire (CCU) est une proposition culturelle organisée par des étudiants et d'anciens étudiants depuis plus de 60 ans. Les Activités culturelles de l'Université de Genève soutiennent le CCU au niveau financier, logistique et qualitativement. Chaque année académique le CCU organise 3 cycles de 12 films projetés au l'Auditorium Arditi (Place du Cirque 1, Genève).
Jusqu'à aujourd'hui un caissier encaisse de l'argent liquide (en francs suisses) et remet en échange 3 types de billet papier: 1 entrée à 8.-, 3 entrées à 18.- ou un abonnement à 50.- pour l'ensemble du cycle.
Un audit interne a pointé différents problèmes concernant les transaction sfinancières autour de l'achat des billets de cinéma. Par exemple:
- transaction uniquement au comptant (argent liquide)
- pas de double regard sur les entrées / sorties d'argent des mains du caissier
- pas de reçu (ticket de caisse)
- pas de contre-marque après être rentré dans la salle
- certaines personnes rentrent et sortent sans être comptées / décomptées

Pour remédier à ces problèmes, plusieurs modifications ont été entreprises:
- acquisition d'un terminal de paiement éléctronique à la caisse
- devellopement d'un webshop online

C'est sur ce dernier point que mon travail se concentre. En effet cela implique que le site web dispose d'un panier d'achat, un module de paiement et de distribution des billets de cinéma.
Une fois que les spectateurs seront munis de leur billets, imprimé sur papier ou affichés sur l'écran de leur smartphones, il s'agit pour l'ouvreuse de pouvoir "oblitérer" le billet.
J'ai donc décidé que tout les billets émis: en ligne ou vendu directement sur place seraient munis d'un code bar afin d'être scanné par l'ouvreuse et donc univoquement identifié et oblitéré.
Vu l'état du métier, vu l'état des outils existant et après discussion avec le manager de CCU, j'ai décidé de procéder par étapes. Au final 4 chantiers seront réalisés:
- une interface d'administation permetant à au manager de créer et gérer les billets
- un webshop permetaant aux spectateurs de pouvoir acheter des billets
- un REST api exposant la liste des billets aux personnes authorisées (l'équipe CCU)
- une application permettant à l'ouvreuse des scanner les billets à l'entrée du cinéma.

L'essentiel du dévellopement que je soumet à évaulation porte sur ce dernier point. Ceci dit j'ai quand même dû réaliser tout ou partie de l'interface d'admin et de l'api pour que le "scanner" soit utilisable.

### admin
Une interface d'administrations des événements, notamment, des séances de cinéma pour le Ciné-club universiatire existe depuis des années.
Je l'ai complétée avec une vue de gestion des etickets, afin de les créer, de les supprimer, de les compter ou de les identifier.

l'admin existe depuis des années, cependant je l'ai coomplétée afin qu'elle permette à l'administrateur de créer des etickets ou des les supprimer (invendus). 

![admin table screen](readme_rsc/admin_table_screen.png "liste des etickets pour un événement")

![admin rec screen](readme_rsc/admin_rec_screen.png "détail d'un ticket")

Une CSS créée pour l'occasion permet à l'administrateur d'imprimer sur une imprimante de bureau des planches de tickets sur des feuilles prédécoupées. Ces tickets seront vendu directement sur place à l'entrée du cinéma.
![admin rec screen](readme_rsc/admin_table_print.png "planche de tickets à imprimer")

#### techno
php
MySQL
js
qrjs2.js (pour générer les qrcode) (https://github.com/englishextra/qrjs2.git)
css


### REsT api
#### techno
MySQL
php (framework Slim3) (https://www.slimframework.com/)
jwt (non opérationel: CORS) (https://jwt.io/)

### scanner
L'application pour scanner les billets, dans les mains de l'ouvreuse, est une simple page HTML, accessible par une URL. Seule les personnes authorisées peuvent recevoir et envoyer des données avec l'api. Une fois identifiée l'ouvreuse reçoit sur son smartphone la liste des spectateurs (et leur code respectif) attendu pour l'évenment choisi. Elle active la caméra du smartphone, une bibliothèque JS cherche dans le flux caméra à décoder un QRCode, s'il est reconnu il est comparé avec les données dans la DB locale, s'il le code est valide et légitime, un retour visuel et haptique indique à l'ouvreuse que le spectateur peut entrer dans la salle. À chaque cycle de l'application les données locales sont envoyées sur le serveur distant et les données de ce dernier sont récupérées.

L'application est démarrée

![scanner camera on](readme_rsc/scan_cam.png "app scanner démarrée")

L'application signale que le billet n'est plus valide - avec une pointe d'humour

![scanner message expired](readme_rsc/scan_msg_expired.png "app scanner indique un problème")

L'ouvreuse peut consulter la liste des spectateurs déjà dans la salle et ceux qui pourraient encore venir

![scanner attendee list](readme_rsc/scan_attendee.png "app scanner liste des spéctateurs")


#### techno
html + css (material design) (https://getmdl.io/components/index.html et https://github.com/google/material-design-lite)
js (ec5)
2 bibliothèques
* instascan (https://github.com/schmich/instascan)
* dexie (https://github.com/dfahlander/Dexie.js)
#### fonctionalités
login utilisateur
scan qrcode via back ou front camera
offline DB: IndexedDB
retour haptique pour l'utilisatrice: vibreur



### ticket shop
à faire pour septembre