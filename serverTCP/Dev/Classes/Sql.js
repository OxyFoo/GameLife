import { createConnection } from 'mysql';

class SQL {
    constructor(host, database, user, password) {
        const settings = { host, database, user, password };
        this.connection = createConnection(settings);
    }

    Unmount = () => {
        if (this.connection.state === 'connected') {
            this.connection.destroy();
        }
    }

    ExecQuery = (query) => {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}

export default SQL;