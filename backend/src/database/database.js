const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const databasePath = path.join(__dirname, 'petling.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
        return;
    }

    console.log('Banco de dados conectado com sucesso!');

    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Erro ao criar as tabelas:', err.message);
            return;
        }

        console.log('Tabelas criadas com sucesso!');
    });
});

module.exports = db;