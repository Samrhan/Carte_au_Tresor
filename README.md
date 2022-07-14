## Exercice pratique - La carte aux trésors - Carbon IT

## Rappel du sujet

On a une carte en entrée sous forme de fichier. Cette carte contient des montagnes, des trésors et des aventuriers avec le chemin qu'il parcourt.

On doit être capable d'analyser le fichier, et de le représenter dans la mémoire, puis d'exécuter le chemin donné, pour enfin écrire le résultat dans un autre fichier.

## Langage utilisé

J'ai décidé d'utiliser TypeScript pour cet exercice, puisqu'il permet de bien structurer les données, ce qui, dans cet exercice, était important.

## Structure des données

Chaque objet est représenté par une interface, et chaque valeur possible est représentée par une enumeration, cela nous permet de vérifier simplement que toutes les données sont correctes, et de les structurer.

## Exécution

Il faut d'abord installer les dépendances puis build le projet avec
````bash
yarn install
yarn build
````
Puis executer le programme
````bash    
node dist/index.js
````
Avec en option
- `--file=<fichier>` : le fichier à analyser (par défaut `map.txt`)
- `--output=<fichier>` : le fichier de sortie (par défaut `<input_file>-result.txt`)
- `--verbose` : pour afficher les étapes de l'exécution


## Tests

Pour tester le programme, il suffit d'exécuter
````bash
jest
````
Avec en option
- `--coverage` : pour afficher les statistiques de coverage

Ou de les lancer avec Docker
```bash
docker-compose -f docker-compose.test.yml up
```

## Fichier d'entrée

Le fichier de la carte est un fichier texte, avec des lignes de la forme
```txt
# {C comme Carte} - {Nb. de case en largeur} - {Nb. de case en hauteur}
C - 3 - 4
# {M comme Montagne} - {Axe horizontal} - {Axe vertical}
M - 1 - 0
M - 2 - 1
# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors}
T - 0 - 3 - 2
T - 1 - 3 - 3
# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Séquence de mouvement}
A - Lara - 1 - 1 - S - AADADAGGAA
```

# Orientation

- `N` : Nord
- `S` : Sud
- `E` : Est
- `O` : Ouest

# Séquence de mouvement

- `A` : Avancer
- `G` : Tourner à gauche (90° sur la gauche)
- `D` : Tourner à droite (90° sur la droite)



*@ 2022 Copyright: Samuel BADER*


