const API = 'http://localhost:3000';

let animais = [];


// ==============================
// ANIMAIS
// ==============================

async function carregarAnimais() {

    try {

        const resposta =
            await fetch(`${API}/animais`);

        animais =
            await resposta.json();

        renderizarAnimais(animais);

    } catch (erro) {

        console.error(erro);

        document.getElementById('listaAnimais').innerHTML =
            '<p>Erro ao carregar animais.</p>';
    }
}


function renderizarAnimais(lista) {

    const container =
        document.getElementById('listaAnimais');

    if (!lista.length) {

        container.innerHTML =
            '<p>Nenhum animal encontrado.</p>';

        return;
    }

    container.innerHTML = lista.map(animal => `

        <div
            class="animal-card"
            onclick="mostrarDetalhes(${animal.id})"
        >

            <div class="animal-imagem">
                🐾
            </div>

            <div class="animal-info">

                <h3>${animal.nome}</h3>

                <p>
                    ${animal.especie}
                    ${animal.raca ? ' • ' + animal.raca : ''}
                </p>

                <p>
                    ${animal.sexo} •
                    ${animal.porte}
                </p>

                <span class="status">
                    ${formatarStatus(animal.status)}
                </span>

            </div>

        </div>

    `).join('');
}


function formatarStatus(status) {

    const nomes = {

        disponivel: 'Disponível',

        em_processo_adocao:
            'Em processo de adoção',

        adotado: 'Adotado'
    };

    return nomes[status] || status;
}


function filtrarAnimais() {

    const busca =
        document.getElementById('busca').value
            .toLowerCase();

    const especie =
        document.getElementById('filtroEspecie').value;

    const porte =
        document.getElementById('filtroPorte').value;

    const filtrados =
        animais.filter(animal => {

            const correspondeBusca =
                animal.nome
                    .toLowerCase()
                    .includes(busca);

            const correspondeEspecie =
                !especie ||
                animal.especie === especie;

            const correspondePorte =
                !porte ||
                animal.porte === porte;

            return (
                correspondeBusca &&
                correspondeEspecie &&
                correspondePorte
            );
        });

    renderizarAnimais(filtrados);
}


function mostrarDetalhes(id) {

    const animal =
        animais.find(a => a.id === id);

    if (!animal) {
        return;
    }

    const detalhes =
        document.getElementById('detalhesAnimal');

    detalhes.classList.remove('hidden');

    detalhes.innerHTML = `

        <div class="detalhes-card">

            <div class="detalhes-imagem">
                🐾
            </div>

            <div class="detalhes-conteudo">

                <h2>${animal.nome}</h2>

                <p>
                    <strong>Espécie:</strong>
                    ${animal.especie}
                </p>

                <p>
                    <strong>Raça:</strong>
                    ${animal.raca || 'Não informada'}
                </p>

                <p>
                    <strong>Sexo:</strong>
                    ${animal.sexo}
                </p>

                <p>
                    <strong>Idade:</strong>
                    ${animal.idade || 'Não informada'}
                </p>

                <p>
                    <strong>Porte:</strong>
                    ${animal.porte}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${formatarStatus(animal.status)}
                </p>

                <p>
                    <strong>Descrição:</strong>
                    ${animal.descricao || 'Sem descrição.'}
                </p>

                ${
                    animal.status === 'disponivel'
                    ? `
                        <button
                            class="btn"
                            onclick="abrirFormularioAdocao(${animal.id})"
                        >
                            Tenho interesse em adotar
                        </button>
                    `
                    : ''
                }

                <div id="formularioAdocao"></div>

            </div>

        </div>
    `;

    detalhes.scrollIntoView({
        behavior: 'smooth'
    });
}


