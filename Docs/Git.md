# GameLife - Git
## Branches
`feature/**/*` Pour toutes les branches qui ajoutent, modifient ou suppriment un feature (page, composants, etc)  
`bugfix/**/*` Pour les branches qui corrigent un bug ou un problème  
`hotfix/**/*` Et pour celles qui corrigent un problème en urgence

## Commit
Chaque nom de commit (1ère ligne) est concis et composé de l'élément ciblé (le contexte) et de la modification qui y est apporté.  
Les lignes suivantes peuvent être utilisées pour apporter des précisions ou lister les modifications apportées.

`[CONTEXTE] MODIFICATION`  
Par exemple:  
`[HeatMap] First commit` OU `[ScreenTuto] Add component` Indique la création du composant.  
`[Calendar] Fix daySelect lag` Indique que le commit corrige le lag de la sélection des jours dans la page du calendrier.

## Branches protégées
Les branches d'environnement: `dev`, `test` et `prod` sont protégées et ne peuvent être modifiées qu'avec des Pull Requests sur `dev`.  
### Process principal
`Toutes les branches` > `dev` > `test` > `prod`
* Test => Envoi l'application sur le playstore (GameLife test) et sur l'appstore testflight (GameLife)
* Prod => Envoi l'application sur le playstore et sur l'appstore (GameLife)

### Process d'urgence
`hotfix/**/*` > `prod` (& `dev`)
* Prod => Envoi l'application sur le playstore et sur l'appstore (GameLife)
