document.addEventListener("DOMContentLoaded", function () {
  const inputFoto = document.getElementById("input-foto");
  const imgPreview = document.getElementById("usuario-icone-preview");
  const formEdicao = document.getElementById("form-edicao");

  // 1. Lógica do Preview da Foto de Perfil
  if (inputFoto && imgPreview) {
    inputFoto.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // 'e.target.result' é a imagem em base64
          imgPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 2. Lógica de Salvar (Simulado)
  if (formEdicao) {
    formEdicao.addEventListener("submit", function (event) {
      event.preventDefault(); // Impede o recarregamento da página

      // Pega os valores (só para simular)
      const nome = document.getElementById("edit-nome").value;

      alert(`Perfil de "${nome}" atualizado com sucesso! (Simulação)`);
      // Quando for real, aqui você chama a API (fetch) com método PUT/PATCH

      // Volta para a página de perfil
      window.location.href = "Perfil.html";
    });
  }
});
