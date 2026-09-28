const jwt = require('jsonwebtoken');

const JWT_SECRET = 'petling_chave_secreta_2026';

function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho) {
        return res.status(401).json({
            erro: 'Token de acesso não informado.'
        });
    }

    const partes = cabecalho.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            erro: 'Formato de token inválido.'
        });
    }

    const token = partes[1];

    try {
        const usuario = jwt.verify(token, JWT_SECRET);

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }
}

module.exports = autenticar;