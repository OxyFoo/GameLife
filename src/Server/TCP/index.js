import Server from './Classes/Server.js';

const serv = new Server();
serv.Listen(7121);

import SQL from './Classes/Sql.js';

const sql = new SQL('153.92.216.1', 'u444572210_GameLifeDev', 'u444572210_GLAdminDev', 'T5*JSh;d');
sql.ExecQuery('SELECT * FROM `App`').then(console.log).catch(console.error);











/*const webSocketServer = require('websocket').server;
const http = require('http');

function OnConnect(connection) {
    console.log('User connected');
    connection.send('Ping test');

    connection.on('message', (message) => {
        console.log('Data:', message.utf8Data);
    });

    connection.on('close', () => {
        console.log('User disconnected');
    });
}

const server = http.createServer();
server.listen(7121);
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(server.close, 1000);
    }
});

const wsServer = new webSocketServer({ httpServer: server });
wsServer.addListener('connect', OnConnect);
wsServer.addListener('request', (request) => {
    //console.log('Request:', request);
    request.accept('echo-protocol', request.origin);
});*/