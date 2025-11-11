document.addEventListener("DOMContentLoaded", function () {
  const vagasLivresEl = document.getElementById("vagas-livres");
  const vagasOcupadasEl = document.getElementById("vagas-ocupadas");
  const barraProgressoEl = document.getElementById("barra-progresso");

  const entradasRecentesEl = document.getElementById("entradas-recentes");
  const saidasRecentesEl = document.getElementById("saidas-recentes");

  let totalVagasLivres = 0;
  let totalVagasOcupadas = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("vagas_")) {
      const vagasSetor = JSON.parse(localStorage.getItem(key)) || [];

      vagasSetor.forEach((vaga) => {
        if (vaga.status === "ocupada") {
          totalVagasOcupadas++;
        } else {
          totalVagasLivres++;
        }
      });
    }
  }

  const entradas = localStorage.getItem("entradas_recentes") || "0";
  const saidas = localStorage.getItem("saidas_recentes") || "0";

  if (vagasLivresEl && vagasOcupadasEl) {
    vagasLivresEl.textContent = totalVagasLivres;
    vagasOcupadasEl.textContent = totalVagasOcupadas;
  }

  if (barraProgressoEl) {
    const totalVagas = totalVagasLivres + totalVagasOcupadas;
    const percentualOcupadas =
      totalVagas > 0 ? (totalVagasOcupadas / totalVagas) * 100 : 0;
    barraProgressoEl.value = percentualOcupadas;
  }

  if (entradasRecentesEl && saidasRecentesEl) {
    entradasRecentesEl.textContent = entradas;
    saidasRecentesEl.textContent = saidas;
  }
});
