document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Carrega dados do Funcionário ---
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

  // --- 2. Preenche a Tela com Dados Reais ---
  const divInfoNomeId = document.getElementById("nome-id");
  const divInfoEndereco = document.getElementById("informacao-perfil-endereco");
  const divInfoExtra = document.getElementById("informacao-extra");

  // Preenche Nome e ID
  divInfoNomeId.innerHTML = `
    <p id="nome-funcionario">
      <strong>Nome: </strong>${funcionario.nome} ${funcionario.sobrenome}
    </p>
    <p id="id-funcionario"><strong>ID: </strong>${funcionario.id}</p>
  `;

  // Preenche Telefone, Email e Local
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

  // Preenche Cargo, Turno, etc.
  divInfoExtra.innerHTML = `
    <p><strong>Cargo:</strong> ${funcionario.cargo || "N/A"}</p>
    <p><strong>Turno:</strong> ${funcionario.turno || "N/A"}</p>
    <p><strong>Data de emissão:</strong> ${funcionario.dataInicio || "N/A"}</p>
    <p><strong>Status:</strong> ${funcionario.status || "N/A"}</p>
  `;

  // --- 3. Lógica do Pop-up de EXCLUIR ---
  const btnAbrirPopupExcluir = document.querySelector("#excluir-funcionario i");
  const popupExcluir = document.getElementById(
    "excluir-funcionario-container"
  );
  const btnFecharPopupExcluir = document.getElementById("popup-fechar");
  const btnCancelarExcluir = document.getElementById("btn-cancelar-excluir");
  const btnConfirmarExcluir = document.getElementById(
    "btn-confirmar-excluir"
  );

  const fecharPopupExcluir = () => {
    if (popupExcluir) popupExcluir.classList.remove("mostrar");
  };

  if (btnAbrirPopupExcluir) {
    btnAbrirPopupExcluir.addEventListener("click", () =>
      popupExcluir.classList.add("mostrar")
    );
  }
  if (btnFecharPopupExcluir) {
    btnFecharPopupExcluir.addEventListener("click", fecharPopupExcluir);
  }
  if (btnCancelarExcluir) {
    btnCancelarExcluir.addEventListener("click", fecharPopupExcluir);
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
      fecharPopupExcluir();
      window.location.href = "FuncionariosCadastrados.html";
    });
  }

  // --- 4. Lógica da Barra de Busca (Simulada) ---
  const inputBusca = document.getElementById("input-buscar");
  if (inputBusca) {
    inputBusca.addEventListener("keyup", (event) => {
      if (event.key === "Enter") alert("Busca nesta tela não implementada.");
    });
  }

  // ===================================================================
  // ===== 5. NOVA LÓGICA DO POP-UP DE INFORMAÇÕES =====
  // ===================================================================

  // --- Seleciona os elementos do novo pop-up ---
  const popupInfo = document.getElementById("info-popup");
  const btnFecharPopupInfo = document.getElementById("info-popup-fechar");
  const popupInfoTitulo = document.getElementById("info-popup-titulo");
  const popupInfoConteudo = document.getElementById("info-popup-conteudo");

  // --- Seleciona os botões de gatilho ---
  const btnRelatorio = document.getElementById("btn-relatorio");
  const btnHistorico = document.getElementById("btn-historico");
  const btnObservacoes = document.getElementById("btn-observacoes");

  // --- Função para FECHAR o pop-up de info ---
  const fecharPopupInfo = () => {
    if (popupInfo) popupInfo.classList.remove("mostrar");
  };

  // --- Função para ABRIR e PREENCHER o pop-up de info ---
  const abrirPopupInfo = (titulo, conteudoHTML) => {
    popupInfoTitulo.textContent = titulo; // Define o título
    popupInfoConteudo.innerHTML = conteudoHTML; // Define o conteúdo
    popupInfo.classList.add("mostrar"); // Mostra o pop-up
  };

  // --- Adiciona os "escutadores" de clique ---

  // Botão Relatório
  btnRelatorio.addEventListener("click", () => {
    const titulo = "Relatório de Entradas/Saídas";
    // (Simulação de dados de entradas/saídas)
    const conteudo = `
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Veículo (Placa)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>11/11/2025 08:02</td>
            <td>Entrada</td>
            <td>ABC-1234</td>
          </tr>
          <tr>
            <td>10/11/2025 17:30</td>
            <td>Saída</td>
            <td>XYZ-9876</td>
          </tr>
          <tr>
            <td>10/11/2025 09:15</td>
            <td>Entrada</td>
            <td>XYZ-9876</td>
          </tr>
        </tbody>
      </table>
    `;
    abrirPopupInfo(titulo, conteudo);
  });

  // Botão Histórico
  btnHistorico.addEventListener("click", () => {
    const titulo = "Histórico de Movimentações";
    const conteudo = `
      <ul>
        <li><b>11/11/2025:</b> Acessou o Setor X.</li>
        <li><b>10/11/2025:</b> Registrou 12 veículos.</li>
        <li><b>10/11/2025:</b> Finalizou 10 veículos.</li>
        <li><b>09/11/2025:</b> Alterou a própria senha.</li>
      </ul>
    `;
    abrirPopupInfo(titulo, conteudo);
  });

  // Botão Observações
  btnObservacoes.addEventListener("click", () => {
    const titulo = "Observações do Funcionário";
    const obsSalva =
      funcionario.observacoes ||
      "Nenhuma observação registrada para este funcionário.";
    
    const conteudo = `
      <p>Adicione ou edite observações sobre o desempenho de ${funcionario.nome}:</p>
      <textarea id="textarea-obs">${obsSalva}</textarea>
      <button id="btn-salvar-obs">Salvar Observações</button>
    `;
    abrirPopupInfo(titulo, conteudo);

    // Adiciona um listener para o botão "Salvar" DENTRO do pop-up
    document.getElementById("btn-salvar-obs").addEventListener("click", () => {
      const textoObs = document.getElementById("textarea-obs").value;
      
      // Salva a observação no objeto do funcionário (na memória)
      funcionario.observacoes = textoObs;
      
      // Atualiza a lista de funcionários no localStorage
      const index = funcionarios.findIndex(f => f.id == idSelecionado);
      if(index !== -1) {
          funcionarios[index].observacoes = textoObs;
          localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
      }

      alert("Observações salvas com sucesso!");
      fecharPopupInfo();
    });
  });

  // Listener para fechar o pop-up no "X"
  if (btnFecharPopupInfo) {
    btnFecharPopupInfo.addEventListener("click", fecharPopupInfo);
  }
});