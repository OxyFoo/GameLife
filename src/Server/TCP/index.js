import 'dotenv/config';
import SQL from './src/Sql.js';
import Server from './src/Server.js';

const database = new SQL({
    database: process.env.DB_DATABASE,
    hostname: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

const serv = new Server(database);
serv.Listen(parseInt(process.env.LISTEN_PORT));
