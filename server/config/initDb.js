const fs = require('fs');
const path = require('path');
const { db } = require('./database');

const initDatabase = async () => {
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL file into separate statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement in sequence
    for (const statement of statements) {
        if (statement.trim()) {
            await new Promise((resolve, reject) => {
                db.run(statement.trim(), (err) => {
                    if (err) {
                        console.error('Error executing SQL:', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }
    
    console.log('Database initialized successfully');
};

module.exports = initDatabase; 