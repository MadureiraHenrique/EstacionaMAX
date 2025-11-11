document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Seleciona os Elementos ---
  const inputFoto = document.getElementById("input-foto");
  const imgPreview = document.getElementById("usuario-icone-preview");
  const formEdicao = document.getElementById("form-edicao");

  // --- 2. Carrega o Funcionário Selecionado ---
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

  // --- 3. Preenche o Formulário com os Dados Atuais ---
  const editNome = document.getElementById("edit-nome");
  const editTelefone = document.getElementById("edit-telefone");
  const editEndereco = document.getElementById("edit-endereco");
  const editTurno = document.getElementById("edit-turno");
  const editEmail = document.getElementById("edit-email");
  editNome.value = `${funcionario.nome} ${funcionario.sobrenome}`;
  editTelefone.value = funcionario.telefone;
  editEmail.value = funcionario.email;
  editTurno.value = funcionario.turno || "Manhã";

  // --- 4. Lógica de Upload de Foto (Preview) ---
  if (inputFoto && imgPreview) {
    inputFoto.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imgPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- 5. Lógica de Salvar Alterações ---
  if (formEdicao) {
    formEdicao.addEventListener("submit", function (event) {
      event.preventDefault();

      const index = funcionarios.findIndex((f) => f.id == idSelecionado);

      if (index === -1) {
        alert("Erro ao salvar: funcionário não encontrado.");
        return;
      }

      const nomeCompleto = editNome.value.split(" ");
      funcionarios[index].nome = nomeCompleto[0];
      funcionarios[index].sobrenome = nomeCompleto.slice(1).join(" ");
      funcionarios[index].telefone = editTelefone.value;
      funcionarios[index].email = editEmail.value;
      funcionarios[index].turno = editTurno.value;

      localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

      alert(`Perfil de "${funcionarios[index].nome}" atualizado com sucesso!`);

      window.location.href = "Perfil.html";
    });
  }
});
