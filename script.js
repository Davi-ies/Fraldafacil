let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
let historico = JSON.parse(localStorage.getItem('historico')) || [];

function salvarDados() {
  localStorage.setItem('estoque', JSON.stringify(estoque));
  localStorage.setItem('historico', JSON.stringify(historico));
  renderEstoque();
  renderHistorico();
}

function adicionarEstoque() {
  const tamanho = document.getElementById("tamanhoAdd").value.toUpperCase();
  const qtd = parseInt(document.getElementById("quantidadeAdd").value);

  if (!estoque[tamanho]) estoque[tamanho] = 0;
  estoque[tamanho] += qtd;

  historico.unshift({ tipo: "Adicionado", tamanho, qtd, data: new Date().toLocaleString() });

  salvarDados();
}

function registrarUso() {
  const tamanho = document.getElementById("tamanhoUso").value.toUpperCase();
  const qtd = parseInt(document.getElementById("quantidadeUso").value);

  if (!estoque[tamanho] || estoque[tamanho] < qtd) {
    alert("Estoque insuficiente!");
    return;
  }

  estoque[tamanho] -= qtd;

  historico.unshift({ tipo: "Usado", tamanho, qtd, data: new Date().toLocaleString() });

  salvarDados();
}

function renderEstoque() {
  const lista = document.getElementById("estoque-list");
  lista.innerHTML = "";
  for (const tam in estoque) {
    const li = document.createElement("li");
    li.textContent = `Tamanho ${tam}: ${estoque[tam]} fraldas`;
    if (estoque[tam] <= 10) li.style.color = "red";
    lista.appendChild(li);
  }
}

function renderHistorico() {
  const lista = document.getElementById("historico-list");
  lista.innerHTML = "";
  historico.slice(0, 10).forEach(item => {
    const li = document.createElement("li");
    li.textContent = `[${item.data}] ${item.tipo}: ${item.qtd} fralda(s) tamanho ${item.tamanho}`;
    lista.appendChild(li);
  });
}

window.onload = () => {
  renderEstoque();
  renderHistorico();
};