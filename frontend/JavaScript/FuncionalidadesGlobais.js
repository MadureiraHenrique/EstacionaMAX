const conteinePrincipal = document.getElementById('conteiner-principal');
const btnExp = document.querySelector('#btn-exp');
const menuSide = document.querySelector('.menu-lateral');
const iconeSair = document.getElementById('icone-sair');
const botaoCadastro = document.getElementById('cadastro');
const cadastrar_Cliente = document.getElementById('form-cadastro');
const overlay = document.getElementById('overlay');
const iconeFecharCadastro = document.getElementById('iconeFechar');
const botaoEnviarForm = document.getElementById('btn-enviar');
const nav = document.getElementById('bloco-de-navegacao');
const iconeExcluirFuncionario = document.getElementById('excluirFuncionario');

mudarDisplay('none');

function expadirMain() {
    btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir');
    conteinePrincipal.classList.toggle('ativar');
});
}

function excluirFuncionario() {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'excluirFuncionario') {
      if (!confirm('Deseja excluir esse funcionário?')) return;
      e.target.closest('.bloco-do-funcionario').remove();
    }
  });
}

function confirmacaoSaida() {
    iconeSair.addEventListener('click', function() {
    if (confirm('Deseja realmente sair?')) {
        location.href = '../../HTML/Funcionario/Login.html';
    }
});
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
        const id = null; // colocar o id dele aq

        criarConteinerFuncionario(nomeFuncionario, sobrenome, id);
        
    })
}

function criarConteinerFuncionario(nomeFuncionario, sobrenome, id) {
   const artigo = document.createElement('article');
    artigo.classList.add('bloco-do-funcionario');

       artigo.innerHTML = `
       <i class="bi bi-trash3" id="excluirFuncionario"></i>
      <a href="PerfilFuncionario.html">
        <figure>
          <img src="../Image/Perfil/Usuario.png" alt="Foto do funcionário" />
          <figcaption class="informacao-do-funcionario">
            <p><strong>${nomeFuncionario}<br>${sobrenome}</strong></p>
            <p><strong>ID:</strong> ${id ? id : 'xxxx'}</p>
            <p><strong>Cargo:</strong> [${'cargo'}]</p> 
          </figcaption>
        </figure>
      </a>
    `;
    // no cargo ali, tem q colocar, id tb (back-end)

    nav.appendChild(artigo);
    mudarDisplay('none');
    cadastrar_Cliente.reset();
}

function abrirConteinerCadastrar() {
    botaoCadastro.addEventListener('click', (event) => {
        event.preventDefault();
        mudarDisplay('block');
    });
}

function fecharConteinerCadastrar() {
    iconeFecharCadastro.addEventListener('click', () => {
        mudarDisplay('none');
    });
}

function mudarDisplay(display) {
    overlay.style.display = display;
    cadastrar_Cliente.style.display = display;
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

filtrarFuncionarios();
pegarDadosForm();
abrirConteinerCadastrar();
fecharConteinerCadastrar();
excluirFuncionario();
confirmacaoSaida();
expadirMain();

