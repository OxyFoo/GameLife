import { createConnection } from 'mysql2';

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
        this.CreateConnection(credentials);
    }

    /**
     * @param {credentials} credentials
     */
    CreateConnection = (credentials) => {
        this.connection = createConnection({
            host: credentials.hostname,
            database: credentials.database,
            user: credentials.username,
            password: credentials.password
        });
        this.connection.connect((err) => {
            if (err) {
                console.warn('SQL Connection Error:', err);
                return;
            }

            console.log('SQL Connected');
        });

        // Auto restart
        this.connection.on('error', (err) => {
            console.warn('SQL Connection Error:', err);
            this.connection.destroy();
            this.CreateConnection(credentials);
        });
    }

    Unmount = () => {
        if (this.connection?.threadId) {
            this.connection.destroy();
        }
    }

    ExecQuery = (query) => {
        if (!this.connection?.threadId) {
            console.warn('SQL Connection not opened, return null.');
            return null;
        }

        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                if (err) {
                    console.warn('SQL Query Error, return null:', err);
                    resolve(null);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * @param {string} command
     * @param {Array<any | null>} args
     */
    QueryPrepare = (command, args) => {
        if (!this.connection?.threadId) {
            console.warn('SQL Connection not opened, return null.');
            return null;
        }

        return new Promise((resolve, reject) => {
            this.connection.query(command, args, (err, result) => {
                if (err) {
                    console.warn('SQL Query Error, return null:', err);
                    resolve(null);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export default SQL;
