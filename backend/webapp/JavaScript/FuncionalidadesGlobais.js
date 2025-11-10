const menuItem = document.querySelectorAll('.item-menu');
const conteinePrincipal = document.getElementById('conteiner-principal');
const btnExp = document.querySelector('#btn-exp');
const menuSide = document.querySelector('.menu-lateral');
const iconeSair = document.getElementById('icone-sair');

function selectLink() {
    menuItem.forEach((item) => {
        item.classList.remove('ativo');
    });

    this.classList.add('ativo');
}

menuItem.forEach((item) => {
    item.addEventListener('click', selectLink); 
});

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir');
    conteinePrincipal.classList.toggle('ativar');
});

iconeSair.addEventListener('click', function() {
    if (confirm('Deseja realmente sair?')) {
        location.href = 'HTML/Funcionario/Login.html';
    }
});