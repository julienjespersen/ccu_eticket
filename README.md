# Scanner de etickets

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