const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/database');

const JWT_SECRET = 'petling_chave_secreta_2026';


async function login(email, senha) {

    if (!email || !senha) {
        throw new Error(
            'E-mail e senha são obrigatórios.'
        );
    }


    const administrador = await buscarAdministrador(email);


    if (!administrador) {
        throw new Error(
            'E-mail ou senha inválidos.'
        );
    }


    const senhaValida = await bcrypt.compare(
        senha,
        administrador.senha_hash
    );


    if (!senhaValida) {
        throw new Error(
            'E-mail ou senha inválidos.'
        );
    }


    const token = jwt.sign(
        {
            id: administrador.id,
            email: administrador.email
        },
        JWT_SECRET,
        {
            expiresIn: '2h'
        }
    );


    return {
        token,
        administrador: {
            id: administrador.id,
            nome: administrador.nome,
            email: administrador.email
        }
    };
}


function buscarAdministrador(email) {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM administradores
            WHERE email = ?
        `;


        db.get(
            sql,
            [email],
            (err, row) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(row);
            }
        );

    });
}


module.exports = {
    login
};
