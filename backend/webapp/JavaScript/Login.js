document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("formularioLogin");
    const mensagemErro = document.getElementById("mensagem-erro");

    
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


    
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault
        mensagemErro.textContent = "";
        
        const formData = new FormData(loginForm);

        const body = new URLSearchParams(formData);

        try {
            const response = await fetch(loginForm.action, {
                method: loginForm.method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('token', data.token);

                const role = data.usuarioInfo.role;

                if (role == 'MANAGER') {
                    window.location.href = '../Gerente/PaginaInicialPosCadastro.html'
                } else {
                    window.location.href = '/PaginaInicialPosCadastro.html'
                }
            } else {
                const errorData = await response.json();
                mensagemErro.textContent = errorData.erro || "Ocorreu um erro no login.";
            }
        } catch (error) {
            console.error("Erro ao tentar fazer login: ", error);
            mensagemErro.textContent = "Não foi possivel conectar ao servidor";
        }

    })
})