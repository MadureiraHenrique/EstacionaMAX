const menuSideFuncionario = document.querySelector(".menu-lateral-funcionario");
const menuSideGerente = document.querySelector(".menu-lateral-gerente");

const conteinePrincipal = document.getElementById("conteiner-principal");
const menuItem = document.querySelectorAll(".item-menu");
const iconeSair = document.getElementById("icone-sair");
const btnExp = document.querySelector("#btn-exp");

let caminhoAtual = window.location.pathname;

const caminhoFuncionario = "/frontend/HTML/Funcionario/";
const caminhoGerente = "/frontend/HTML/Gerente/";

if (caminhoAtual.startsWith(caminhoFuncionario)) {
  const paginaCadastro = "CadastroDeVeiculos.html";
  const paginaPosCadastro = "Login.html";
  const paginaPerfil = "PaginaInicialPosCadastro.html";
  menuSideFuncionario.innerHTML = `
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
            <a href="TelaGrafico.html"
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
} else if (caminhoAtual.startsWith(caminhoGerente)) {
  const paginaCadastro = "CadastroDeVeiculos.html";
  const paginaPosCadastro = "PaginaInicialPosCadastro.html";
  const paginaPerfil = "Perfil.html";
  const paginaFuncionarios = "FuncionariosCadastrados.html";
  const paginaGrafico = "TelaGrafico.html";
}

function selectLink() {
  menuItem.forEach((item) => {
    item.classList.remove("ativo");
  });

  this.classList.add("ativo");
}

menuItem.forEach((item) => {
  item.addEventListener("click", selectLink);
});

btnExp.addEventListener("click", function () {
  menuSide.classList.toggle("expandir");
  conteinePrincipal.classList.toggle("ativar");
});

iconeSair.addEventListener("click", function () {
  if (confirm("Deseja realmente sair?")) {
    location.href = "../../HTML/HomePage.html";
  }
});
