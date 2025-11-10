const conteinePrincipal = document.getElementById('conteiner-principal');
const btnExp = document.querySelector('#btn-exp');
const menuSide = document.querySelector('.menu-lateral');
const iconeSair = document.getElementById('icone-sair');

function expadirMain() {
  btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir');
    conteinePrincipal.classList.toggle('ativar');
  });
}

function confirmacaoSaida() {
  iconeSair.addEventListener('click', function() {
    if (confirm('Deseja realmente sair?')) {
      location.href = 'HTML/Funcionario/Login.html';
    }
  });
}

expadirMain();
confirmacaoSaida();