function abrirFormularioAdocao(animalId) {

    const formulario =
        document.getElementById('formularioAdocao');

    formulario.innerHTML = `

        <div class="formulario-adocao">

            <h3>Interesse em adoção</h3>

            <form
                onsubmit="enviarSolicitacao(event, ${animalId})"
            >

                <input
                    id="nomeAdocao"
                    placeholder="Nome"
                    required
                >

                <input
                    id="emailAdocao"
                    type="email"
                    placeholder="E-mail"
                    required
                >

                <input
                    id="telefoneAdocao"
                    placeholder="Telefone"
                    required
                >

                <textarea
                    id="mensagemAdocao"
                    placeholder="Mensagem"
                ></textarea>

                <button
                    class="btn"
                    type="submit"
                >
                    Enviar interesse
                </button>

            </form>

        </div>
    `;
}


async function enviarSolicitacao(event, animalId) {

    event.preventDefault();

    const dados = {

        animal_id: animalId,

        nome:
            document.getElementById('nomeAdocao').value,

        email:
            document.getElementById('emailAdocao').value,

        telefone:
            document.getElementById('telefoneAdocao').value,

        mensagem:
            document.getElementById('mensagemAdocao').value
    };

    try {

        const resposta =
            await fetch(`${API}/solicitacoes`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dados)
            });

        const resultado =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                'Erro ao enviar solicitação.'
            );
        }

        alert(
            'Solicitação enviada com sucesso!'
        );

        document.getElementById(
            'formularioAdocao'
        ).innerHTML = `
            <p>
                Seu interesse foi registrado com sucesso.
            </p>
        `;

    } catch (erro) {

        alert(erro.message);
    }
}


// ==============================
// LOGIN
// ==============================

function mostrarLogin() {

    const loginBox =
        document.getElementById('loginBox');

    loginBox.classList.remove('hidden');

    loginBox.scrollIntoView({
        behavior: 'smooth'
    });
}


async function loginAdmin() {

    const email =
        document
            .getElementById('emailAdmin')
            .value;

    const senha =
        document
            .getElementById('senhaAdmin')
            .value;

    const mensagem =
        document
            .getElementById('loginMensagem');

    try {

        const resposta =
            await fetch(`${API}/login`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email,
                    senha
                })
            });

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro || 'Erro no login.'
            );
        }

        localStorage.setItem(
            'token',
            dados.token
        );

        mensagem.textContent =
            'Login realizado com sucesso!';

        document
            .getElementById('painelAdmin')
            .classList.remove('hidden');

    } catch (erro) {

        mensagem.textContent =
            erro.message;
    }
}


// ==============================
// PAINEL ADMINISTRATIVO
// ==============================

async function carregarPainelAnimais() {

    const conteudo =
        document.getElementById('conteudoAdmin');

    conteudo.innerHTML =
        '<p>Carregando animais...</p>';

    try {

        const resposta =
            await fetch(`${API}/animais`);

        const animaisAdmin =
            await resposta.json();

        conteudo.innerHTML = `

            <h4>Animais cadastrados</h4>

            <button
                class="btn"
                onclick="mostrarFormularioAnimal()"
            >
                + Cadastrar animal
            </button>

            <div class="admin-lista">

                ${animaisAdmin.map(animal => `

                    <div class="admin-item">

                        <div>

                            <strong>
                                ${animal.nome}
                            </strong>

                            <p>
                                ${animal.especie}
                                • ${animal.porte}
                            </p>

                            <span class="status">
                                ${formatarStatus(
                                    animal.status
                                )}
                            </span>

                        </div>

                        <div>

                            <button
                                class="btn"
                                onclick="editarAnimal(${animal.id})"
                            >
                                Editar
                            </button>

                            <button
                                class="btn btn-danger"
                                onclick="excluirAnimal(${animal.id})"
                            >
                                Excluir
                            </button>

                        </div>

                    </div>

                `).join('')}

            </div>
        `;

    } catch (erro) {

        console.error(erro);

        conteudo.innerHTML =
            '<p>Erro ao carregar animais.</p>';
    }
}


