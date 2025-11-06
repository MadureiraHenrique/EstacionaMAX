const abrirPopUp = document.getElementById("cadastrar-veiculo");
const conteinerPopUp = document.getElementById("popup-veiculo");
const fecharPopUp = document.getElementsByClassName("fechar")[0];

abrirPopUp.onclick = function() {
    conteinerPopUp.style.display = "block";
};

fecharPopUp.onclick = function() {
    conteinerPopUp.style.display = "none";
};

window.onclick = function(evento) {
    if (evento.target == conteinerPopUp) {
      conteinerPopUp.style.display = "none";
    }
};
``