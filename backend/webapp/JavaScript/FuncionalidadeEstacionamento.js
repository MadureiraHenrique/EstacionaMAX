const cadastrar_veiculo = document.getElementById("cadastrar-veiculo");
const overlay = document.getElementById("overlay");
const container_cadastrar = document.getElementById("container-cadastrar");
const inconeFechar = document.getElementById("iconeFechar");
const form_cadastro = document.getElementById("form-cadastro");
const estacionamento = document.querySelectorAll(
  "#escopo-do-estacionamento > div"
);
const selection = document.getElementById("vagaEscolhida");
const conteiner_Clientes = document.getElementById("conteiner-de-clientes");
const totalClientes = document.getElementById("total");
const setorSelect = document.getElementById("setor");

let cont = 0;

function getSetorAtual() {
  return setorSelect.value;
}

function getClienteKey() {
  return "clientes_" + getSetorAtual();
}

function getVagasKey() {
  return "vagas_" + getSetorAtual();
}

function salvarClientesStorage(clientes) {
  localStorage.setItem(getClienteKey(), JSON.stringify(clientes));
}

function carregarClientesStorage() {
  return JSON.parse(localStorage.getItem(getClienteKey())) || [];
}

function salvarVagasStorage(vagas) {
  localStorage.setItem(getVagasKey(), JSON.stringify(vagas));
}

function carregarVagasStorage() {
  return JSON.parse(localStorage.getItem(getVagasKey())) || [];
}

// ===================================================================
// ===== NOVA FUNÇÃO ADICIONADA =====
// ===================================================================
/**
 * Lê a lista de funcionários do localStorage e preenche o dropdown
 * no pop-up de cadastro de veículo.
 */
function carregarFuncionariosNoDropdown() {
  // Pega o <select> de funcionário DENTRO do pop-up
  const selectFuncionario = document.getElementById("funcionario");
  if (!selectFuncionario) return; // Segurança

  const funcionarios =
    JSON.parse(localStorage.getItem("funcionarios")) || [];

  selectFuncionario.innerHTML = ""; // Limpa opções antigas (como "Carregando...")

  // Adiciona a opção padrão
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecione o funcionário";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectFuncionario.appendChild(defaultOption);

  if (funcionarios.length > 0) {
    // Adiciona cada funcionário como uma opção
    funcionarios.forEach((func) => {
      const option = document.createElement("option");
      // O valor salvo será o nome completo
      option.value = `${func.nome} ${func.sobrenome}`;
      option.textContent = `${func.nome} ${func.sobrenome} (ID: ${func.id})`;
      selectFuncionario.appendChild(option);
    });
  } else {
    // Se não houver funcionários, avisa
    defaultOption.textContent = "Nenhum funcionário cadastrado";
    defaultOption.disabled = true;
  }
}
// ===================================================================

function inserirVagasDisponiveisSelection() {
  const selectVagas = selection;
  selectVagas.innerHTML = "";

  estacionamento.forEach((vaga) => {
    if (vaga.classList.contains("vaga-vazia")) {
      const option = document.createElement("option");
      option.value = vaga.textContent.trim();
      option.textContent = vaga.textContent.trim();
      selectVagas.appendChild(option);
    }
  });

  if (selectVagas.options.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Nenhuma vaga disponível";
    option.disabled = true;
    selectVagas.appendChild(option);
  }
}

function ocuparVagaDisponivel(vagaEscolhida) {
  estacionamento.forEach((vaga) => {
    if (vaga.textContent.trim() === vagaEscolhida) {
      vaga.classList.remove("vaga-vazia");
      vaga.classList.add("vaga-ocupada");
    }
  });
  atualizarVagasStorage();
  inserirVagasDisponiveisSelection();
}

function liberarVaga(vagaLiberada) {
  estacionamento.forEach((vaga) => {
    if (vaga.textContent.trim() === vagaLiberada) {
      vaga.classList.remove("vaga-ocupada");
      vaga.classList.add("vaga-vazia");
    }
  });
  atualizarVagasStorage();
  inserirVagasDisponiveisSelection();
}

function atualizarVagasStorage() {
  const vagas = [];
  estacionamento.forEach((vaga) => {
    vagas.push({
      nome: vaga.textContent.trim(),
      status: vaga.classList.contains("vaga-ocupada") ? "ocupada" : "vazia",
    });
  });
  salvarVagasStorage(vagas);
}

