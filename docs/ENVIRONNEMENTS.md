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
