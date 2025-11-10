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
