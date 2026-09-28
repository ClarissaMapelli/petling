const animalRepository = require('../repositories/animalRepository');

const STATUS_VALIDOS = [
    'disponivel',
    'em_processo_adocao',
    'adotado'
];

async function listarTodos() {
    return await animalRepository.listarTodos();
}

async function buscarPorId(id) {
    const animal = await animalRepository.buscarPorId(id);

    if (!animal) {
        throw new Error('Animal não encontrado.');
    }

    return animal;
}

async function criar(animal) {
    if (!animal.nome || !animal.especie || !animal.sexo || !animal.porte) {
        throw new Error(
            'Nome, espécie, sexo e porte são obrigatórios.'
        );
    }

    const status = animal.status || 'disponivel';

    if (!STATUS_VALIDOS.includes(status)) {
        throw new Error('Status do animal inválido.');
    }

    return await animalRepository.criar({
        ...animal,
        status
    });
}

async function atualizar(id, animal) {
    await buscarPorId(id);

    if (!animal.nome || !animal.especie || !animal.sexo || !animal.porte) {
        throw new Error(
            'Nome, espécie, sexo e porte são obrigatórios.'
        );
    }

    if (!STATUS_VALIDOS.includes(animal.status)) {
        throw new Error('Status do animal inválido.');
    }

    const alterados = await animalRepository.atualizar(id, animal);

    if (alterados === 0) {
        throw new Error('Nenhum animal foi atualizado.');
    }

    return await buscarPorId(id);
}

async function excluir(id) {
    await buscarPorId(id);

    const excluidos = await animalRepository.excluir(id);

    if (excluidos === 0) {
        throw new Error('Nenhum animal foi excluído.');
    }

    return true;
}

async function atualizarStatus(id, status) {
    await buscarPorId(id);

    if (!STATUS_VALIDOS.includes(status)) {
        throw new Error('Status do animal inválido.');
    }

    const alterados = await animalRepository.atualizarStatus(
        id,
        status
    );

    if (alterados === 0) {
        throw new Error('Nenhum animal foi atualizado.');
    }

    return await buscarPorId(id);
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    excluir,
    atualizarStatus
};