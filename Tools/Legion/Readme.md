# Legion

## Na pas oublier !
- Modification du .htaccess pour autoriser les requêtes
- Modification de commands.php (ligne ~150) pour bypass les emails pour les bots

## Fonctionnemen
- C'est SUPER simple !
1. Séléctionner le nombre d'utilisateur et le nombre d'activités qu'il va générer
2. Cliquer sur le bouton "Start test" pour commencer, il vont pinger le serveur, s'inscrire, se connecter, récupérer les données de l'app (skills, citations, etc) puis ajouter toutes les activités
2. [Optionnel] Cliquer à nouveau sur le bouton pour interrompre le processus
3. Une fois terminé, cliquer sur le bouton une dernière fois pour supprimer tous les comptes et les activités créées sur le serveur
4. Re cliquer sur le bouton pour commencer un autre test

## Permiers résultats
- Test 1 (petite fibre)
    - Users: 500
    - Activities per user: 100
    - Total requests: 52000
    - Errors: 0
    - Total time: 38 minutes 22 secondes 800ms
    - Request time (average): 22ms/req
    - Server max CPU: 12.4%


## TODO
- [x] Réécrire le code
- [x] Responsive
- [ ] Afficher les erreurs
- [ ] Suppression des comptes après les tests