const ctxPizza = document.getElementById("pizza");
const ctxBarra = document.getElementById("barra");
const conteinerPizza = document.getElementById("conteiner-pizza");
const conteinerBarra = document.getElementById("conteiner-barra");
const select = document.getElementById("selecionar-Grafico");

let myPizzaChart = null;
let myBarChart = null;

// ===================================================================
// FUNÇÕES DE LEITURA DO LOCALSTORAGE
// ===================================================================

function getDadosDeVagas() {
  let livres = 0;
  let ocupadas = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("vagas_")) {
      const vagasSetor = JSON.parse(localStorage.getItem(key)) || [];
      vagasSetor.forEach((vaga) => {
        if (vaga.status === "ocupada") {
          ocupadas++;
        } else {
          livres++;
        }
      });
    }
  }
  return { livres, ocupadas };
}

function getDadosDeMovimentacao() {
  const entradas = parseInt(localStorage.getItem("entradas_recentes") || "0");
  const saidas = parseInt(localStorage.getItem("saidas_recentes") || "0");
  return { entradas, saidas };
}

// ===================================================================
// FUNÇÕES DE GERAÇÃO DE GRÁFICOS (MODIFICADAS)
// ===================================================================

function gerarGraficoPizza() {
  if (myPizzaChart) {
    myPizzaChart.destroy();
  }

  const dadosVagas = getDadosDeVagas();

  const titulo = "Ocupação Total de Vagas";
  const corTitulo = "rgba(247, 246, 246, 1)";
  const categorias = ["Vagas Livres", "Vagas Ocupadas"];
  const valores = [dadosVagas.livres, dadosVagas.ocupadas];
  const descricaoDataset = "Ocupação de Vagas";

  const cores = [
    "rgba(92, 184, 92, 1)",
    "rgba(217, 83, 79, 1)",
  ];

  myPizzaChart = new Chart(ctxPizza, {
    type: "pie",
    data: {
      labels: categorias,
      datasets: [
        {
          label: descricaoDataset,
          data: valores,
          backgroundColor: cores,
          borderWidth: 1.2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 30,
            color: "white",
            font: { size: 16, weight: "600", family: "Arial" },
          },
        },
        title: {
          display: true,
          text: titulo,
          align: "center",
          color: corTitulo,
          font: { size: 50, weight: "bold", family: "Arial" },
        },
      },
    },
  });
}

function gerarGraficoBarra() {
  if (myBarChart) {
    myBarChart.destroy();
  }

  const dadosMov = getDadosDeMovimentacao();

  const titulo = "Movimentação Total";
  const corTitulo = "rgba(247, 246, 246, 1)";
  const categorias = ["Entradas", "Saídas"];
  const valores = [dadosMov.entradas, dadosMov.saidas];
  const descricaoDataset = "Total de Movimentações";
  const cores = [
    "rgba(24, 144, 224, 1)",
    "rgba(243, 48, 90, 1)",
  ];

  myBarChart = new Chart(ctxBarra, {
    type: "bar",
    data: {
      labels: categorias,
      datasets: [
        {
          label: descricaoDataset,
          data: valores,
          backgroundColor: cores,
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: titulo,
          align: "center",
          color: corTitulo,
          font: { size: 50, weight: "bold", family: "Arial" },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white",
            font: { size: 16, weight: "600", family: "Arial" },
          },
          grid: {
            color: "rgba(255, 255, 255, 0.64)",
            borderColor: "rgba(255, 255, 255, 0.77)",
          },
        },
        y: {
          grid: { color: "rgba(255, 255, 255, 0.6)" },
          ticks: {
            color: "white",
            font: { size: 14, weight: "600" },
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// ===================================================================
// FUNÇÕES DE CONTROLE DE EXIBIÇÃO
// ===================================================================

function mostrarElemento(elemento) {
  elemento.classList.add("mostrar");
  elemento.classList.remove("esconder");
}

function esconderElemento(elemento) {
  elemento.classList.add("esconder");
  elemento.classList.remove("mostrar");
}

function atualizarGrafico() {
  if (select.value === "graficoX") {
    mostrarElemento(conteinerPizza);
    esconderElemento(conteinerBarra);
    gerarGraficoPizza();
  } else {
    mostrarElemento(conteinerBarra);
    esconderElemento(conteinerPizza);
    gerarGraficoBarra();
  }
}

atualizarGrafico();
select.addEventListener("change", atualizarGrafico);
