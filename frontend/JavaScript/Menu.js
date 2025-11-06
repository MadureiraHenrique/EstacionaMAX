const menuItem = document.querySelectorAll('.item-menu');
const conteinerPrincipal = document.getElementById('conteiner-principal');

function selectLink() {
    menuItem.forEach((item) => {
        item.classList.remove('ativo');
    });

    this.classList.add('ativo');
}

menuItem.forEach((item) => {
    item.addEventListener('click', selectLink); 
});

const btnExp = document.querySelector('#btn-exp');
const menuSide = document.querySelector('.menu-lateral');

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir');
    conteinerPrincipal.classList.toggle('ativar');
});


/* ===============================================
   DOCUMENTAÇÃO RÁPIDA
===============================================

1. menuItem:
   - Seleciona todos os itens do menu lateral (li.item-menu)
   - Retorna uma NodeList

2. selectLink():
   - Função chamada ao clicar em um item do menu
   - Primeiro remove a classe 'ativo' de todos os itens
   - Depois adiciona 'ativo' somente ao item clicado
   - 'this' refere-se ao item do menu que disparou o clique

3. menuItem.forEach(...):
   - Adiciona o evento de clique a cada item
   - Quando clicado, chama selectLink

4. btnExp e menuSide:
   - btnExp: botão que controla a expansão do menu lateral
   - menuSide: o próprio menu lateral

5. btnExp.addEventListener('click', ...):
   - Ao clicar no botão, alterna a classe 'expandir' no menu
   - Se a classe existir, remove; se não existir, adiciona
   - Permite expandir ou contrair o menu lateral dinamicamente
   - Ativa a conteiner-principal.ativar;

*/