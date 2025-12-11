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

## 🔑 Clés externes

| Fichier | Rôle |
|---------|------|
| `*.json` | Service Account Google (IAP/Integrity) |
| `AuthKey_*.p8` | Push notifications Apple |
| `*.crt` / `*.key` | Certificats SSL |
