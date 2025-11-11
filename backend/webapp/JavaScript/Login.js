const iconeMostrarSenha = document.getElementById('mostrar-senha');
const iconeEsconderSenha = document.getElementById('esconder-senha');
const inputSenha = document.querySelector('[name="senha"]');
const formularioLogin = document.getElementById('formularioLogin');

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

formularioLogin.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.querySelector('[name="email"]').value.trim();
    const senha = document.querySelector('[name="senha"]').value.trim();

    // Contas fixas
    const contas = {
        gerente: { email: 'gerente@empresa.com', senha: '12345' },
        funcionario: { email: 'funcionario@empresa.com', senha: '12345' }
    };

    if (email === contas.gerente.email && senha === contas.gerente.senha) {
        window.location.href = '../../HTML/Gerente/PaginaInicialPosCadastro.html';
    } 
    else if (email === contas.funcionario.email && senha === contas.funcionario.senha) {
        window.location.href = '../../HTML/Funcionario/PaginaInicialPosCadastro.html';
    } 
    else {
        alert('Email ou senha incorretos!');
    }
});
