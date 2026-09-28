const solicitacaoRepository = require('../repositories/solicitacaoRepository');
const animalRepository = require('../repositories/animalRepository');

const STATUS_VALIDOS = [
    'pendente',
    'em_analise',
    'aprovada',
    'recusada'
];

async function criar(solicitacao) {
    if (
        !solicitacao.animal_id ||
        !solicitacao.nome ||
        !solicitacao.email ||
        !solicitacao.telefone
    ) {
        throw new Error(
            'Animal, nome, email e telefone são obrigatórios.'
        );
    }

    const animal = await animalRepository.buscarPorId(
        solicitacao.animal_id
    );

    if (!animal) {
        throw new Error('Animal não encontrado.');
    }

    if (animal.status !== 'disponivel') {
        throw new Error(
            'Este animal não está disponível para adoção.'
        );
    }

    return await solicitacaoRepository.criar(solicitacao);
}

async function listarTodos() {
    return await solicitacaoRepository.listarTodos();
}

async function buscarPorId(id) {
    const solicitacao =
        await solicitacaoRepository.buscarPorId(id);

    if (!solicitacao) {
        throw new Error('Solicitação não encontrada.');
    }

    return solicitacao;
}

async function atualizarStatus(id, status) {
    await buscarPorId(id);

    if (!STATUS_VALIDOS.includes(status)) {
        throw new Error('Status da solicitação inválido.');
    }

    await solicitacaoRepository.atualizarStatus(id, status);

    return await buscarPorId(id);
}

module.exports = {
    criar,
    listarTodos,
    buscarPorId,
    atualizarStatus
};