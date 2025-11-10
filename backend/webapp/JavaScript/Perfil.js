// Ta por ordem de chegada, chefe :Y

let nome = "Josevaldo Morais";
let id = 50;

const divInfo3 = document.getElementById("nome-id");

let htmlParaInserir1 = `
          <p id="nome-funcionario">
            <strong>Nome: </strong>${nome}
          </p>
          <p id="id-funcionario"><strong>ID: </strong>${id}</p>
`;

divInfo3.innerHTML = htmlParaInserir1;





let telefone = "71 9 1234-4321";
let email = "josevaldomorais123@gmail.com";
let local = "BA - Salvador";

const divInfo2 = document.getElementById("informacao-perfil-endereco");

let htmlParaInserir2 = `
    <li>
        <img
            src="../Image/Perfil/Telefone.png"
            alt="icone-telefone"
            id="icone-telefone"
        />${telefone}
    </li>

    <li id="email-funcionario">
        <img src="../Image/Perfil/Arroba.png" alt="iconeEmail" />
        ${email}
    </li>

    <li id="localizacao-funcionario">
        <img
            src="../Image/Perfil/Localizacao.png"
            alt="iconeLocalização"
        />${local}
    </li>
`;

divInfo2.innerHTML = htmlParaInserir2;





let cargo = "Funcionário";
let turno = "Manhã";
let dataInicio = "01/10/2025";
let statusAtual = "Ativo";

const divInfo1 = document.getElementById("informacao-extra");

let htmlParaInserir3 = `
  <p><strong>Cargo:</strong> ${cargo}</p>
  <p><strong>Turno:</strong> ${turno}</p>
  <p><strong>Data de emissão:</strong> ${dataInicio}</p>
  <p><strong>Status:</strong> ${statusAtual}</p>
`;

divInfo1.innerHTML = htmlParaInserir3;






document.addEventListener("DOMContentLoaded", function () {
  const btnAbrirPopup = document.querySelector("#excluir-funcionario i");
  const popup = document.getElementById("excluir-funcionario-container");
  const btnFecharPopup = document.getElementById("popup-fechar");
  const btnCancelarExcluir = document.getElementById("btn-cancelar-excluir");
  const btnConfirmarExcluir = document.getElementById(
    "btn-confirmar-excluir"
  );

  const fecharPopup = () => {
    if (popup) {
      popup.classList.remove("mostrar");
    }
  };

  if (btnAbrirPopup) {
    btnAbrirPopup.addEventListener("click", () => {
      popup.classList.add("mostrar");
    });
  }

  if (btnFecharPopup) {
    btnFecharPopup.addEventListener("click", fecharPopup);
  }

  if (btnCancelarExcluir) {
    btnCancelarExcluir.addEventListener("click", fecharPopup);
  }

  if (btnConfirmarExcluir) {
    btnConfirmarExcluir.addEventListener("click", () => {
      alert("Funcionário excluído com sucesso!");
      fecharPopup();
      window.location.href = "PaginaInicialPosCadastro.html";
    });
  }

  const inputBusca = document.getElementById("input-buscar");
  const btnBusca = document.getElementById("icone-lupa");

  const executarBusca = () => {
    const termo = inputBusca.value;
    if (termo) {
      alert(`Simulando busca por: "${termo}"`);
    } else {
      alert("Por favor, digite um nome ou CPF para buscar.");
    }
  };

  if (btnBusca) {
    btnBusca.addEventListener("click", executarBusca);
  }

  if (inputBusca) {
    inputBusca.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        executarBusca();
      }
    });
  }

  const btnsRelatorio = document.querySelectorAll(
    "#informacao-funcionalidades button"
  );
  btnsRelatorio.forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`Abrindo "${btn.textContent}"...`);
    });
  });
});
