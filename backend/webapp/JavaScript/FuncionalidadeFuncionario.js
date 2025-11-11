const botaoCadastro = document.getElementById('cadastro');
const cadastrar_Cliente = document.getElementById('form-cadastro');
const overlay = document.getElementById('overlay');
const iconeFecharCadastro = document.getElementById('iconeFechar');
const botaoEnviarForm = document.getElementById('btn-enviar');
const nav = document.getElementById('bloco-de-navegacao');

mudarDisplay('none');

function salvarFuncionariosStorage(funcionarios) {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

function carregarFuncionariosStorage() {
    return JSON.parse(localStorage.getItem('funcionarios')) || [];
}

function atualizarFuncionariosCadastrados() {
    const funcionarios = [];
    const blocos = nav.querySelectorAll('.bloco-do-funcionario');

    blocos.forEach(bloco => {
        const strongText = bloco.querySelector('figcaption p strong').textContent.split('\n');
        const nome = strongText[0].trim();
        const sobrenome = strongText[1] ? strongText[1].trim() : '';

        const id = bloco.querySelector('figcaption p:nth-child(2)').textContent.replace('ID: ', '').trim();
        const cargo = bloco.querySelector('figcaption p:nth-child(3)').textContent.replace('Cargo: [', '').replace(']', '').trim();

        funcionarios.push({ nome, sobrenome, id, cargo });
    });

    salvarFuncionariosStorage(funcionarios);
}

function criarConteinerFuncionario(nomeFuncionario, sobrenome, id, atualizarStorage = true) {
    const artigo = document.createElement('article');
    artigo.classList.add('bloco-do-funcionario');

    const cargoFixo = 'cargo'; 

    artigo.innerHTML = `
      <i class="bi bi-trash3 excluirFuncionario"></i>
      <a href="PerfilFuncionario.html">
        <figure>
          <img src="../Image/Perfil/Usuario.png" alt="Foto do funcionário" />
          <figcaption class="informacao-do-funcionario">
            <p><strong>${nomeFuncionario} ${sobrenome}</strong></p>
            <p><strong>ID:</strong> ${id ? id : 'xxxx'}</p>
            <p><strong>Cargo:</strong> [${cargoFixo}]</p> 
          </figcaption>
        </figure>
      </a>
    `;

    nav.appendChild(artigo);
    
    if (atualizarStorage) {
        atualizarFuncionariosCadastrados();
    }
    
    mudarDisplay('none');
    cadastrar_Cliente.reset();
}

function pegarDadosForm() {
    cadastrar_Cliente.addEventListener('submit', (event) => {
        event.preventDefault();
        const dados = new FormData(cadastrar_Cliente);

        const nomeFuncionario = dados.get('nomeFuncionario');
        const sobrenome = dados.get('sobrenomeFuncionario');
        const cpf = dados.get('cpf');
        const telefone = dados.get('telefone');
        const email = dados.get('email');
        const id = null; // ID virá do back-end

        criarConteinerFuncionario(nomeFuncionario, sobrenome, id);
    });
}

function abrirConteinerCadastrar() {
    botaoCadastro.addEventListener('click', (event) => {
        event.preventDefault();
        mudarDisplay('block');
    });
}

function fecharConteinerCadastrar() {
    iconeFecharCadastro.addEventListener('click', () => mudarDisplay('none'));
}

function mudarDisplay(display) {
    overlay.style.display = display;
    cadastrar_Cliente.style.display = display;
}

function excluirFuncionario() {
    document.addEventListener('click', (e) => {
        const alvoExclusao = e.target.closest('.excluirFuncionario, .excluir-funcionario');
        if (!alvoExclusao) return;

        if (!confirm('Deseja excluir esse funcionário?')) return;

        const bloco = alvoExclusao.closest('.bloco-do-funcionario');
        if (bloco) {
            bloco.remove();
            atualizarFuncionariosCadastrados();
        }
    });
}

function filtrarFuncionarios() {
    const inputPesquisar = document.getElementById('input-buscar');

    inputPesquisar.addEventListener('input', () => {
        const termo = inputPesquisar.value.trim().toLowerCase();
        const funcionarios = nav.querySelectorAll('.bloco-do-funcionario');

        funcionarios.forEach(funcionario => {
            const nome = funcionario.querySelector('figcaption p strong').textContent.trim().toLowerCase();
            const id = funcionario.querySelector('figcaption p:nth-child(2)').textContent.trim().toLowerCase();

            const textoCompleto = `${nome} ${id}`;
            funcionario.style.display = textoCompleto.includes(termo) ? '' : 'none';
        });
    });
}

function restaurarFuncionariosStorage() {
    const funcionarios = carregarFuncionariosStorage();
    funcionarios.forEach(func => {
        criarConteinerFuncionario(func.nome, func.sobrenome, func.id, false); 
    });
}

restaurarFuncionariosStorage();
filtrarFuncionarios();
pegarDadosForm();
abrirConteinerCadastrar();
fecharConteinerCadastrar();
excluirFuncionario();