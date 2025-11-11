document.addEventListener("DOMContentLoaded", function () {
  const idSelecionado = localStorage.getItem("funcionarioSelecionadoId");
  if (!idSelecionado) {
    alert("Nenhum funcionário selecionado.");
    window.location.href = "FuncionariosCadastrados.html";
    return;
  }

  const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
  const funcionario = funcionarios.find((f) => f.id == idSelecionado);

  if (!funcionario) {
    alert("Funcionário não encontrado.");
    window.location.href = "FuncionariosCadastrados.html";
    return;
  }

  const divInfoNomeId = document.getElementById("nome-id");
  const divInfoEndereco = document.getElementById("informacao-perfil-endereco");
  const divInfoExtra = document.getElementById("informacao-extra");

  divInfoNomeId.innerHTML = `
    <p id="nome-funcionario">
      <strong>Nome: </strong>${funcionario.nome} ${funcionario.sobrenome}
    </p>
    <p id="id-funcionario"><strong>ID: </strong>${funcionario.id}</p>
  `;

  divInfoEndereco.innerHTML = `
    <li>
      <img src="../Image/Perfil/Telefone.png" alt="icone-telefone" id="icone-telefone" />
      ${funcionario.telefone}
    </li>
    <li id="email-funcionario">
      <img src="../Image/Perfil/Arroba.png" alt="iconeEmail" />
      ${funcionario.email}
    </li>
    <li id="localizacao-funcionario">
      <img src="../Image/Perfil/Localizacao.png" alt="iconeLocalização" />
      BA - Salvador (Padrão)
    </li>
  `;

  divInfoExtra.innerHTML = `
    <p><strong>Cargo:</strong> ${funcionario.cargo || "N/A"}</p>
    <p><strong>Turno:</strong> ${funcionario.turno || "N/A"}</p>
    <p><strong>Data de emissão:</strong> ${funcionario.dataInicio || "N/A"}</p>
    <p><strong>Status:</strong> ${funcionario.status || "N/A"}</p>
  `;

  const btnAbrirPopup = document.querySelector("#excluir-funcionario i");
  const popup = document.getElementById("excluir-funcionario-container");
  const btnFecharPopup = document.getElementById("popup-fechar");
  const btnCancelarExcluir = document.getElementById("btn-cancelar-excluir");
  const btnConfirmarExcluir = document.getElementById("btn-confirmar-excluir");

  const fecharPopup = () => {
    if (popup) popup.classList.remove("mostrar");
  };

  if (btnAbrirPopup) {
    btnAbrirPopup.addEventListener("click", () =>
      popup.classList.add("mostrar")
    );
  }
  if (btnFecharPopup) {
    btnFecharPopup.addEventListener("click", fecharPopup);
  }
  if (btnCancelarExcluir) {
    btnCancelarExcluir.addEventListener("click", fecharPopup);
  }

  if (btnConfirmarExcluir) {
    btnConfirmarExcluir.addEventListener("click", () => {
      const funcionariosAtualizados = funcionarios.filter(
        (f) => f.id != idSelecionado
      );

      localStorage.setItem(
        "funcionarios",
        JSON.stringify(funcionariosAtualizados)
      );

      localStorage.removeItem("funcionarioSelecionadoId");

      alert("Funcionário excluído com sucesso!");
      fecharPopup();

      window.location.href = "FuncionariosCadastrados.html";
    });
  }

  const inputBusca = document.getElementById("input-buscar");
  if (inputBusca) {
    inputBusca.addEventListener("keyup", (event) => {
      if (event.key === "Enter") alert("Busca nesta tela não implementada.");
    });
  }

  const btnsRelatorio = document.querySelectorAll(
    "#informacao-funcionalidades button"
  );
  btnsRelatorio.forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`Abrindo "${btn.textContent}"... (Simulação)`);
    });
  });
});
