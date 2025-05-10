let usuarioLogado = null;
let estoque = {
    RN: 0, P: 0, M: 0, G: 0, GG: 0
};

const usoPorDia = {
    RN: 10, P: 8, M: 6, G: 5, GG: 4
};

function login() {
    const email = document.getElementById("email").value;
    if (email) {
        usuarioLogado = email;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("app").style.display = "block";
        carregarEstoque();
        atualizarInterface();
    }
}

function adicionarEstoque() {
    for (let tamanho in estoque) {
        const qtd = prompt(`Adicionar quantas fraldas tamanho ${tamanho}?`, "0");
        estoque[tamanho] += parseInt(qtd) || 0;
    }
    salvarEstoque();
    atualizarInterface();
}

function registrarUso() {
    for (let tamanho in estoque) {
        estoque[tamanho] -= usoPorDia[tamanho];
        if (estoque[tamanho] < 0) estoque[tamanho] = 0;
    }
    salvarEstoque();
    atualizarInterface();
}

function salvarEstoque() {
    localStorage.setItem(`estoque_${usuarioLogado}`, JSON.stringify(estoque));
}

function carregarEstoque() {
    const data = localStorage.getItem(`estoque_${usuarioLogado}`);
    if (data) estoque = JSON.parse(data);
}

function atualizarInterface() {
    let div = document.getElementById("estoque");
    div.innerHTML = "";
    for (let tamanho in estoque) {
        div.innerHTML += `<p>${tamanho}: ${estoque[tamanho]} unidades</p>`;
    }
    atualizarGraficos();
    atualizarPrevisao();
}

function atualizarGraficos() {
    const ctx = document.getElementById("graficoEstoque").getContext("2d");
    const total = Object.values(estoque).reduce((a, b) => a + b, 0);
    const data = Object.keys(estoque).map(t => total ? (estoque[t] / total) * 100 : 0);

    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(estoque),
            datasets: [{
                label: '% por tamanho',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.7)'
            }]
        }
    });
}

function atualizarPrevisao() {
    const necessidade = Object.keys(usoPorDia).map(t => `${t}: ${usoPorDia[t] * 7} fraldas/semana`).join("<br>");
    document.getElementById("necessidadeSemanal").innerHTML = `<strong>Necessidade semanal:</strong><br>${necessidade}`;

    let totalFraldas = Object.keys(estoque).reduce((soma, t) => soma + estoque[t], 0);
    let totalUsoDia = Object.values(usoPorDia).reduce((soma, uso) => soma + uso, 0);

    let diasDuracao = totalUsoDia ? Math.floor(totalFraldas / totalUsoDia) : 0;
    document.getElementById("estoqueDuracao").innerText = `Estoque atual deve durar cerca de ${diasDuracao} dia(s).`;

    const fim = new Date();
    fim.setDate(fim.getDate() + diasDuracao);
    document.getElementById("dataFimEstoque").innerText = `Previsão de término do estoque: ${fim.toLocaleDateString()}`;
}