function restaurarVagasStorage() {
  const vagasSalvas = carregarVagasStorage();

  estacionamento.forEach((vaga) => {
    vaga.classList.remove("vaga-ocupada");
    vaga.classList.add("vaga-vazia");
  });

  if (vagasSalvas.length === 0) return;

  vagasSalvas.forEach((vagaInfo) => {
    estacionamento.forEach((vaga) => {
      if (vaga.textContent.trim() === vagaInfo.nome) {
        vaga.classList.remove("vaga-vazia", "vaga-ocupada");
        vaga.classList.add(
          vagaInfo.status === "ocupada" ? "vaga-ocupada" : "vaga-vazia"
        );
      }
    });
  });
}

function criarCliente(nome, placa, modelo, vaga, cpf) {
  const container_Cliente = document.createElement("article");
  container_Cliente.classList.add("cliente");

  container_Cliente.dataset.nome = nome.toLowerCase();
  container_Cliente.dataset.placa = placa.toLowerCase();
  container_Cliente.dataset.cpf = cpf;

  const iconeFinalizar = document.createElement("i");
  iconeFinalizar.classList.add("bi", "bi-check-circle");
  iconeFinalizar.id = "iconeFinalizar";

  const modeloVeiculo = document.createElement("p");
  modeloVeiculo.classList.add("modelo-do-veiculo-placa");
  modeloVeiculo.innerHTML = `
      <strong>Modelo:</strong> <span class="entrada modelo">${modelo}</span> |
      <strong>Placa:</strong> <span class="entrada placa">${placa}</span>
    `;

  const nomeCliente = document.createElement("p");
  nomeCliente.classList.add("nome");
  nomeCliente.innerHTML = `
      <strong>Nome:</strong> <span class="entrada nomeCliente">${nome}</span>
    `;

  const divConteiner_Alinhamento = document.createElement("div");
  divConteiner_Alinhamento.classList.add("alinhamento-info-valor");

  const informacaoVeiculo = document.createElement("p");
  informacaoVeiculo.classList.add("informacao-do-veiculo");
  const horaEntrada = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  informacaoVeiculo.innerHTML = `
      <strong>Vaga:</strong> <span class="entrada">${vaga}</span> |
      <strong>Entrada:</strong> <span class="entrada">${horaEntrada}</span>
    `;

  const valorGerado = document.createElement("div");
  valorGerado.classList.add("valor-por-hora");
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
  const listaClientes = conteiner_Clientes.querySelectorAll(".cliente");

  listaClientes.forEach((cliente) => {
    clientes.push({
      nome: cliente.querySelector(".nomeCliente").textContent.trim(),
      placa: cliente.querySelector(".placa").textContent.trim(),
      modelo: cliente.querySelector(".modelo").textContent.trim(),
      vaga: cliente
        .querySelector(".informacao-do-veiculo .entrada")
        .textContent.trim(),
      cpf: cliente.dataset.cpf,
    });
  });

  salvarClientesStorage(clientes);
}

function restaurarClientesStorage() {
  const clientesSalvos = carregarClientesStorage();
  cont = 0;
  clientesSalvos.forEach((cli) =>
    criarCliente(cli.nome, cli.placa, cli.modelo, cli.vaga, cli.cpf)
  );
  cont = clientesSalvos.length;
  totalClientes.innerText = cont;
}

function limparCadastro() {
  form_cadastro.reset();
  const inputs = form_cadastro.querySelectorAll(".input-cadastro");
  inputs.forEach((input) => input.classList.remove("input-erro"));
}

