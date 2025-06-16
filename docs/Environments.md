# GameLife - Environments

## Application
| Variable | Description | Values |
| --- | --- | --- |
| ENV | Application environnement | dev, test, prod |
| VPS_PROTOCOL | Protocol used for server connection (none = launch app without server, ws = WebSocket, wss = WebSocket Secure) | none, ws, wss |
| VPS_HOST | IP of the VPS: TCP Server | IP |
| VPS_PORT | Port of the VPS: TCP Server | Port (8092, 8091, 8090) |
| SSL_PINNING_PRIMARY_KEY | Primary SSL public key for certificate pinning | Base64 encoded public key |
| SSL_PINNING_BACKUP_KEY | Backup SSL public key for certificate pinning | Base64 encoded public key |

## TCP Server
| Variable | Description | Values |
| --- | --- | --- |
| ENV | TCP Server environnement | dev, test, prod |
| LISTEN_PORT | Port of the TCP Server | Port (8092, 8091, 8090) |
| OPENAI_API_KEY | API Key for OpenAI | Key |
| DB_HOSTNAME | Hostname of the Database | Hostname |
| DB_DATABASE | Name of the Database | Name |
| DB_USERNAME | Username of the Database | Username |
| DB_PASSWORD | Password of the Database | Password |
