## Exercice pratique - La carte aux trésors

## Rappel du sujet

On a une carte en entrée sous forme de fichier. Cette carte contient des montagnes, des trésors et des aventuriers avec le chemin qu'il parcourt.

On doit être capable d'analyser le fichier, et de le représenter dans la mémoire, puis d'exécuter le chemin donné, pour enfin écrire le résultat dans un autre fichier.

## Langage utilisé

J'ai décidé d'utiliser TypeScript pour cet exercice, puisqu'il permet de bien structurer les données, ce qui, dans cet exercice, était important.

## Structure des données

Chaque objet est représenté par une interface, et chaque valeur possible est représentée par une enumeration, cela nous permet de vérifier simplement que toutes les données sont correctes, et de les structurer.

## Exécution

Il faut d'abord build le projet avec
````bash
npm run build
````
Puis executer le programme
````bash    
node dist/index.js
````
En précisant le fichier d'entrée avec 
- `--file=<fichier>` : le fichier à analyser (nécessaire)

Et en Option
- `--output=<fichier>` : le fichier de sortie (facultatif, par défaut `<input_file>-result.txt`)
- `--verbose` : pour afficher les étapes de l'exécution


## Tests

Pour tester le programme, il suffit d'exécuter
````bash
jest
````
Avec en option
- `--coverage` : pour afficher les statistiques de coverage





