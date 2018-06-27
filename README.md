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

L'essentiel du dévellopement que soumet à évaulation porte sur ce dernier point. Ceci dit j'ai quand même dû réaliser tout ou partie de l'interface d'admin et de l'api pour que le "scanner" soit utilisable.

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
qrjs2.js (pour générer les qrcode)
css


### REsT api
#### techno
MySQL
php (framework Slim3)
jwt (non opérationel: CORS)

### scanner
#### techno
html
css (material design)
js (ec5)
* instascan
* dexie
#### fonctionalités
login utilisateur
scan qrcode via back ou front camera
offline DB: IndexedDB



### ticket shop
à faire pour septembre