function mostrarFormularioAnimal() {

    const conteudo =
        document.getElementById('conteudoAdmin');

    conteudo.innerHTML = `

        <h4>Cadastrar animal</h4>

        <form
            id="formAnimal"
            class="admin-form"
        >

            <input
                id="animalNome"
                placeholder="Nome"
                required
            >

            <input
                id="animalEspecie"
                placeholder="Espécie"
                required
            >

            <input
                id="animalRaca"
                placeholder="Raça"
            >

            <input
                id="animalSexo"
                placeholder="Sexo"
                required
            >

            <input
                id="animalIdade"
                type="number"
                placeholder="Idade"
            >

            <input
                id="animalPorte"
                placeholder="Porte"
                required
            >

            <textarea
                id="animalDescricao"
                placeholder="Descrição"
            ></textarea>

            <input
                id="animalFoto"
                placeholder="Foto"
            >

            <select id="animalStatus">

                <option value="disponivel">
                    Disponível
                </option>

                <option value="em_processo_adocao">
                    Em processo de adoção
                </option>

                <option value="adotado">
                    Adotado
                </option>

            </select>

            <button
                class="btn"
                type="submit"
            >
                Salvar animal
            </button>

        </form>

        <button
            class="btn"
            onclick="carregarPainelAnimais()"
        >
            Voltar
        </button>
    `;

    document
        .getElementById('formAnimal')
        .addEventListener(
            'submit',
            cadastrarAnimal
        );
}


async function cadastrarAnimal(event) {

    event.preventDefault();

    const token =
        localStorage.getItem('token');

    const animal = {

        nome:
            document.getElementById('animalNome').value,

        especie:
            document.getElementById('animalEspecie').value,

        raca:
            document.getElementById('animalRaca').value,

        sexo:
            document.getElementById('animalSexo').value,

        idade:
            Number(
                document
                    .getElementById('animalIdade')
                    .value
            ),

        porte:
            document.getElementById('animalPorte').value,

        descricao:
            document
                .getElementById('animalDescricao')
                .value,

        foto:
            document.getElementById('animalFoto').value,

        status:
            document.getElementById('animalStatus').value
    };

    try {

        const resposta =
            await fetch(`${API}/animais`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':
                        `Bearer ${token}`
                },

                body: JSON.stringify(animal)
            });

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                'Erro ao cadastrar.'
            );
        }

        alert(
            'Animal cadastrado com sucesso!'
        );

        carregarAnimais();
        carregarPainelAnimais();

    } catch (erro) {

        alert(erro.message);
    }
}


async function editarAnimal(id) {

    const respostaAnimal =
        await fetch(`${API}/animais/${id}`);

    const animal =
        await respostaAnimal.json();

    const novoNome =
        prompt(
            'Nome do animal:',
            animal.nome
        );

    if (novoNome === null) {
        return;
    }

    animal.nome = novoNome;

    const token =
        localStorage.getItem('token');

    try {

        const resposta =
            await fetch(
                `${API}/animais/${id}`,
                {

                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(animal)
                }
            );

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                'Erro ao editar.'
            );
        }

        alert(
            'Animal atualizado!'
        );

        carregarAnimais();
        carregarPainelAnimais();

    } catch (erro) {

        alert(erro.message);
    }
}


async function excluirAnimal(id) {

    if (!confirm(
        'Deseja realmente excluir este animal?'
    )) {
        return;
    }

    const token =
        localStorage.getItem('token');

    try {

        const resposta =
            await fetch(
                `${API}/animais/${id}`,
                {

                    method: 'DELETE',

                    headers: {
                        'Authorization':
                            `Bearer ${token}`
                    }
                }
            );

        if (!resposta.ok) {

            const dados =
                await resposta.json();

            throw new Error(
                dados.erro ||
                'Erro ao excluir.'
            );
        }

        alert(
            'Animal excluído!'
        );

        carregarAnimais();
        carregarPainelAnimais();

    } catch (erro) {

        alert(erro.message);
    }
}


// ==============================
// SOLICITAÇÕES
// ==============================

