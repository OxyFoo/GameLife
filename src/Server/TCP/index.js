import 'dotenv/config';
import SQL from './Classes/Sql.js';
import Server from './Classes/Server.js';

const database = new SQL({
    database: process.env.DB_DATABASE,
    hostname: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

const serv = new Server(database);
serv.Listen(7121);
