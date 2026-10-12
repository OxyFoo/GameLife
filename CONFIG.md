# 🔧 Configuration Files

> ⚠️ Ne jamais commiter les fichiers secrets. Utiliser les `.template` comme référence.

> 💡 Les fichiers de config nécessaires au build sont automatiquement créés depuis les `.template` lors du `npm install`.

## 📱 Application Mobile

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `app.json` | `GameLife/` | IDs AdMob |
| `google-services.json` | `GameLife/android/app/` | Google Services Android (Sign-In) |
| `GoogleService-Info.plist` | `GameLife/ios/` | Google Services iOS (Sign-In) |
| `local.properties` | `GameLife/android/` | Mots de passe keystore |
| `gamelife.keystore` | `GameLife/android/app/` | Signature Play Store |

## 🎨 Avatars

`@oxyfoo/avatar-factory` est publié sous le même nom et la même version à deux endroits :

- **npmjs** : version publique, une image de remplacement sans moteur natif ni textures
- **GitHub Packages** : version complète, privée (moteur natif + textures)

`package.json` et `package-lock.json` ne référencent que la publique. Pour utiliser la complète (dev local avec les vrais avatars, builds officiels) :

1. Mettre dans `~/.npmrc` un token GitHub avec le scope `read:packages` : `//npm.pkg.github.com/:_authToken=<TOKEN>`
2. Définir `GAMELIFE_AVATARS=full` dans l'environnement (ex. `~/.zshrc`)
3. `npm install` : le `postinstall` (`scripts/setup-avatars.js`) télécharge la complète à la version du lockfile et la met à la place de la publique dans `node_modules`, sans toucher au lockfile

Le script indique à chaque installation la version en place (seule la complète contient `AvatarFactory.podspec`). Avec `GAMELIFE_AVATARS=full`, une installation qui ne peut pas récupérer la complète échoue au lieu de retomber sur la publique : les jobs de build Android/iOS de la CI s'appuient dessus. Sur iOS, relancer `npm run podi` après être passé de l'une à l'autre.

⚠️ Ne pas retirer la ligne `@oxyfoo:registry` du `.npmrc` : sans elle, un `~/.npmrc` qui envoie `@oxyfoo` vers GitHub fait entrer la version complète dans le lockfile, et plus personne ne peut installer sans token. Le script refuse un lockfile dans cet état.

## 🔑 Clés externes

| Fichier | Rôle |
|---------|------|
| `*.json` | Service Account Google (IAP/Integrity) |
| `AuthKey_*.p8` | Push notifications Apple |
| `*.crt` / `*.key` | Certificats SSL |
