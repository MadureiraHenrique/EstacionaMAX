const iconeMostrarSenha = document.getElementById('mostrar-senha');
const iconeEsconderSenha = document.getElementById('esconder-senha');

const inputSenha = document.querySelector('[name="senha"]');

iconeEsconderSenha.style.display = 'none';

iconeMostrarSenha.addEventListener('click', () => {

    inputSenha.type = 'text';
    iconeEsconderSenha.style.display = 'inline';
    iconeMostrarSenha.style.display = 'none';
    
});

iconeEsconderSenha.addEventListener('click', () => {
    inputSenha.type = 'password';
        iconeEsconderSenha.style.display = 'none';
        iconeMostrarSenha.style.display = 'inline';
});
