document.addEventListener("DOMContentLoaded", function () {
    // --- 1. Seleciona os elementos da tela ---
    const divInfoNomeId = document.getElementById("nome-id");
    const divInfoEndereco = document.getElementById("informacao-perfil-endereco");
    const divInfoExtra = document.getElementById("informacao-extra");
  
    // --- 2. Carrega os dados do Funcionário ---
    // (Como não há sistema de login, usamos os dados "mockados"
    //  que estão definidos no FuncionalidadesGlobais.js para consistência)
    const funcionario = {
      nome: "Joselino Morais",
      id: "F001", // (ID de exemplo)
      telefone: "71 98888-7777",
      email: "joselino.morais@estacionamax.com",
      cargo: "Funcionario",
      turno: "Manhã",
      dataInicio: "01/10/2025",
      status: "Ativo",
    };
  
    // --- 3. Preenche a Tela com Dados ---
    if (divInfoNomeId) {
      divInfoNomeId.innerHTML = `
        <p id="nome-funcionario">
          <strong>Nome: </strong>${funcionario.nome}
        </p>
        <p id="id-funcionario"><strong>ID: </strong>${funcionario.id}</p>
      `;
    }
  
    if (divInfoEndereco) {
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
    }
  
    if (divInfoExtra) {
      divInfoExtra.innerHTML = `
        <p><strong>Cargo:</strong> ${funcionario.cargo}</p>
        <p><strong>Turno:</strong> ${funcionario.turno}</p>
        <p><strong>Data de emissão:</strong> ${funcionario.dataInicio}</p>
        <p><strong>Status:</strong> ${funcionario.status}</p>
      `;
    }
  
    // ===================================================================
    // ===== 4. LÓGICA DO POP-UP DE INFORMAÇÕES =====
    // ===================================================================
  
    // --- Seleciona os elementos do pop-up ---
    const popupInfo = document.getElementById("info-popup");
    const btnFecharPopupInfo = document.getElementById("info-popup-fechar");
    const popupInfoTitulo = document.getElementById("info-popup-titulo");
    const popupInfoConteudo = document.getElementById("info-popup-conteudo");
  
    // --- Seleciona os botões de gatilho ---
    const btnRelatorio = document.getElementById("btn-relatorio");
    const btnHistorico = document.getElementById("btn-historico");
  
    // --- Função para FECHAR o pop-up ---
    const fecharPopupInfo = () => {
      if (popupInfo) popupInfo.classList.remove("mostrar");
    };
  
    // --- Função para ABRIR e PREENCHER o pop-up ---
    const abrirPopupInfo = (titulo, conteudoHTML) => {
      if (popupInfo && popupInfoTitulo && popupInfoConteudo) {
        popupInfoTitulo.textContent = titulo; // Define o título
        popupInfoConteudo.innerHTML = conteudoHTML; // Define o conteúdo
        popupInfo.classList.add("mostrar"); // Mostra o pop-up
      } else {
        console.error("Elementos do Pop-up de Informação não foram encontrados.");
      }
    };
  
    // --- Adiciona os "escutadores" de clique ---
  
    if (btnRelatorio) {
      btnRelatorio.addEventListener("click", () => {
        const titulo = "Meu Relatório de Entradas/Saídas";
        // (Simulação de dados)
        const conteudo = `
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Veículo (Placa)</th>
                <th>Setor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>11/11/2025 08:02</td>
                <td>Entrada</td>
                <td>ABC-1234</td>
                <td>Setor X</td>
              </tr>
              <tr>
                <td>10/11/2025 17:30</td>
                <td>Saída</td>
                <td>XYZ-9876</td>
                <td>Setor Y</td>
              </tr>
            </tbody>
          </table>
        `;
        abrirPopupInfo(titulo, conteudo);
      });
    }
  
    if (btnHistorico) {
      btnHistorico.addEventListener("click", () => {
        const titulo = "Meu Histórico de Movimentações";
        const conteudo = `
          <ul>
            <li><b>11/11/2025:</b> Registrou 5 veículos no Setor X.</li>
            <li><b>10/11/2025:</b> Registrou 12 veículos no Setor Y.</li>
            <li><b>10/11/2025:</b> Finalizou 10 veículos.</li>
            <li><b>09/11/2025:</b> Alterou a própria senha.</li>
          </ul>
        `;
        abrirPopupInfo(titulo, conteudo);
      });
    }
  
    // Listener para fechar o pop-up no "X"
    if (btnFecharPopupInfo) {
      btnFecharPopupInfo.addEventListener("click", fecharPopupInfo);
    }
  });
  