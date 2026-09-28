const db = require('../database/database');

function listarTodos() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                s.*,
                a.nome AS animal_nome
            FROM solicitacoes_adocao s
            INNER JOIN animais a ON a.id = s.animal_id
            ORDER BY s.id DESC
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
            SELECT
                s.*,
                a.nome AS animal_nome
            FROM solicitacoes_adocao s
            INNER JOIN animais a ON a.id = s.animal_id
            WHERE s.id = ?
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

function criar(solicitacao) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO solicitacoes_adocao (
                animal_id,
                nome,
                email,
                telefone,
                mensagem,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            solicitacao.animal_id,
            solicitacao.nome,
            solicitacao.email,
            solicitacao.telefone,
            solicitacao.mensagem || null,
            'pendente'
        ];

        db.run(sql, valores, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                id: this.lastID,
                ...solicitacao,
                status: 'pendente'
            });
        });
    });
}

function atualizarStatus(id, status) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE solicitacoes_adocao
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
    atualizarStatus
};