async function carregarSolicitacoes() {

    const conteudo =
        document.getElementById('conteudoAdmin');

    conteudo.innerHTML =
        '<p>Carregando solicitações...</p>';

    const token =
        localStorage.getItem('token');

    try {

        const resposta =
            await fetch(
                `${API}/solicitacoes`,
                {
                    headers: {
                        'Authorization':
                            `Bearer ${token}`
                    }
                }
            );

        const solicitacoes =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                solicitacoes.erro ||
                'Erro ao carregar solicitações.'
            );
        }

        conteudo.innerHTML = `

            <h4>Solicitações de adoção</h4>

            <div class="admin-lista">

                ${
                    solicitacoes.length === 0

                    ? '<p>Nenhuma solicitação cadastrada.</p>'

                    : solicitacoes.map(
                        solicitacao => `

                        <div class="admin-item">

                            <div>

                                <strong>
                                    ${solicitacao.nome}
                                </strong>

                                <p>
                                    Animal:
                                    ${solicitacao.animal_nome}
                                </p>

                                <p>
                                    E-mail:
                                    ${solicitacao.email}
                                </p>

                                <p>
                                    Telefone:
                                    ${solicitacao.telefone}
                                </p>

                                <p>
                                    ${solicitacao.mensagem || ''}
                                </p>

                                <strong>
                                    Status:
                                    ${formatarStatusSolicitacao(
                                        solicitacao.status
                                    )}
                                </strong>

                            </div>

                            <div>

                                <select
                                    onchange="
                                        atualizarStatusSolicitacao(
                                            ${solicitacao.id},
                                            this.value
                                        )
                                    "
                                >

                                    <option
                                        value="pendente"
                                        ${
                                            solicitacao.status ===
                                            'pendente'
                                            ? 'selected'
                                            : ''
                                        }
                                    >
                                        Pendente
                                    </option>

                                    <option
                                        value="em_analise"
                                        ${
                                            solicitacao.status ===
                                            'em_analise'
                                            ? 'selected'
                                            : ''
                                        }
                                    >
                                        Em análise
                                    </option>

                                    <option
                                        value="aprovada"
                                        ${
                                            solicitacao.status ===
                                            'aprovada'
                                            ? 'selected'
                                            : ''
                                        }
                                    >
                                        Aprovada
                                    </option>

                                    <option
                                        value="recusada"
                                        ${
                                            solicitacao.status ===
                                            'recusada'
                                            ? 'selected'
                                            : ''
                                        }
                                    >
                                        Recusada
                                    </option>

                                </select>

                            </div>

                        </div>
                    `
                    ).join('')
                }

            </div>

            <br>

            <button
                class="btn"
                onclick="carregarPainelAnimais()"
            >
                Voltar
            </button>
        `;

    } catch (erro) {

        console.error(erro);

        conteudo.innerHTML =
            '<p>Erro ao carregar solicitações.</p>';
    }
}


function formatarStatusSolicitacao(status) {

    const nomes = {

        pendente: 'Pendente',

        em_analise: 'Em análise',

        aprovada: 'Aprovada',

        recusada: 'Recusada'
    };

    return nomes[status] || status;
}


async function atualizarStatusSolicitacao(
    id,
    status
) {

    const token =
        localStorage.getItem('token');

    try {

        const resposta =
            await fetch(
                `${API}/solicitacoes/${id}/status`,
                {

                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            );

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                'Erro ao atualizar status.'
            );
        }

        alert(
            'Status atualizado!'
        );

        carregarSolicitacoes();

    } catch (erro) {

        alert(erro.message);
    }
}


// ==============================
// FILTROS
// ==============================

document
    .getElementById('busca')
    .addEventListener(
        'input',
        filtrarAnimais
    );

document
    .getElementById('filtroEspecie')
    .addEventListener(
        'change',
        filtrarAnimais
    );

document
    .getElementById('filtroPorte')
    .addEventListener(
        'change',
        filtrarAnimais
    );


// ==============================
// INICIAR
// ==============================

carregarAnimais();
