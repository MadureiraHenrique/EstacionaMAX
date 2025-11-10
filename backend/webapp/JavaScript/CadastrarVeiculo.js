document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeCliente = document.getElementById("nomeCliente").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const placa = document.getElementById("placa").value;
    const modelo = document.getElementById("modelo").value;
    const funcionario = document.getElementById("funcionario").value;

    const vagaEscolhida = document.getElementById("vagaEscolhida").value;

    const dadosDoCadastro = {
      cliente: nomeCliente,
      cpf: cpf,
      telefone: telefone,
      placa: placa,
      modelo: modelo,
      funcionario: funcionario,
      vaga: vagaEscolhida,
    };

    console.log("Dados do formulário capturados:");
    console.log(dadosDoCadastro);

  });
});
