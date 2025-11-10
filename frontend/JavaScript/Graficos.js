const ctxPizza = document.getElementById('pizza');
const ctxBarra = document.getElementById('barra');
const conteinerPizza = document.getElementById('conteiner-pizza'); 
const conteinerBarra = document.getElementById('conteiner-barra');
const select = document.getElementById('selecionar-Grafico');

function mostrarElemento(elemento) {
    elemento.classList.add('mostrar');
    elemento.classList.remove('esconder');
}

function esconderElemento(elemento) {
    elemento.classList.add('esconder');
    elemento.classList.remove('mostrar');
}

function gerarGraficoPizza() {
    const titulo = 'Gráfico de Categorias';
    const corTitulo = 'rgba(247, 246, 246, 1)';

    const categorias = ['Categoria A', 'Categoria B', 'Categoria C', 'Categoria D']; 
    const valores = [10, 12, 20, 15];
    const descricaoDataset = 'Dados de Exemplo'; 

    const cores = [
        'rgba(243, 48, 90, 1)',
        'rgba(24, 144, 224, 1)',
        'rgb(255, 205, 86)',
        'rgba(11, 201, 201, 1)'
    ];

    new Chart(ctxPizza, {
        type: 'pie',
        data: {
            labels: categorias, 
            datasets: [{
                label: descricaoDataset,
                data: valores,
                backgroundColor: cores,
                borderWidth: 1.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { 
                        padding: 30,
                        color: 'white',
                        font: { size: 16, weight: '600', family: 'Arial' }
                    }
                },
                title: {
                    display: true,
                    text: titulo,
                    align: 'center',
                    color: corTitulo,
                    font: { size: 50, weight: 'bold', family: 'Arial' }
                }
            }
        }
    });
}

function gerarGraficoBarra() {
    const titulo = 'Pedidos da Semana';
    const corTitulo = 'rgba(247, 246, 246, 1)';

    const categorias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const valores = [10, 12, 20, 15, 12, 11, 8]; // aq vai receber os valores
    const descricaoDataset = 'Quantidade de Pedidos';
    const cores = [
  'rgba(243, 48, 90, 1)',
  'rgba(24, 144, 224, 1)',
  'rgb(255, 205, 86, 1)',
  'rgba(11, 201, 201, 1)',
  'rgba(102, 187, 106, 1)',
  'rgba(156, 39, 176, 1)',
  'rgba(255, 152, 0, 1)'
];

    new Chart(ctxBarra, {
        type: 'bar',
        data: {
            labels: categorias,
            datasets: [{
                label: descricaoDataset,
                data: valores,
                backgroundColor: cores,
                borderWidth: 1.5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 40,
                        color: 'rgba(255, 255, 255, 0.86)',
                        font: { size: 14, weight: 'bold', family: 'Arial' }
                    }
                },
                title: {
                    display: true,
                    text: titulo,
                    align: 'center',
                    color: corTitulo,
                    font: { size: 50, weight: 'bold', family: 'Arial' }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white',
                        font: { size: 16, weight: '600', family: 'Arial' }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.64)',
                        borderColor: 'rgba(255, 255, 255, 0.77)'
                    }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.6)' }
                }
            }
        }
    });
}

function atualizarGrafico() {
    if (select.value === 'graficoX') {
        mostrarElemento(conteinerPizza);
        esconderElemento(conteinerBarra);
    } else {
        mostrarElemento(conteinerBarra);
        esconderElemento(conteinerPizza);
    }
}

gerarGraficoPizza();
gerarGraficoBarra();
atualizarGrafico();
select.addEventListener('change', atualizarGrafico);
