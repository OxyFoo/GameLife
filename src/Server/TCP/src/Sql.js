import { createPool } from 'mysql2';

/**
 * @typedef {object} credentials
 * @property {string} hostname
 * @property {string} database
 * @property {string} username
 * @property {string} password
 */

class SQL {
    /**
     * @param {credentials} credentials
     */
    constructor(credentials) {
        this.CreatePool(credentials);
    }

    /**
     * @param {credentials} credentials
     */
    CreatePool = (credentials) => {
        this.pool = createPool({
            host: credentials.hostname,
            database: credentials.database,
            user: credentials.username,
            password: credentials.password,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        this.pool.on('connection', (connection) => {
            console.log('SQL Pool Connection established');
        });

        // Gestion des erreurs au niveau du pool
        this.pool.on('error', (err) => {
            console.error('SQL Pool Error:', err);
            this.CreatePool(credentials);
        });
    }

    Unmount = () => {
        this.pool.end((err) => {
            if (err) {
                console.warn('Error closing the pool:', err);
            } else {
                console.log('SQL Pool closed');
            }
        });
    }

    ExecQuery = (query) => {
        return new Promise((resolve, reject) => {
            this.pool.query(query, (err, results) => {
                if (err) {
                    console.warn('SQL Query Error:', err);
                    resolve(null);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     * @param {string} command
     * @param {Array<any | null>} args
     */
    QueryPrepare = (command, args) => {
        return new Promise((resolve, reject) => {
            this.pool.execute(command, args, (err, results) => {
                if (err) {
                    console.warn('SQL Query Error:', err);
                    resolve(null);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

export default SQL;
