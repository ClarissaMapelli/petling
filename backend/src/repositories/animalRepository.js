const db = require('../database/database');

function listarTodos() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM animais
            ORDER BY id DESC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows);
        });
    });
}

function buscarPorId(id) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM animais
            WHERE id = ?
        `;

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(row);
        });
    });
}

function criar(animal) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO animais (
                nome,
                especie,
                raca,
                sexo,
                idade,
                porte,
                descricao,
                foto,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            animal.nome,
            animal.especie,
            animal.raca,
            animal.sexo,
            animal.idade,
            animal.porte,
            animal.descricao,
            animal.foto,
            animal.status || 'disponivel'
        ];

        db.run(sql, valores, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                id: this.lastID,
                ...animal,
                status: animal.status || 'disponivel'
            });
        });
    });
}

function atualizar(id, animal) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE animais
            SET
                nome = ?,
                especie = ?,
                raca = ?,
                sexo = ?,
                idade = ?,
                porte = ?,
                descricao = ?,
                foto = ?,
                status = ?
            WHERE id = ?
        `;

        const valores = [
            animal.nome,
            animal.especie,
            animal.raca,
            animal.sexo,
            animal.idade,
            animal.porte,
            animal.descricao,
            animal.foto,
            animal.status,
            id
        ];

        db.run(sql, valores, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.changes);
        });
    });
}

function excluir(id) {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM animais
            WHERE id = ?
        `;

        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.changes);
        });
    });
}

function atualizarStatus(id, status) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE animais
            SET status = ?
            WHERE id = ?
        `;

        db.run(sql, [status, id], function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.changes);
        });
    });
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    excluir,
    atualizarStatus
};