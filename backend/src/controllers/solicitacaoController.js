const solicitacaoService = require('../services/solicitacaoService');

async function criar(req, res) {
    try {
        const solicitacao = await solicitacaoService.criar(req.body);

        res.status(201).json(solicitacao);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            erro: error.message
        });
    }
}

async function listar(req, res) {
    try {
        const solicitacoes = await solicitacaoService.listarTodos();

        res.status(200).json(solicitacoes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar solicitações.'
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: 'ID da solicitação inválido.'
            });
        }

        const solicitacao =
            await solicitacaoService.buscarPorId(id);

        res.status(200).json(solicitacao);
    } catch (error) {
        console.error(error);

        if (error.message === 'Solicitação não encontrada.') {
            return res.status(404).json({
                erro: error.message
            });
        }

        res.status(500).json({
            erro: 'Erro ao buscar solicitação.'
        });
    }
}

async function atualizarStatus(req, res) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: 'ID da solicitação inválido.'
            });
        }

        const solicitacao =
            await solicitacaoService.atualizarStatus(id, status);

        res.status(200).json(solicitacao);
    } catch (error) {
        console.error(error);

        if (error.message === 'Solicitação não encontrada.') {
            return res.status(404).json({
                erro: error.message
            });
        }

        res.status(400).json({
            erro: error.message
        });
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizarStatus
};