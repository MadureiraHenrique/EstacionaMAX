    document.addEventListener("DOMContentLoaded", () => {
        const params = new URLSearchParams(window.location.search);
        const usuarioId = params.get("id");

        if (!usuarioId) {
            document.getElementById("conteiner-principal").innerHTML = 
                "<h1>Erro: Nenhum ID de usuário fornecido.</h1>";
            return;
        }

        carregarPerfil(usuarioId);
    });

    async function carregarPerfil(id) {

            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = '../Funcionario/Login.html';
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/EstacionaMAX_war_exploded/app/gerente/usuarios?id=${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const usuario = await response.json();
                    preencherDados(usuario);
                } else {
                    const erro = await response.json();
                    document.getElementById("conteiner-principal").innerHTML = `<h1>Erro ao carregar: ${erro.erro}</h1>`;
                }
            } catch (error) {
                console.error("erro de rede: " + error);
            }
    }

    function preencherDados(usuario) {
        const cargo = usuario.manager ? "Funcionario" : "Gerente";

        document.getElementById("nome-User").textContent = usuario.name;
        document.getElementById("cargo-User").textContent = cargo

        document.getElementById("nome-funcionario").innerHTML = `<strong>Nome: </strong> ${usuario.name}`;
        document.getElementById("id-funcionario").innerHTML = `<strong>ID: </strong> ${usuario.id}`;

        const ulEndereco = document.getElementById("informacao-perfil-endereco");
        ulEndereco.innerHTML = `
            <li>
                <img src="../Image/Perfil/Telefone.png" alt="icone-telefone" id="icone-telefone" />
                ${usuario.telephone || '(Não informado)'}
            </li>
            <li id="email-funcionario">
                <img src="../Image/Perfil/Arroba.png" alt="iconeEmail" />
                ${usuario.email}
            </li>
            <li id="localizacao-funcionario">
                <img src="../Image/Perfil/Localizacao.png" alt="iconeLocalização" />
                BA - Salvador
            </li>
        `;

        const divInfoExtra = document.getElementById("informacao-extra");
        divInfoExtra.innerHTML = `
            <p><strong>Cargo:</strong> ${cargo}</p>
            <p><strong>Turno:</strong> ${usuario.shift || 'N/A'}</p>
            <p><strong>Data de emissão:</strong> ${new Date(usuario.entryTime).toLocaleDateString('pt-BR') || 'N/A'}</p>
            <p><strong>Status:</strong> Ativo</p>
        `;
    }