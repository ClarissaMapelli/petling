const animalService = require('../services/animalService');

async function listar(req, res) {
    try {
        const animais = await animalService.listarTodos();

        res.status(200).json(animais);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar animais.'
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: 'ID do animal inválido.'
            });
        }

        const animal = await animalService.buscarPorId(id);

        res.status(200).json(animal);
    } catch (error) {
        console.error(error);

        if (error.message === 'Animal não encontrado.') {
            return res.status(404).json({
                erro: error.message
            });
        }

        res.status(500).json({
            erro: 'Erro ao buscar animal.'
        });
    }
}

async function criar(req, res) {
    try {
        const animal = await animalService.criar(req.body);

        res.status(201).json(animal);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            erro: error.message
        });
    }
}

async function atualizar(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: 'ID do animal inválido.'
            });
        }

        const animal = await animalService.atualizar(
            id,
            req.body
        );

        res.status(200).json(animal);
    } catch (error) {
        console.error(error);

        if (error.message === 'Animal não encontrado.') {
            return res.status(404).json({
                erro: error.message
            });
        }

        res.status(400).json({
            erro: error.message
        });
    }
}

async function excluir(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: 'ID do animal inválido.'
            });
        }

        await animalService.excluir(id);

        res.status(204).send();
    } catch (error) {
        console.error(error);

        if (error.message === 'Animal não encontrado.') {
            return res.status(404).json({
                erro: error.message
            });
        }

        res.status(500).json({
            erro: 'Erro ao excluir animal.'
        });
    }
}

async function atualizarStatus(req, res) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: 'ID do animal inválido.'
            });
        }

        const animal = await animalService.atualizarStatus(
            id,
            status
        );

        res.status(200).json(animal);
    } catch (error) {
        console.error(error);

        if (error.message === 'Animal não encontrado.') {
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
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir,
    atualizarStatus
};