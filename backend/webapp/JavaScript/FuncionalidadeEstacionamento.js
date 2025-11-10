document.addEventListener("DOMContentLoaded", () => {

    const botaoCadastrar = document.getElementById("cadastrar-veiculo");
    const overlay = document.getElementById("overlay");
    const iconeFechar = document.getElementById("iconeFechar");
    const formCadastro = document.getElementById("form-cadastro-cliente");
    const containerDeClientes = document.getElementById("conteiner-de-clientes");
    const mensagemErro = document.getElementById("erro-cadastro");

    botaoCadastrar.addEventListener("click", () => {
        overlay.style.display = "flex";
    });

    iconeFechar.addEventListener("click", () => {
        overlay.style.display = "none";
    });
    
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '../Funcionario/Login.html';
            return;
        }
        
        const formData = new FormData(formCadastro);
        const body = new URLSearchParams(formData);
        
        try {
            const response = await fetch(formCadastro.getAttribute("action"), {
                method: formCadastro.method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            });

            if (response.ok) {
                const novoCliente = await response.json();
                
                alert('Cliente cadastrado com sucesso!');
                
                adicionarCardClienteNaTela(novoCliente);
                
                overlay.style.display = "none";
                formCadastro.reset();

            } else {
                const erro = await response.json();
                mensagemErro.textContent = erro.erro;
            }

        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
            mensagemErro.textContent = "Erro de rede. Tente novamente.";
        }
    });
    
    function adicionarCardClienteNaTela(cliente) {
        
        const card = document.createElement('article');
        card.className = 'cliente-card';
        card.dataset.clienteId = cliente.id;
        
        const carroPrincipal = (cliente.carros && cliente.carros.length > 0) 
                               ? cliente.carros[0] 
                               : { placa: 'N/A', modelo: 'N/A' };
        
        card.innerHTML = `
            <div class="card-header">
                <span class="nome">${cliente.name}</span>
                <span class="status ocupado">Estacionado</span> 
            </div>
            <div class="card-body">
                <p><strong>CPF:</strong> ${cliente.cpf}</p>
                <p><strong>Placa:</strong> ${carroPrincipal.placa}</p>
                <p><strong>Modelo:</strong> ${carroPrincipal.modelo}</p>
            </div>
        `;
        
        containerDeClientes.prepend(card);

        card.addEventListener('click', () => {
            mostrarPopupInfoCliente(cliente);
        });
    }

    function mostrarPopupInfoCliente(cliente) {
        
        alert(`Você clicou no Cliente:
          ID: ${cliente.id}
          Nome: ${cliente.name}
          CPF: ${cliente.cpf}
          Telefone: ${cliente.telephone}
          Carros: ${cliente.carros.length}
        `);
    }

    async function carregarPatioAtual() {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            const response = await fetch('http://localhost:8080/EstacionaMAX_war_exploded/app/pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const pedidos = await response.json();

                const pedidosAbertos = pedidos.pedidos;

                document.getElementById("total").textContent = pedidosAbertos.length;

                containerDeClientes.innerHTML = '';
                
                pedidosAbertos.forEach(pedido => {
                    adicionarCardClienteNaTela(pedido.cliente); 
                });
            }
        } catch (error) {
            console.error("Erro ao carregar pátio:", error);
        }
    }
    
    carregarPatioAtual();

});