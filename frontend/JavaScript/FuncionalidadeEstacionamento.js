const cadastrar_veiculo = document.getElementById('cadastrar-veiculo');
const overlay = document.getElementById('overlay');
const container_cadastrar = document.getElementById('container-cadastrar');
const inconeFechar = document.getElementById('iconeFechar');
const form_cadastro = document.getElementById('form-cadastro');
const estacionamento = document.querySelectorAll('#escopo-do-estacionamento > div');
const selection = document.getElementById('vagaEscolhida');
const conteiner_Clientes = document.getElementById('conteiner-de-clientes');
const totalClientes = document.getElementById('total');
let cont = 0;

function salvarClientesStorage(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function carregarClientesStorage() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

function salvarVagasStorage(vagas) {
    localStorage.setItem('vagas', JSON.stringify(vagas));
}

function carregarVagasStorage() {
    return JSON.parse(localStorage.getItem('vagas')) || [];
}

function inserirVagasDisponiveisSelection() {
    const selectVagas = selection;
    selectVagas.innerHTML = '';

    estacionamento.forEach(vaga => {
        if (vaga.classList.contains('vaga-vazia')) {
            const option = document.createElement('option');
            option.value = vaga.textContent.trim();
            option.textContent = vaga.textContent.trim();
            selectVagas.appendChild(option);
        }
    });

    if (selectVagas.options.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Nenhuma vaga disponível';
        option.disabled = true;
        selectVagas.appendChild(option);
    }
}

function ocuparVagaDisponivel(vagaEscolhida) {
    estacionamento.forEach(vaga => {
        if (vaga.textContent.trim() === vagaEscolhida) {
            vaga.classList.remove('vaga-vazia');
            vaga.classList.add('vaga-ocupada');
        }
    });
    atualizarVagasStorage();
    inserirVagasDisponiveisSelection();
}

function liberarVaga(vagaLiberada) {
    estacionamento.forEach(vaga => {
        if (vaga.textContent.trim() === vagaLiberada) {
            vaga.classList.remove('vaga-ocupada');
            vaga.classList.add('vaga-vazia');
        }
    });
    atualizarVagasStorage();
    inserirVagasDisponiveisSelection();
}

function atualizarVagasStorage() {
    const vagas = [];
    estacionamento.forEach(vaga => {
        vagas.push({
            nome: vaga.textContent.trim(),
            status: vaga.classList.contains('vaga-ocupada') ? 'ocupada' : 'vazia'
        });
    });
    salvarVagasStorage(vagas);
}

function restaurarVagasStorage() {
    const vagasSalvas = carregarVagasStorage();
    if (vagasSalvas.length === 0) return;

    vagasSalvas.forEach(vagaInfo => {
        estacionamento.forEach(vaga => {
            if (vaga.textContent.trim() === vagaInfo.nome) {
                vaga.classList.remove('vaga-vazia', 'vaga-ocupada');
                vaga.classList.add(vagaInfo.status === 'ocupada' ? 'vaga-ocupada' : 'vaga-vazia');
            }
        });
    });
}

function criarCliente(nome, placa, modelo, vaga) {
    const container_Cliente = document.createElement('article');
    container_Cliente.classList.add('cliente');

    const iconeFinalizar = document.createElement('i');
    iconeFinalizar.classList.add('bi', 'bi-check-circle');
    iconeFinalizar.id = 'iconeFinalizar';

    const modeloVeiculo = document.createElement('p');
    modeloVeiculo.classList.add('modelo-do-veiculo-placa');
    modeloVeiculo.innerHTML = `
      <strong>Modelo:</strong> <span class="entrada modelo">${modelo}</span> |
      <strong>Placa:</strong> <span class="entrada placa">${placa}</span>
    `;

    const nomeCliente = document.createElement('p');
    nomeCliente.classList.add('nome');
    nomeCliente.innerHTML = `
      <strong>Nome:</strong> <span class="entrada nomeCliente">${nome}</span>
    `;

    const divConteiner_Alinhamento = document.createElement('div');
    divConteiner_Alinhamento.classList.add('alinhamento-info-valor');

    const informacaoVeiculo = document.createElement('p');
    informacaoVeiculo.classList.add('informacao-do-veiculo');
    const horaEntrada = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    informacaoVeiculo.innerHTML = `
      <strong>Vaga:</strong> <span class="entrada">${vaga}</span> |
      <strong>Entrada:</strong> <span class="entrada">${horaEntrada}</span>
    `;

    const valorGerado = document.createElement('div');
    valorGerado.classList.add('valor-por-hora');
    valorGerado.innerHTML = `<strong>R$:</strong> <span>00,00</span>`;

    divConteiner_Alinhamento.appendChild(informacaoVeiculo);
    divConteiner_Alinhamento.appendChild(valorGerado);

    container_Cliente.appendChild(iconeFinalizar);
    container_Cliente.appendChild(modeloVeiculo);
    container_Cliente.appendChild(nomeCliente);
    container_Cliente.appendChild(divConteiner_Alinhamento);

    conteiner_Clientes.appendChild(container_Cliente);
}

function atualizarClientesStorage() {
    const clientes = [];
    const listaClientes = conteiner_Clientes.querySelectorAll('.cliente');

    listaClientes.forEach(cliente => {
        clientes.push({
            nome: cliente.querySelector('.nomeCliente').textContent.trim(),
            placa: cliente.querySelector('.placa').textContent.trim(),
            modelo: cliente.querySelector('.modelo').textContent.trim(),
            vaga: cliente.querySelector('.informacao-do-veiculo .entrada').textContent.trim()
        });
    });

    salvarClientesStorage(clientes);
}

function restaurarClientesStorage() {
    const clientesSalvos = carregarClientesStorage();
    clientesSalvos.forEach(cli => criarCliente(cli.nome, cli.placa, cli.modelo, cli.vaga));
    cont = clientesSalvos.length;
    totalClientes.innerText = cont;
}

function limparCadastro() {
    form_cadastro.reset();
}

function pegarDadosForm() {
    form_cadastro.addEventListener('submit', (event) => {
        event.preventDefault();
        const dados = new FormData(form_cadastro);

        const nome = dados.get('nomeCliente');
        const placa = dados.get('placa');
        const modelo = dados.get('modelo');
        const vaga = dados.get('vagaEscolhida');

        criarCliente(nome, placa, modelo, vaga);
        cont++;
        totalClientes.innerText = cont;
        ocuparVagaDisponivel(vaga);
        limparCadastro();
        atualizarClientesStorage();
    });
}

function finalizarCliente() {
    conteiner_Clientes.addEventListener('click', (e) => {
        if (e.target.id === 'iconeFinalizar') {
            const confirmar = confirm('Deseja finalizar o cliente?');
            if (!confirmar) return;

            const cliente = e.target.closest('.cliente');
            if (!cliente) return;

            const vagaTexto = cliente.querySelector('.informacao-do-veiculo .entrada').textContent.trim();
            cliente.remove();
            cont--;
            totalClientes.innerText = cont;
            liberarVaga(vagaTexto);
            atualizarClientesStorage();
        }
    });
}

function filtrarClientes() {
    const inputBuscar = document.getElementById('input-buscar');

    inputBuscar.addEventListener('input', () => {
        const termo = inputBuscar.value.trim().toLowerCase();
        const clientes = conteiner_Clientes.querySelectorAll('.cliente');

        clientes.forEach(cliente => {
            const nome = cliente.querySelector('.nomeCliente').textContent.trim().toLowerCase();
            const placa = cliente.querySelector('.placa').textContent.trim().toLowerCase();
            const modelo = cliente.querySelector('.modelo').textContent.trim().toLowerCase();

            const textoCompleto = `${nome} ${placa} ${modelo}`;
            cliente.style.display = textoCompleto.includes(termo) ? '' : 'none';
        });
    });
}

function mudarDisplay(display) {
    overlay.style.display = display;
    container_cadastrar.style.display = display;
}

function abrirConteiner() {
    cadastrar_veiculo.addEventListener('click', () => {
        mudarDisplay('block');
        inserirVagasDisponiveisSelection();
    });
}

function fecharConteiner() {
    inconeFechar.addEventListener('click', () => mudarDisplay('none'));
    form_cadastro.addEventListener('submit', () => mudarDisplay('none'));
}

restaurarVagasStorage();
restaurarClientesStorage();
inserirVagasDisponiveisSelection();
finalizarCliente();
pegarDadosForm();
mudarDisplay('none');
abrirConteiner();
fecharConteiner();
filtrarClientes();
// ainda falta implementar o setor