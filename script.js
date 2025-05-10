
let users = {};
let currentUser = null;

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) return alert("Preencha todos os campos!");

  let savedUsers = JSON.parse(localStorage.getItem("fraldaUsers") || "{}");

  if (!savedUsers[username]) {
    savedUsers[username] = { password, estoque: { P: 0, M: 0, G: 0 }, uso: [] };
    localStorage.setItem("fraldaUsers", JSON.stringify(savedUsers));
  }

  if (savedUsers[username].password !== password) return alert("Senha incorreta!");

  currentUser = username;
  users = savedUsers;
  document.getElementById("login-section").style.display = "none";
  document.getElementById("app-section").style.display = "block";
  document.getElementById("user-display").innerText = currentUser;
  atualizarInterface();
}

function logout() {
  currentUser = null;
  document.getElementById("login-section").style.display = "block";
  document.getElementById("app-section").style.display = "none";
}

function registrarUso() {
  const tamanho = document.getElementById("tamanho").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  if (!quantidade || quantidade < 0) return alert("Quantidade inválida!");

  const user = users[currentUser];
  user.estoque[tamanho] -= quantidade;
  user.uso.push({ data: new Date().toISOString(), tamanho, quantidade });
  salvarDados();
  atualizarInterface();
}

function salvarDados() {
  localStorage.setItem("fraldaUsers", JSON.stringify(users));
}

function atualizarInterface() {
  const user = users[currentUser];
  const estoqueDiv = document.getElementById("estoque");
  estoqueDiv.innerHTML = "";
  for (const t of ["P", "M", "G"]) {
    estoqueDiv.innerHTML += `<p>${t}: ${user.estoque[t]} unidades</p>`;
  }
  desenharGrafico();
  mostrarResumoSemanal();
}

function desenharGrafico() {
  const ctx = document.getElementById('graficoEstoque').getContext('2d');
  const dados = users[currentUser].estoque;
  if (window.grafico) window.grafico.destroy();
  window.grafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['P', 'M', 'G'],
      datasets: [{
        data: [dados.P, dados.M, dados.G],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3']
      }]
    }
  });
}

function mostrarResumoSemanal() {
  const user = users[currentUser];
  const usoUltimos7Dias = user.uso.filter(u => {
    const dataUso = new Date(u.data);
    return (new Date() - dataUso) / (1000 * 60 * 60 * 24) <= 7;
  });
  const resumo = { P: 0, M: 0, G: 0 };
  usoUltimos7Dias.forEach(u => resumo[u.tamanho] += u.quantidade);

  const div = document.getElementById("resumoSemanal");
  div.innerHTML = "";
  for (const t of ["P", "M", "G"]) {
    div.innerHTML += `<p>Você usou ${resumo[t]} fraldas ${t} na última semana.</p>`;
    div.innerHTML += `<p>Recomendamos manter pelo menos ${resumo[t] + 5} fraldas ${t} para a próxima semana.</p>`;
  }
}