function pegarDadosForm() {
  form_cadastro.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputNome = document.getElementById("nomeCliente");
    const inputCpf = document.getElementById("cpf");
    const inputTelefone = document.getElementById("telefone");
    const inputPlaca = document.getElementById("placa");
    const inputModelo = document.getElementById("modelo");
    const inputFuncionario = document.getElementById("funcionario"); // <-- Pega o select
    const inputVaga = document.getElementById("vagaEscolhida");

    const nome = inputNome.value.trim();
    const cpf = inputCpf.value.trim();
    const telefone = inputTelefone.value.trim();
    const placa = inputPlaca.value.trim();
    const modelo = inputModelo.value.trim();
    const funcionario = inputFuncionario.value; // <-- Pega o valor selecionado
    const vaga = inputVaga.value;

    const regexSoNumeros = /^\d+$/;
    const regexCPF = /^\d{11}$/;
    const regexNome = /^[a-zA-Z\s]+$/;

    const inputs = form_cadastro.querySelectorAll(".input-cadastro");
    inputs.forEach((input) => input.classList.remove("input-erro"));

    if (!regexNome.test(nome) || nome.length < 3) {
      alert("Erro: O nome do cliente é inválido.");
      inputNome.classList.add("input-erro");
      inputNome.focus();
      return;
    }

    if (!regexCPF.test(cpf)) {
      alert("Erro: O CPF deve conter exatamente 11 dígitos numéricos.");
      inputCpf.classList.add("input-erro");
      inputCpf.focus();
      return;
    }

    if (!regexSoNumeros.test(telefone) || telefone.length < 8) {
      alert("Erro: O telefone deve conter apenas números (mínimo 8 dígitos).");
      inputTelefone.classList.add("input-erro");
      inputTelefone.focus();
      return;
    }
    
    // (Opcional) Validação do funcionário
    if (funcionario === "") {
        alert("Erro: Você deve selecionar um funcionário.");
        inputFuncionario.classList.add("input-erro");
        return;
    }

    //... (outras validações)

    criarCliente(nome, placa, modelo, vaga, cpf);
    cont++;
    totalClientes.innerText = cont;
    ocuparVagaDisponivel(vaga);
    limparCadastro();
    atualizarClientesStorage();

    let entradas = parseInt(localStorage.getItem("entradas_recentes") || "0");
    localStorage.setItem("entradas_recentes", entradas + 1);

    mudarDisplay("none");
  });
}

function finalizarCliente() {
  conteiner_Clientes.addEventListener("click", (e) => {
    if (e.target.id === "iconeFinalizar") {
      const confirmar = confirm("Deseja finalizar o cliente?");
      if (!confirmar) return;

      const cliente = e.target.closest(".cliente");
      if (!cliente) return;

      const vagaTexto = cliente
        .querySelector(".informacao-do-veiculo .entrada")
        .textContent.trim();
      cliente.remove();
      cont--;
      totalClientes.innerText = cont;

      let saidas = parseInt(localStorage.getItem("saidas_recentes") || "0");
      localStorage.setItem("saidas_recentes", saidas + 1);

      liberarVaga(vagaTexto);
      atualizarClientesStorage();
    }
  });
}

function filtrarClientes() {
  const inputBuscar = document.getElementById("input-buscar");

  inputBuscar.addEventListener("input", () => {
    const termo = inputBuscar.value.trim().toLowerCase();
    const clientes = conteiner_Clientes.querySelectorAll(".cliente");

    clientes.forEach((cliente) => {
      const nome = cliente.dataset.nome;
      const placa = cliente.dataset.placa;
      const cpf = cliente.dataset.cpf;

      const achouNome = nome.includes(termo);
      const achouPlaca = placa.includes(termo);
      const achouCpf = cpf.includes(termo);

      if (achouNome || achouPlaca || achouCpf) {
        cliente.style.display = "";
      } else {
        cliente.style.display = "none";
      }
    });
  });
}

function mudarDisplay(display) {
  overlay.style.display = display;
  container_cadastrar.style.display = display;
}

// ===================================================================
// ===== FUNÇÃO MODIFICADA =====
// ===================================================================
function abrirConteiner() {
  cadastrar_veiculo.addEventListener("click", () => {
    limparCadastro();
    inserirVagasDisponiveisSelection(); // Carrega as vagas
    carregarFuncionariosNoDropdown(); // <-- CHAMA A NOVA FUNÇÃO AQUI
    mudarDisplay("block");
  });
}
// ===================================================================

function fecharConteiner() {
  inconeFechar.addEventListener("click", () => mudarDisplay("none"));
}

function recarregarPaginaParaSetor() {
  conteiner_Clientes.innerHTML = "";
  restaurarVagasStorage();
  restaurarClientesStorage();
  inserirVagasDisponiveisSelection();
  document.getElementById("input-buscar").value = "";
  filtrarClientes();
}

// --- INICIALIZAÇÃO DO SCRIPT ---
setorSelect.addEventListener("change", recarregarPaginaParaSetor);

finalizarCliente();
pegarDadosForm();
mudarDisplay("none");
abrirConteiner();
fecharConteiner();
filtrarClientes();

recarregarPaginaParaSetor();