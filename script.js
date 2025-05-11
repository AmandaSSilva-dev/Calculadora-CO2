// script.js

const emissoes = {
    carro: 0.192,
    uber: 0.204,
    moto: 0.103,
    onibus: 0.089,
    trem: 0.041,
    bicicleta: 0,
    pe: 0,
    aviao: 0.285
  };
  
  let etapa = "ida";
  let selectedTransports = [];
  let selectedTransportsVolta = [];
  let currentSection = 0;
  
  function renderTransportOptions(containerId, transportList, tipo) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    Object.keys(emissoes).forEach((meio) => {
      const button = document.createElement("button");
      button.className = "transport-button";
      button.innerHTML = `<i class="fas fa-${meio === 'pe' ? 'walking' : meio === 'carro' ? 'car' : meio === 'uber' ? 'taxi' : meio === 'moto' ? 'motorcycle' : meio === 'onibus' ? 'bus' : meio === 'trem' ? 'train' : meio === 'bicicleta' ? 'bicycle' : 'plane'}"></i> ${meio}`;
      button.onclick = () => handleTransportSelect(meio, tipo);
      container.appendChild(button);
    });
  }
  
  function handleTransportSelect(meio, tipo) {
    if (tipo === "ida") {
      selectedTransports.push(meio);
      document.getElementById("etapa-inicio").classList.add("hidden");
      document.getElementById("confirm-section").classList.remove("hidden");
    } else {
      selectedTransportsVolta.push(meio);
      document.getElementById("volta-section").classList.add("hidden");
      document.getElementById("confirm-section-volta").classList.remove("hidden");
    }
  }
  
  function confirmarOutro(incluir) {
    document.getElementById("confirm-section").classList.add("hidden");
    if (incluir) {
      document.getElementById("etapa-inicio").classList.remove("hidden");
    } else {
      renderDistanceInputs("distance-section", selectedTransports, "ida");
      document.getElementById("distance-section").classList.remove("hidden");
    }
  }
  
  function confirmarOutroVolta(incluir) {
    document.getElementById("confirm-section-volta").classList.add("hidden");
    if (incluir) {
      document.getElementById("volta-section").classList.remove("hidden");
    } else {
      renderDistanceInputs("distance-section-volta", selectedTransportsVolta, "volta");
      document.getElementById("distance-section-volta").classList.remove("hidden");
    }
  }
  
  function renderDistanceInputs(containerId, transportList, tipo) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    transportList.forEach((meio, index) => {
      const label = document.createElement("label");
      label.textContent = `Distância com ${meio} (km):`;
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.id = `${tipo}-km-${index}`;
      container.appendChild(label);
      container.appendChild(input);
    });
    const button = document.createElement("button");
    button.textContent = tipo === "ida" ? "Calcular Ida" : "Calcular Emissão";
    button.className = "calculate-btn";
    button.onclick = tipo === "ida" ? calcularIda : calcularVolta;
    container.appendChild(button);
  }
  
  function calcularIda() {
    const total = selectedTransports.reduce((acc, meio, index) => {
      const km = parseFloat(document.getElementById(`ida-km-${index}`).value) || 0;
      return acc + km * emissoes[meio];
    }, 0);
    document.getElementById("distance-section").classList.add("hidden");
    document.getElementById("volta-section").classList.remove("hidden");
    renderTransportOptions("transport-options-volta", selectedTransportsVolta, "volta");
    window.totalIda = total;
  }
  
  function calcularVolta() {
    const totalVolta = selectedTransportsVolta.reduce((acc, meio, index) => {
      const km = parseFloat(document.getElementById(`volta-km-${index}`).value) || 0;
      return acc + km * emissoes[meio];
    }, 0);
  
    const totalFinal = (window.totalIda || 0) + totalVolta;
  
    const resultados = document.getElementById("resultados");
    resultados.classList.remove("hidden");
    resultados.innerHTML = `
      <h2>🌱 Resultado</h2>
      <p>Emissão na ida: <strong>${window.totalIda.toFixed(2)} kg CO₂</strong></p>
      <p>Emissão na volta: <strong>${totalVolta.toFixed(2)} kg CO₂</strong></p>
      <p><strong>Total: ${totalFinal.toFixed(2)} kg CO₂</strong></p>
      <p>${totalFinal > 5 ? "💡 Tente reduzir sua pegada usando bicicleta, transporte coletivo ou caminhando!" : "👏 Muito bem! Sua pegada está baixa. Continue assim!"}</p>
    `;
  
    document.getElementById("reiniciar-btn-container").classList.remove("hidden");
    document.getElementById("distance-section-volta").classList.add("hidden");
  }
  
  function reiniciar() {
    selectedTransports = [];
    selectedTransportsVolta = [];
    etapa = "ida";
    currentSection = 0;
    document.getElementById("etapa-inicio").classList.remove("hidden");
    document.getElementById("transport-options").innerHTML = "";
    document.getElementById("transport-options-volta").innerHTML = "";
    document.getElementById("distance-section").innerHTML = "";
    document.getElementById("distance-section-volta").innerHTML = "";
    document.getElementById("resultados").innerHTML = "";
    document.getElementById("resultados").classList.add("hidden");
    document.getElementById("confirm-section").classList.add("hidden");
    document.getElementById("confirm-section-volta").classList.add("hidden");
    document.getElementById("distance-section").classList.add("hidden");
    document.getElementById("distance-section-volta").classList.add("hidden");
    document.getElementById("volta-section").classList.add("hidden");
    document.getElementById("reiniciar-btn-container").classList.add("hidden");
    renderTransportOptions("transport-options", selectedTransports, "ida");
  }
  
  // Inicializar a seleção da ida ao carregar a página
  window.onload = () => {
    renderTransportOptions("transport-options", selectedTransports, "ida");
  };
  

  