document.addEventListener("DOMContentLoaded", () => {
  // --- Seleção de Elementos ---
  const botaoCadastro = document.getElementById("cadastro");
  const overlay = document.getElementById("overlay");
  const containerCadastrar = document.getElementById("container-cadastrar");
  const formCadastro = document.getElementById("form-cadastro");
  const iconeFecharCadastro = document.getElementById("iconeFechar");
  const navFuncionarios = document.getElementById("bloco-de-navegacao");
  const inputPesquisar = document.getElementById("input-buscar");

  // --- Funções de Storage ---
  const STORAGE_KEY = "funcionarios";

  function carregarFuncionariosStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function salvarFuncionariosStorage(funcionarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funcionarios));
  }

  // --- Funções do Pop-up ---
  function mudarDisplay(display) {
    overlay.style.display = display;
    containerCadastrar.style.display = display;
  }

  function abrirConteinerCadastrar(event) {
    event.preventDefault();
    formCadastro.reset();
    mudarDisplay("flex");
  }

  function fecharConteinerCadastrar() {
    mudarDisplay("none");
  }

  // --- Funções de Renderização e CRUD ---
  function renderizarFuncionarios() {
    const funcionarios = carregarFuncionariosStorage();
    navFuncionarios.innerHTML = "";

    if (funcionarios.length === 0) {
      navFuncionarios.innerHTML =
        "<p style='color: white; text-align: center;'>Nenhum funcionário cadastrado.</p>";
      return;
    }

    funcionarios.forEach((func) => {
      const artigo = document.createElement("article");
      artigo.classList.add("bloco-do-funcionario");

      artigo.dataset.nome = `${func.nome} ${func.sobrenome}`.toLowerCase();
      artigo.dataset.id = func.id;

      artigo.innerHTML = `
        <i class="bi bi-trash3 excluirFuncionario" data-id="${func.id}"></i>
        <a href="Perfil.html" class="link-perfil" data-id="${func.id}">
          <figure>
            <img src="../Image/Perfil/Usuario.png" alt="Foto do funcionário" />
            <figcaption class="informacao-do-funcionario">
              <p><strong>${func.nome} ${func.sobrenome}</strong></p>
              <p><strong>ID:</strong> ${func.id}</p>
              <p><strong>Cargo:</strong> [Funcionário]</p>
            </figcaption>
          </figure>
        </a>
      `;
      navFuncionarios.appendChild(artigo);
    });
  }

  function pegarDadosForm(event) {
    event.preventDefault();
    const dados = new FormData(formCadastro);
    const funcionarios = carregarFuncionariosStorage();

    const novoFuncionario = {
      id: Date.now(),
      nome: dados.get("nomeFuncionario"),
      sobrenome: dados.get("sobrenomeFuncionario"),
      cpf: dados.get("cpf"),
      telefone: dados.get("telefone"),
      email: dados.get("email"),
      cargo: "Funcionário",
      turno: "Manhã",
      dataInicio: new Date().toLocaleDateString("pt-BR"),
      status: "Ativo",
    };

    if (
      !novoFuncionario.nome ||
      !novoFuncionario.cpf ||
      !novoFuncionario.email
    ) {
      alert("Nome, CPF e Email são obrigatórios.");
      return;
    }

    funcionarios.push(novoFuncionario);
    salvarFuncionariosStorage(funcionarios);

    fecharConteinerCadastrar();
    renderizarFuncionarios();
  }

  function filtrarFuncionarios() {
    const termo = inputPesquisar.value.trim().toLowerCase();
    const funcionarios = navFuncionarios.querySelectorAll(
      ".bloco-do-funcionario"
    );

    funcionarios.forEach((funcionario) => {
      const nome = funcionario.dataset.nome;
      const id = funcionario.dataset.id;

      if (nome.includes(termo) || id.includes(termo)) {
        funcionario.style.display = "";
      } else {
        funcionario.style.display = "none";
      }
    });
  }

  function gerenciarCliquesNav(e) {
    if (e.target.classList.contains("excluirFuncionario")) {
      const idParaExcluir = e.target.dataset.id;
      if (
        !confirm(`Deseja realmente excluir o funcionário ID: ${idParaExcluir}?`)
      ) {
        return;
      }

      const funcionarios = carregarFuncionariosStorage();
      const funcionariosAtualizados = funcionarios.filter(
        (f) => f.id != idParaExcluir
      );

      salvarFuncionariosStorage(funcionariosAtualizados);
      renderizarFuncionarios();
    }

    const linkPerfil = e.target.closest(".link-perfil");
    if (linkPerfil) {
      const idParaVer = linkPerfil.dataset.id;
      localStorage.setItem("funcionarioSelecionadoId", idParaVer);
    }
  }

  mudarDisplay("none");

  botaoCadastro.addEventListener("click", abrirConteinerCadastrar);
  iconeFecharCadastro.addEventListener("click", fecharConteinerCadastrar);
  formCadastro.addEventListener("submit", pegarDadosForm);

  inputPesquisar.addEventListener("input", filtrarFuncionarios);
  navFuncionarios.addEventListener("click", gerenciarCliquesNav);

  renderizarFuncionarios();
});
