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

    // --- LÓGICA DO POP-UP DE EXCLUSÃO ---

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

    // --- LÓGICA DE BUSCA (MANTIDA) ---
    const inputBusca = document.getElementById("input-buscar");
    if (inputBusca) {
        inputBusca.addEventListener("keyup", (event) => {
            if (event.key === "Enter") alert("Busca nesta tela não implementada.");
        });
    }

    // --- 1. LÓGICA DO BOTÃO DE EDIÇÃO ---

    const btnEditar = document.getElementById("link-editar-perfil");

    if (btnEditar) {
        btnEditar.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "EditarPerfil.html";
        });
    }

    // --- 2. FUNCIONALIDADE DOS BOTÕES EXTRAS (POP-UPS) ---

    const btnRelatorio = document.querySelector("#informacao-funcionalidades button:nth-child(1)");
    const btnHistorico = document.querySelector("#informacao-funcionalidades button:nth-child(2)");
    const btnObservacoes = document.querySelector("#informacao-funcionalidades button:nth-child(3)");

    const popupRelatorio = document.getElementById("relatorio-popup-container");
    const popupHistorico = document.getElementById("historico-popup-container");
    const popupObservacoes = document.getElementById("observacoes-popup-container");

    const abrirPopup = (popup) => {
        if (popup) popup.classList.add("mostrar");
    };

    const fecharPopupExt = (popup) => {
        if (popup) popup.classList.remove("mostrar");
    };

    // --- Relatório de entradas/saídas ---
    const btnFecharRelatorio = document.getElementById("relatorio-fechar");
    const btnGerarCompleto = document.getElementById("btn-gerar-completo"); // Botão dentro do pop-up

    if (btnRelatorio) {
        btnRelatorio.addEventListener("click", () => abrirPopup(popupRelatorio));
    }
    if (btnFecharRelatorio) {
        btnFecharRelatorio.addEventListener("click", () => fecharPopupExt(popupRelatorio));
    }
    if (btnGerarCompleto) {
        btnGerarCompleto.addEventListener("click", () => {
            alert("Simulando download/redirecionamento para o Relatório Completo.");
            fecharPopupExt(popupRelatorio);
        });
    }

    // --- Histórico de movimentações ---
    const btnFecharHistorico = document.getElementById("historico-fechar");
    const btnVerHistoricoCompleto = document.getElementById("btn-ver-historico-completo"); // Botão dentro do pop-up

    if (btnHistorico) {
        btnHistorico.addEventListener("click", () => abrirPopup(popupHistorico));
    }
    if (btnFecharHistorico) {
        btnFecharHistorico.addEventListener("click", () => fecharPopupExt(popupHistorico));
    }
    if (btnVerHistoricoCompleto) {
        btnVerHistoricoCompleto.addEventListener("click", () => {
            alert("Redirecionando para a página de Histórico Detalhado.");
            fecharPopupExt(popupHistorico);
        });
    }

    // --- Observações ---
    const btnFecharObservacoes = document.getElementById("observacoes-fechar");
    const btnSalvarObservacao = document.getElementById("btn-salvar-observacao");
    const textareaObservacoes = document.getElementById("campo-observacoes-gerente");

    if (btnObservacoes) {
        btnObservacoes.addEventListener("click", () => abrirPopup(popupObservacoes));
    }
    if (btnFecharObservacoes) {
        btnFecharObservacoes.addEventListener("click", () => fecharPopupExt(popupObservacoes));
    }

    if (btnSalvarObservacao) {
        btnSalvarObservacao.addEventListener("click", () => {
            const novaObservacao = textareaObservacoes ? textareaObservacoes.value.trim() : '';

            if (novaObservacao) {
                alert(`Nova observação salva (Simulação): "${novaObservacao}"`);
                if (textareaObservacoes) {
                    textareaObservacoes.value = "";
                }
            } else {
                alert("Por favor, escreva uma observação antes de salvar.");
            }
            fecharPopupExt(popupObservacoes);
        });
    }
});