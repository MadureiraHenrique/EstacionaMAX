document.addEventListener("DOMContentLoaded", () => {
    const container =  document.getElementById("bloco-de-navegacao");

    carregarUsuarios();

    async function carregarUsuarios() {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('voce não está logado, redirecionando para o login');
            window.location.href = '../Funcionario/Login.html'
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/EstacionaMAX_war_exploded/app/gerente/usuarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                container.innerHTML = '';

                renderizarSecao("Gerentes", data.gerentes);
                renderizarSecao("Funcionarios", data.funcionarios);
            } else if (response.status == 401 || response.status == 403) {
                const erro = await response.json();
                alert(erro.erro);
                window.location.href = '../HTML/Funcionario/Login.html';
            } else {
                throw new Error("falha ao carregar dados do servidor");
            }
        } catch (error) {
            console.error("erro ao buscar usuarios: ", error);
            container.innerHTML = '<p class="erro">Não foi possível carregar os usuários.</p>';
        }
    }

    function renderizarSecao(titulo, listaUsuarios) {
        if (!listaUsuarios || listaUsuarios.length == 0) {
            return;
        }

        listaUsuarios.forEach(usuario => {
            const cardElemento = criarCardDeUsuario(usuario);
            container.appendChild(cardElemento);
        });
    }

    function criarCardDeUsuario(usuario) {
        
        const cargo = usuario.manager ? 'Funcionário' : 'Gerente';
        const id = usuario.id;
        const nome = usuario.name;

        const article = document.createElement('article');
        article.className = 'bloco-do-funcionario';
        
        const a = document.createElement('a');
        a.href = `PerfilFuncionario.html?id=${id}`;

        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = '../Image/Perfil/Usuario.png';
        img.alt = `Foto do ${cargo}`;

        const figcaption = document.createElement('figcaption');
        figcaption.className = 'informacao-do-funcionario';
        
        figcaption.innerHTML = `
            <p><strong>${nome}</strong></p>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Cargo:</strong> ${cargo}</p>
        `;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        a.appendChild(figure);
        article.appendChild(a);

        return article;
    }
})