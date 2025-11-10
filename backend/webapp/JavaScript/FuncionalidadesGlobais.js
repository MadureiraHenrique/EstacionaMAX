document.addEventListener("DOMContentLoaded", function () {
  const conteinerPrincipal = document.getElementById("conteiner-principal");
  const iconeSair = document.getElementById("icone-sair");
  const menuContainer = document.querySelector(".menu-lateral");

  if (!menuContainer || !conteinerPrincipal || !iconeSair) {
    console.error("Erro: Elementos globais não encontrados. Verifique os IDs.");
    return;
  }

  let caminhoAtual = window.location.pathname;

  const caminhoFuncionario = "/HTML/Funcionario/";
  const caminhoGerente = "/HTML/Gerente/";

  if (caminhoAtual.includes(caminhoFuncionario)) {
    let htmlMenuFuncionario = `
      <div class="btn-expandir">
          <i class="bi bi-list" id="btn-exp"></i>

          <div id="informacao-do-usuario">
            <img
              src="../Image/Perfil/Usuario.png"
              alt="Foto do usuário"
              id="foto-do-usuario"
            />
            <div id="dados-usuario">
              <p id="nome-User"><strong>Funcionário</strong></p>
              <p id="cargo-User">Colaborador</p>
            </div>
          </div>

          <ul>
            <li class="item-menu">
              <a href="PaginaInicialPosCadastro.html"
                ><span class="icon"><i class="bi bi-columns-gap"></i></span
                ><span class="txt-link">Inicio</span></a
              >
            </li>

            <li class="item-menu">
              <a href="Perfil.html"
                ><span class="icon"><i class="bi bi-person"></i></span
                ><span class="txt-link">Meu Perfil</span></a
              >
            </li>
          </ul>
      </div>
    `;
    menuContainer.innerHTML = htmlMenuFuncionario;
  } else if (caminhoAtual.includes(caminhoGerente)) {
    let htmlMenuGerente = `
      <div class="btn-expandir">
          <i class="bi bi-list" id="btn-exp"></i>
          <div id="informacao-do-usuario">
            <img
              src="../Image/Perfil/Usuario.png"
              alt="Foto do usuário"
              id="foto-do-usuario"
            />

            <div id="dados-usuario">
              <p id="nome-User"><strong>Pedro Lima</strong></p>
              <p id="cargo-User">Gerente</p>
            </div>
          </div>

        <ul>
          <li class="item-menu">
            <a href="../Gerente/PaginaInicialPosCadastro.html"
              ><span class="icon"><i class="bi bi-columns-gap"></i></span
              ><span class="txt-link">Inicio</span></a
            >
          </li>

          <li class="item-menu">
            <a href="../Gerente/Perfil.html"
              ><span class="icon"><i class="bi bi-clipboard"></i></span
              ><span class="txt-link">Gerenciamento</span></a
            >
          </li>

          <li class="item-menu">
            <a href="#"
              ><span class="icon"><i class="bi bi-bar-chart"></i></span
              ><span class="txt-link">Gráfico</span></a
            >
          </li>

          <li class="item-menu">
            <a href="../Gerente/CadastroDeVeiculos.html"
              ><span class="icon"><i class="bi bi-eye"></i></span
              ><span class="txt-link">Vizualizar Setor</span></a
            >
          </li>

          <li class="item-menu">
            <a href="#"
              ><span class="icon"><i class="bi bi-person-plus-fill"></i></span
              ><span class="txt-link">Cadastrar</span></a
            >
          </li>
        </ul>
      </div>
    `;
    menuContainer.innerHTML = htmlMenuGerente;
  }

  const btnExp = document.querySelector("#btn-exp");
  const menuItem = document.querySelectorAll(".item-menu");

  if (btnExp) {
    btnExp.addEventListener("click", function () {
      menuContainer.classList.toggle("expandir");
      conteinePrincipal.classList.toggle("ativar");
    });
  }

  if (iconeSair) {
    iconeSair.addEventListener("click", function () {
      if (confirm("Deseja realmente sair?")) {
        location.href = "../../HomePage.html";
      }
    });
  }

  function selectLink(event) {
    menuItem.forEach((item) => {
      item.classList.remove("ativo");
    });
    event.currentTarget.classList.add("ativo");
  }

  menuItem.forEach((item) => {
    item.addEventListener("click", selectLink);
  });

  function ativarLinkAtual() {
    menuItem.forEach((item) => {
      const link = item.querySelector("a");
      if (link && caminhoAtual.includes(link.getAttribute("href"))) {
        item.classList.add("ativo");
      }
    });
  }

  if (menuItem.length > 0) {
    ativarLinkAtual();
  }
});
